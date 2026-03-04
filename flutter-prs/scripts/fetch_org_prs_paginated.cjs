const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getWeeks(startDate, endDate) {
  const weeks = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current < end) {
    const startStr = current.toISOString().split('T')[0];
    current.setDate(current.getDate() + 7);
    const endStr = (current < end ? current : end).toISOString().split('T')[0];
    weeks.push(`${startStr}..${endStr}`);
  }
  return weeks;
}

function fetchWeek(owner, dateRange) {
  try {
    console.log(`Fetching PRs for ${dateRange}...`);
    const command = `gh search prs --owner ${owner} --created ${dateRange} --archived=false --visibility public --limit 1000 --json number,title,author,state,createdAt,closedAt,labels,repository,url,authorAssociation,isDraft,commentsCount`;
    const output = execSync(command, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error(`Error fetching PRs for ${dateRange}: ${error.message}`);
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node fetch_org_prs_paginated.cjs <startDate> <endDate> [outputFile]');
    process.exit(1);
  }

  const [startDate, endDate, outputFile] = args;
  const owner = 'flutter';
  const weeks = getWeeks(startDate, endDate);
  let allPRs = [];

  weeks.forEach(week => {
    const prs = fetchWeek(owner, week);
    allPRs = allPRs.concat(prs);
  });

  // Remove duplicates by number (weeks might overlap slightly)
  const uniquePRs = Array.from(new Map(allPRs.map(pr => [pr.repository.nameWithOwner + '#' + pr.number, pr])).values());

  if (outputFile) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(uniquePRs, null, 2));
    console.log(`Fetched ${uniquePRs.length} unique PRs and saved to ${outputFile}`);
  } else {
    console.log(JSON.stringify(uniquePRs, null, 2));
  }
}

main();
