const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(msg) {
  const message = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync('enrichment.log', message);
  console.log(msg);
}

function getRobots(robotsPath) {
  if (!fs.existsSync(robotsPath)) return [];
  const content = fs.readFileSync(robotsPath, 'utf8');
  const bots = new Set();
  const lines = content.split('\n');
  lines.forEach(line => {
    const match = line.match(/"([^"]+)"/);
    if (match) bots.add(match[1]);
    const cleanLine = line.replace(/[",]/g, '').trim();
    if (cleanLine && cleanLine.length > 0) bots.add(cleanLine);
  });
  return Array.from(bots);
}

function fetchInteractions(repo, number) {
  try {
    const command = `gh pr view ${number} --repo ${repo} --json reviews,comments`;
    const output = execSync(command, { encoding: 'utf8' });
    const data = JSON.parse(output);
    return {
      reviews: data.reviews || [],
      comments: data.comments || []
    };
  } catch (error) {
    if (error.message.includes('rate limit exceeded')) {
      log('CRITICAL: Rate limit exceeded. Stopping process.');
      process.exit(1);
    }
    log(`Error fetching ${repo}#${number}: ${error.message}`);
    return null;
  }
}

function main() {
  const [inputFile, teamsFile, outputFile] = process.argv.slice(2);
  const prs = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const teams = JSON.parse(fs.readFileSync(teamsFile, 'utf8'));
  const savePath = outputFile || inputFile;
  
  const robotsPath = 'flutter-prs/references/robots.md';
  const allRobots = Array.from(new Set([...(teams.robots || []), ...getRobots(robotsPath)]));

  const toProcess = prs.filter(pr => {
    const state = (pr.state || '').toUpperCase();
    const isClosed = state === 'CLOSED' || state === 'MERGED' || pr.mergedAt;
    if (!isClosed) return false;
    return pr.enrichmentComplete !== true;
  });

  log(`Total closed PRs remaining to enrich: ${toProcess.length}`);

  for (let i = 0; i < toProcess.length; i++) {
    const pr = toProcess[i];
    
    if (true) {
      log(`Progress: ${i}/${toProcess.length} (Current: ${pr.repository.nameWithOwner}#${pr.number})`);
      fs.writeFileSync(savePath, JSON.stringify(prs, null, 2));
    }
    
    const interactions = fetchInteractions(pr.repository.nameWithOwner, pr.number);
    if (!interactions) continue;
    
    const allHumanInteractions = [
      ...interactions.reviews.filter(r => r.author && !allRobots.includes(r.author.login)),
      ...interactions.comments.filter(c => c.author && !allRobots.includes(c.author.login))
    ];

    if (allHumanInteractions.length > 0) {
      const earliest = allHumanInteractions.reduce((min, current) => {
        return new Date(current.createdAt) < new Date(min.createdAt) ? current : min;
      });
      const createdAt = new Date(pr.createdAt);
      const interactionAt = new Date(earliest.createdAt);
      pr.hasHumanReview = true;
      pr.timeToFirstReview = (interactionAt - createdAt) / (1000 * 60 * 60 * 24);
      pr.firstReviewer = earliest.author.login;
    } else {
      pr.hasHumanReview = false;
      pr.timeToFirstReview = null;
      pr.firstReviewer = null;
    }
    
    pr.enrichmentComplete = true;
  }

  fs.writeFileSync(savePath, JSON.stringify(prs, null, 2));
  log(`Update complete.`);
}

main();
