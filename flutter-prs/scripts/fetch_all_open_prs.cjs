const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function fetchAllOpenPRs(owner, limit = 1000) {
  try {
    console.log(`Fetching ALL open PRs for owner ${owner} (limited to ${limit} for safety)...`);
    // Note: gh search prs limit is 1000. If there are more, we might need a different approach.
    // For now, let's start with 1000 and see.
    const command = `gh search prs --owner ${owner} --state open --limit ${limit} --archived=false --visibility public --json number,title,author,state,createdAt,labels,repository,url`;
    const output = execSync(command, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error(`Error fetching open PRs for owner ${owner}: ${error.message}`);
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node fetch_all_open_prs.cjs <owner> [outputFile]');
    process.exit(1);
  }

  const [owner, outputFile] = args;
  const prs = fetchAllOpenPRs(owner);

  if (outputFile) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(prs, null, 2));
    console.log(`Fetched ${prs.length} total open PRs and saved to ${outputFile}`);
  } else {
    console.log(JSON.stringify(prs, null, 2));
  }
}

main();
