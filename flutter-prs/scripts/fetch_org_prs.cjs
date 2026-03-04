const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function fetchOrgPRs(owner, dateRange, limit = 1000) {
  try {
    const command = `gh search prs --owner ${owner} --created ${dateRange} --limit ${limit} --json number,title,author,state,createdAt,closedAt,labels,repository`;
    const output = execSync(command, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error(`Error fetching PRs for owner ${owner}: ${error.message}`);
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node fetch_org_prs.cjs <owner> <dateRange> [outputFile]');
    process.exit(1);
  }

  const [owner, dateRange, outputFile] = args;
  const prs = fetchOrgPRs(owner, dateRange);

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(prs, null, 2));
    console.log(`Fetched ${prs.length} PRs from owner ${owner} for ${dateRange} and saved to ${outputFile}`);
  } else {
    console.log(JSON.stringify(prs, null, 2));
  }
}

main();
