const fs = require('fs');
const path = require('path');

// Helper to load references
function loadReference(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return '';
}

// Simple bot list parser from robots.md
function getRobots(robotsContent, teamsRobots) {
  const bots = new Set(teamsRobots || []);
  const lines = robotsContent.split('\n');
  lines.forEach(line => {
    const match = line.match(/"([^"]+)"/);
    if (match) bots.add(match[1]);
    const cleanLine = line.replace(/[",]/g, '').trim();
    if (cleanLine && cleanLine.length > 0) bots.add(cleanLine);
  });
  return Array.from(bots);
}

function isRobot(author, robots) {
  const lAuthor = author.toLowerCase();
  return robots.includes(author) || 
         lAuthor.endsWith('[bot]') || 
         lAuthor.endsWith('-bot') || 
         lAuthor.includes('-roller') || 
         lAuthor.includes('-autoroll');
}

function getTeam(author, teams, robots) {
  if (isRobot(author, robots)) return 'Robots';
  if (teams.googlers.includes(author)) return 'Googlers';
  if (teams['flutter-hackers'] && teams['flutter-hackers'].includes(author)) return 'flutter-hackers';
  return 'Community';
}

function getSubTeams(pr, robots) {
  const repo = pr.repository.nameWithOwner;
  const labels = pr.labels.map(l => l.name.toLowerCase());
  const authorLogin = pr.author ? pr.author.login : 'unknown';

  if (isRobot(authorLogin, robots)) return ['Robots'];

  const assigned = [];

  if (repo === 'flutter/flutter') {
    if (labels.includes('a: accessibility')) assigned.push('Accessibility');
    if (labels.includes('team-android') || labels.includes('platform-android')) assigned.push('Android');
    if (labels.includes('f: material design') || labels.includes('f: cupertino')) assigned.push('Design Languages');
    if (labels.includes('engine') && !labels.includes('platform-web')) assigned.push('Engine');
    if (labels.includes('framework') && !labels.includes('f: material design') && !labels.includes('f: cupertino')) assigned.push('Framework');
    if (labels.includes('platform-ios') || labels.includes('team-ios')) assigned.push('iOS');
    if (labels.includes('platform-macos')) assigned.push('MacOS');
    if (labels.includes('platform-linux')) assigned.push('Linux');
    if (labels.includes('a: text input') || labels.includes('f: selection') || labels.includes('team-text-input') || labels.includes('fyi-text-input')) assigned.push('Text Input');
    if (labels.includes('tool')) assigned.push('Tool');
    if (labels.includes('platform-web')) assigned.push('Web');
    if (labels.includes('platform-windows')) assigned.push('Windows');
  } else if (repo === 'flutter/packages') {
    if (labels.includes('triage-android') || labels.includes('platform-android')) assigned.push('Android');
    if (labels.includes('triage-framework')) assigned.push('Framework');
    if (labels.includes('triage-ios')) assigned.push('iOS');
    if (labels.includes('triage-macos')) assigned.push('MacOS');
    if (labels.includes('triage-linux')) assigned.push('Linux');
    if (labels.includes('triage-web')) assigned.push('Web');
    if (labels.includes('triage-windows')) assigned.push('Windows');
    if (!labels.some(l => l.startsWith('triage-'))) assigned.push('Ecosystem');
  } else if (repo === 'flutter/cocoon') {
    assigned.push('Infra');
  } else if (repo === 'flutter/devtools' || repo === 'flutter/skills' || repo === 'flutter/intellij' || repo === 'flutter/dart-intellij-third-party' || repo === 'flutter/flutter-intellij') {
    assigned.push('DevExp');
  } else if (repo === 'flutter/website') {
    assigned.push('iX');
  } else if (repo === 'flutter/dash-evals' || repo === 'flutter/demos' || repo === 'flutter/samples' || repo === 'flutter/io_flip' || repo === 'flutter/pinball') {
    assigned.push('DevRel');
  } else if (repo === 'flutter/genui') {
    assigned.push('genUI');
  } else if (repo === 'flutter/website-cms') {
    assigned.push('Website-CMS');
  }

  return assigned.length > 0 ? assigned : ['Unowned'];
}

function initMetrics() {
  return { 
    total: 0, merged: 0, abandoned: 0, closedNoReview: 0, open: 0, 
    latencySum: 0, latencyCount: 0,
    closeTimes: [],
    stale: 0, veryStale: 0,
    highFrictionTotal: 0, highFrictionMerged: 0,
    newContributors: new Set(),
    newContributorMerged: 0
  };
}

function calculateMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function formatLatency(sum, count) {
  if (count === 0) return 'N/A';
  return (sum / count).toFixed(2);
}

function formatValue(val, total) {
  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
  return `${val} (${pct}%)`;
}

function updateMetrics(m, pr, endDate) {
  m.total++;
  const state = pr.state ? pr.state.toUpperCase() : 'UNKNOWN';
  const isMerged = state === 'MERGED' || (pr.mergedAt && pr.mergedAt !== '0001-01-01T00:00:00Z');
  const created = new Date(pr.createdAt);
  
  if (isMerged) {
    m.merged++;
    const closed = new Date(pr.closedAt || pr.mergedAt);
    if (!isNaN(created) && !isNaN(closed)) m.closeTimes.push((closed - created) / (1000 * 60 * 60 * 24));
  } else if (state === 'OPEN' || state === 'open') {
    m.open++;
    const age = (endDate - created) / (1000 * 60 * 60 * 24);
    if (age > 90) m.veryStale++; else if (age > 30) m.stale++;
  } else if (state === 'CLOSED' || state === 'closed') {
    if (pr.hasHumanReview) m.abandoned++; else m.closedNoReview++;
    const closed = new Date(pr.closedAt);
    if (!isNaN(created) && !isNaN(closed)) m.closeTimes.push((closed - created) / (1000 * 60 * 60 * 24));
  }

  if (pr.commentsCount > 10) { m.highFrictionTotal++; if (isMerged) m.highFrictionMerged++; }
  if (pr.authorAssociation === 'FIRST_TIME_CONTRIBUTOR' || pr.authorAssociation === 'FIRST_TIMER') {
    m.newContributors.add(pr.author.login);
    if (isMerged) m.newContributorMerged++;
  }

  if (pr.timeToFirstReview !== null && pr.timeToFirstReview !== undefined) {
    if (pr.timeToFirstReview > 0.001) {
      m.latencySum += pr.timeToFirstReview;
      m.latencyCount++;
      if (pr.firstReviewer) {
        if (!m.firstReviewers) m.firstReviewers = {};
        m.firstReviewers[pr.firstReviewer] = (m.firstReviewers[pr.firstReviewer] || 0) + 1;
      }
    }
  }
}

function generateCombinedPerformanceTable(metricsMap, title) {
  let report = `### ${title}\n\n`;
  report += `| Category | Merge Rate | Avg Close (Days) | Median Close (Days) | Avg Latency (Days) | New Contribs | High Friction Merge Rate |\n`;
  report += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  const sortedKeys = Object.keys(metricsMap).sort();
  sortedKeys.forEach(key => {
    if (key === 'Robots') return;
    const m = metricsMap[key];
    if (m.total === 0) return;
    const mergeRate = m.total > 0 ? ((m.merged / m.total) * 100).toFixed(1) + '%' : 'N/A';
    const avgClose = m.closeTimes.length > 0 ? (m.closeTimes.reduce((a, b) => a + b, 0) / m.closeTimes.length).toFixed(1) : 'N/A';
    const medianClose = m.closeTimes.length > 0 ? calculateMedian(m.closeTimes).toFixed(1) : 'N/A';
    const latency = formatLatency(m.latencySum, m.latencyCount);
    const frictionRate = m.highFrictionTotal > 0 ? ((m.highFrictionMerged / m.highFrictionTotal) * 100).toFixed(1) + '%' : 'N/A';
    report += `| ${key} | ${mergeRate} | ${avgClose} | ${medianClose} | ${latency} | ${m.newContributors.size} | ${frictionRate} |\n`;
  });
  report += `\n`;
  return report;
}

function generateTable(metricsMap, totals, title) {
  let report = `### ${title}\n\n`;
  report += `| Category | Total PRs | Merged | Abandoned | Closed w/o Review | Open | Stale (>30d) |\n`;
  report += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  const sortedKeys = Object.keys(metricsMap).sort();
  sortedKeys.forEach(key => {
    if (key === 'Robots') return;
    const m = metricsMap[key];
    if (m.total === 0) return;
    report += `| ${key} | ${formatValue(m.total, totals.total)} | ${formatValue(m.merged, totals.merged)} | ${formatValue(m.abandoned, totals.abandoned)} | ${formatValue(m.closedNoReview, totals.closedNoReview)} | ${formatValue(m.open, totals.open)} | ${m.stale + m.veryStale} |\n`;
  });
  report += `\n`;
  return report;
}

function getTrends(prs, endDate, robots) {
  const periods = [];
  for (let i = 0; i < 6; i++) {
    const pEnd = new Date(endDate); pEnd.setDate(pEnd.getDate() - (i * 28));
    const pStart = new Date(pEnd); pStart.setDate(pStart.getDate() - 28);
    periods.push({ start: pStart, end: pEnd, label: `${pStart.toISOString().split('T')[0]} to ${pEnd.toISOString().split('T')[0]}`, submitted: 0, merged: 0 });
  }
  prs.forEach(pr => {
    if (isRobot(pr.author.login, robots)) return;
    const created = new Date(pr.createdAt);
    periods.forEach(p => {
      if (created >= p.start && created < p.end) {
        p.submitted++;
        const state = pr.state ? pr.state.toUpperCase() : 'UNKNOWN';
        if (state === 'MERGED' || (pr.mergedAt && pr.mergedAt !== '0001-01-01T00:00:00Z')) p.merged++;
      }
    });
  });
  return periods.reverse().map((p, i, arr) => {
    const prev = i > 0 ? arr[i - 1] : null;
    return { label: p.label, submitted: p.submitted, merged: p.merged, subDiff: prev ? p.submitted - prev.submitted : 0, mergeDiff: prev ? p.merged - prev.merged : 0 };
  });
}

function getBacklogHealth(prs, endDate, robots) {
  const openPRs = prs.filter(pr => (pr.state === 'OPEN' || pr.state === 'open') && !isRobot(pr.author.login, robots));
  if (openPRs.length === 0) return null;
  const ages = openPRs.map(pr => (endDate - new Date(pr.createdAt)) / (1000 * 60 * 60 * 24)).sort((a, b) => a - b);
  return { total: openPRs.length, avg: (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1), median: ages[Math.floor(ages.length / 2)].toFixed(1), max: ages[ages.length - 1].toFixed(1), oldest: openPRs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).slice(0, 10) };
}

function generateInsights(humanTotals, teamMetrics, subteamMetrics) {
  let insights = `## Key Insights & Bottlenecks (Humans Only)\n\n`;
  const unowned = subteamMetrics['Unowned'];
  if (unowned && unowned.closedNoReview > 0) {
    const pct = ((unowned.closedNoReview / humanTotals.closedNoReview) * 100).toFixed(1);
    const searchUrl = `https://github.com/pulls?q=is%3Apr+is%3Aopen+org%3Aflutter+is%3Apublic+-label%3A%22a%3A+accessibility%22+-label%3Aengine+-label%3Aframework+-label%3Atool+-label%3Aplatform-android+-label%3Ateam-android+-label%3Aplatform-ios+-label%3Ateam-ios+-label%3Aplatform-web+-label%3Aplatform-macos+-label%3Aplatform-linux+-label%3Aplatform-windows+-label%3A%22f%3A+material+design%22+-label%3A%22f%3A+cupertino%22+-label%3A%22a%3A+text+input%22+-label%3A%22f%3A+selection%22+-label%3Ateam-text-input+-label%3Afyi-text-input+-repo%3Aflutter%2Fpackages+-repo%3Aflutter%2Fcocoon+-repo%3Aflutter%2Fdevtools+-repo%3Aflutter%2Fskills+-repo%3Aflutter%2Fintellij+-repo%3Aflutter%2Fflutter-intellij+-repo%3Aflutter%2Fwebsite+-repo%3Aflutter%2Fdash-evals+-repo%3Aflutter%2Fdemos+-repo%3Aflutter%2Fsamples+-repo%3Aflutter%2Fio_flip+-repo%3Aflutter%2Fgenui`;
    insights += `- **Triage Gap**: **${pct}%** of all human PRs closed without review were **Unowned** (no functional label). Missing labels remain a significant barrier. [View all open unowned PRs on GitHub](${searchUrl})\n`;
  }
  const humanSubteams = Object.entries(subteamMetrics).filter(([name]) => name !== 'Robots' && name !== 'Automated changes' && name !== 'Unowned');
  const highLatency = humanSubteams.filter(([_, m]) => m.latencyCount > 2).sort((a, b) => (b[1].latencySum / b[1].latencyCount) - (a[1].latencySum / a[1].latencyCount)).slice(0, 3);
  if (highLatency.length > 0) {
    insights += `- **Latency Bottlenecks**: The following teams have the highest average human review latency:\n`;
    highLatency.forEach(([name, m]) => insights += `  - **${name}**: ${(m.latencySum / m.latencyCount).toFixed(1)} days\n`);
  }
  const mostStale = humanSubteams.sort((a, b) => (b[1].stale + b[1].veryStale) - (a[1].stale + a[1].veryStale))[0];
  if (mostStale && (mostStale[1].stale + mostStale[1].veryStale) > 0) {
    insights += `- **Backlog Volume**: The **${mostStale[0]}** team currently holds the largest backlog of stale human-authored PRs (${mostStale[1].stale + mostStale[1].veryStale} items >30 days old).\n`;
  }
  insights += `\n`;
  return insights;
}

function generateHealthSection(humanTotals, teamMetrics, subteamMetrics) {
  let health = `## 1. Organization Health Overview\n\n`;
  const avgClose = (humanTotals.closeTimes.reduce((a, b) => a + b, 0) / Math.max(1, humanTotals.closeTimes.length)).toFixed(1);
  const medianClose = calculateMedian(humanTotals.closeTimes).toFixed(1);
  health += `### 1. Process Efficiency\n`;
  health += `- **Human Throughput**: Average time to close is **${avgClose} days** (Median: **${medianClose} days**).\n`;
  health += `- **Responsiveness**: Overall human review latency (time from PR creation to first human comment or review) is **${(humanTotals.latencySum / Math.max(1, humanTotals.latencyCount)).toFixed(2)} days**.\n\n`;
  const community = teamMetrics['Community'];
  health += `### 2. Community Growth\n`;
  health += `- **New Contributors**: **${community.newContributors.size}** people made their first contribution this period.\n`;
  health += `- **Community Success**: **${((community.merged / Math.max(1, community.total)) * 100).toFixed(1)}%** of community PRs land.\n\n`;
  
  const googlersM = teamMetrics['Googlers'];
  const hackersM = teamMetrics['flutter-hackers'];
  const totalHumanMerged = googlersM.merged + hackersM.merged + community.merged;
  const maintainerShare = (((googlersM.merged + hackersM.merged) / Math.max(1, totalHumanMerged)) * 100).toFixed(1);
  health += `### 3. Maintainer Burden\n`;
  health += `- **Review Capacity**: Maintainers (Googlers + Hackers) account for **${maintainerShare}%** of all merged human PRs.\n`;
  health += `- **Staleness**: There are **${humanTotals.stale + humanTotals.veryStale}** human-authored open PRs currently aging past 30 days.\n\n`;
  
  const landedWithReview = humanTotals.merged;
  const abandonedWithReview = humanTotals.abandoned;
  const followThrough = ((landedWithReview / Math.max(1, (landedWithReview + abandonedWithReview))) * 100).toFixed(1);
  health += `### 4. Follow-through\n`;
  health += `- **Review Quality**: Of the human PRs that received a human review, **${followThrough}%** were successfully merged.\n`;
  
  const nonGooglersFT = {
    merged: teamMetrics['Community'].merged + teamMetrics['flutter-hackers'].merged,
    abandoned: teamMetrics['Community'].abandoned + teamMetrics['flutter-hackers'].abandoned
  };
  const googlerFTVal = ((googlersM.merged / Math.max(1, (googlersM.merged + googlersM.abandoned))) * 100).toFixed(1);
  const nonGooglerFTVal = ((nonGooglersFT.merged / Math.max(1, (nonGooglersFT.merged + nonGooglersFT.abandoned))) * 100).toFixed(1);
  health += `- **Alignment by Author**: Googler-authored PRs have a **${googlerFTVal}%** follow-through rate, while non-Googler human PRs (Community + flutter-hackers) land at **${nonGooglerFTVal}%**.\n\n`;
  
  return health;
}

function generateGlossary() {
  let glossary = `## Glossary of Terms\n\n`;
  glossary += `- **Abandoned**: A PR that was closed without merging *after* receiving at least one review or comment from a non-bot human.\n`;
  glossary += `- **Closed w/o Review**: A PR that was closed without merging and without *any* human interaction (no comments, no reviews).\n`;
  glossary += `- **High Friction**: PRs containing more than **10 comments**, indicating complex reviews or significant discussion.\n`;
  glossary += `- **Avg Latency (Days)**: The average time from PR creation to the very first comment or review from a non-bot human.\n`;
  glossary += `- **Stale / Very Stale**: Open PRs that have been inactive for more than **30 days** (Stale) or **90 days** (Very Stale).\n`;
  glossary += `- **flutter-hackers**: Members of the official Flutter organization "collaborators" team.\n\n`;
  return glossary;
}

function generateSummary(humanTotals, teamMetrics, subteamMetrics, trends, backlog, globalBacklog) {
  let summary = `## Executive Summary (Humans Only)\n\n`;
  summary += `- **Total Activity**: ${humanTotals.total} PRs submitted by humans with a **${((humanTotals.merged / Math.max(1, humanTotals.total)) * 100).toFixed(1)}%** merge rate.\n`;
  const topHumanMergedTeam = Object.entries(teamMetrics).filter(([name]) => name !== 'Robots').sort((a, b) => b[1].merged - a[1].merged)[0];
  if (topHumanMergedTeam) summary += `- **Most Active Contributor Type (Merged PRs)**: **${topHumanMergedTeam[0]}** (${topHumanMergedTeam[1].merged} merged).\n`;
  const responsiveSubTeam = Object.entries(subteamMetrics).filter(([name, m]) => m.latencyCount > 0 && name !== 'Robots' && name !== 'Automated changes' && name !== 'Unowned').sort((a, b) => (a[1].latencySum / a[1].latencyCount) - (b[1].latencySum / b[1].latencyCount))[0];
  if (responsiveSubTeam) summary += `- **Most Responsive Sub-team**: **${responsiveSubTeam[0]}** with an average human review latency of ${(responsiveSubTeam[1].latencySum / responsiveSubTeam[1].latencyCount).toFixed(2)} days.\n`;
  if (trends.length >= 2) {
    const latest = trends[trends.length - 1], prev = trends[trends.length - 2];
    const subChange = prev.submitted > 0 ? ((latest.submitted - prev.submitted) / prev.submitted * 100).toFixed(1) : "0.0";
    const direction = latest.submitted >= prev.submitted ? "up" : "down";
    summary += `- **Human Trend**: PR submissions in the latest 28-day period are **${direction} ${Math.abs(subChange)}%** compared to the previous period.\n`;
  }
  if (globalBacklog) summary += `- **Org-wide Backlog**: Currently **${globalBacklog.total}** total human-authored open PRs across the org with an **oldest PR from ${globalBacklog.oldest[0].createdAt.split('T')[0]}**.\n`;
  summary += `\n`;
  return summary;
}

function main() {
  const [inputFile, teamsFile, target, dateRange, outputFile, globalBacklogFile] = process.argv.slice(2);
  const prs = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const teams = JSON.parse(fs.readFileSync(teamsFile, 'utf8'));
  const parts = dateRange.split('..'), endDate = new Date(parts[parts.length - 1]);
  if (isNaN(endDate.getTime())) process.exit(1);

  const robotsContent = loadReference('flutter-prs/references/robots.md');
  const allRobots = getRobots(robotsContent, teams.robots);

  const orgMetrics = {
    teams: { 'Googlers': initMetrics(), 'Robots': initMetrics(), 'flutter-hackers': initMetrics(), 'Community': initMetrics() },
    subteams: {}, repos: {}
  };
  const humanTotals = initMetrics(), orgTotals = initMetrics();

  prs.forEach(pr => {
    const team = getTeam(pr.author.login, teams, allRobots);
    const assignedSubTeams = getSubTeams(pr, allRobots);
    const repo = pr.repository.nameWithOwner;
    
    updateMetrics(orgTotals, pr, endDate);
    updateMetrics(orgMetrics.teams[team], pr, endDate);
    if (team !== 'Robots') updateMetrics(humanTotals, pr, endDate);
    
    assignedSubTeams.forEach(st => {
      if (!orgMetrics.subteams[st]) orgMetrics.subteams[st] = initMetrics();
      updateMetrics(orgMetrics.subteams[st], pr, endDate);
    });

    if (!orgMetrics.repos[repo]) {
      orgMetrics.repos[repo] = { totals: initMetrics(), teams: { 'Googlers': initMetrics(), 'Robots': initMetrics(), 'flutter-hackers': initMetrics(), 'Community': initMetrics() } };
    }
    updateMetrics(orgMetrics.repos[repo].totals, pr, endDate);
    updateMetrics(orgMetrics.repos[repo].teams[team], pr, endDate);
  });

  const trends = getTrends(prs, endDate, allRobots);
  const periodBacklog = getBacklogHealth(prs, endDate, allRobots);
  let globalBacklog = globalBacklogFile && fs.existsSync(globalBacklogFile) ? getBacklogHealth(JSON.parse(fs.readFileSync(globalBacklogFile, 'utf8')), endDate, allRobots) : null;

  let report = `# PR Analysis Report for ${target}\n\n**Date Range:** ${dateRange}\n\n`;
  report += generateSummary(humanTotals, orgMetrics.teams, orgMetrics.subteams, trends, periodBacklog, globalBacklog);
  report += generateGlossary();
  report += generateInsights(humanTotals, orgMetrics.teams, orgMetrics.subteams);
  report += `\n---\n\n`;
  report += generateHealthSection(humanTotals, orgMetrics.teams, orgMetrics.subteams);

  if (globalBacklog) {
    report += `## 2. Org-wide Backlog Status\n\n- **Total Human Open PRs**: ${globalBacklog.total}\n- **Median Age**: ${globalBacklog.median} days\n- **Average Age**: ${globalBacklog.avg} days\n\n`;
    report += `### 10 Oldest Open Human PRs\n\n| Created | Repo | PR | Owning Team | Author | Team | Title |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    globalBacklog.oldest.forEach(pr => report += `| ${pr.createdAt.split('T')[0]} | ${pr.repository.nameWithOwner} | [#${pr.number}](${pr.url}) | ${getSubTeams(pr, allRobots).join(', ')} | ${pr.author.login} | ${getTeam(pr.author.login, teams, allRobots)} | ${pr.title} |\n`);
    report += `\n`;
  }

  report += `## 3. Team Performance Metrics\n\n`;
  report += generateCombinedPerformanceTable(orgMetrics.teams, "Performance by Team Type");
  report += `## 4. Human Activity Trends (28-Day Windows)\n\n| Period | Submitted | Trend | Merged | Trend |\n| :--- | :--- | :--- | :--- | :--- |\n`;
  trends.forEach(t => {
    const subTrend = t.subDiff > 0 ? `+${t.subDiff} 📈` : (t.subDiff < 0 ? `${t.subDiff} 📉` : '-');
    const mergeTrend = t.mergeDiff > 0 ? `+${t.mergeDiff} 📈` : (t.mergeDiff < 0 ? `${t.mergeDiff} 📉` : '-');
    report += `| ${t.label} | ${t.submitted} | ${subTrend} | ${t.merged} | ${mergeTrend} |\n`;
  });
  report += `\n\n---\n\n## APPENDICES: Detailed Breakdown\n\n### A. Org-wide Volume & State (All Humans)\n\n`;
  report += generateTable(orgMetrics.teams, humanTotals, "Volume by Team Type");
  report += `### B. Functional Sub-team Performance\n\n`;
  report += `*Note: N/A indicates that no PRs for that team met the specific criteria for the metric during this period (e.g., zero high-friction PRs or zero human responses).* \n\n`;
  report += generateCombinedPerformanceTable(orgMetrics.subteams, "Performance by Functional Area");
  report += generateTable(orgMetrics.subteams, humanTotals, "Volume by Functional Area");
  report += `### C. Per-Repository Distribution\n\n`;
  Object.entries(orgMetrics.repos).sort((a, b) => b[1].totals.total - a[1].totals.total).slice(0, 5).forEach(([repo, data]) => {
    report += `#### Repository: ${repo}\n\n${generateTable(data.teams, data.totals, `Distribution for ${repo}`)}`;
    if (data.totals.firstReviewers) {
      report += `\n**First Reviewers for ${repo}**:\n`;
      const sortedReviewers = Object.entries(data.totals.firstReviewers).sort((a, b) => b[1] - a[1]);
      report += sortedReviewers.map(([name, count]) => `* ${name}: ${count}`).join(', ') + '\n\n';
    }
  });
  report += `\n\n*Abandoned: Closed without merging after receiving at least one human review.\n\n`;
  if (outputFile) { fs.mkdirSync(path.dirname(outputFile), { recursive: true }); fs.writeFileSync(outputFile, report); console.log(`Report saved to ${outputFile}`); } else { console.log(report); }
}

main();
