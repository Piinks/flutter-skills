const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function fetchPRs(repo, dateRange, limit = 1000) {
  try {
    const command = `gh pr list --repo ${repo} --state all --search "created:${dateRange}" --json number,title,author,state,createdAt,mergedAt,labels --limit ${limit}`;
    const output = execSync(command, { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    console.error(`Error fetching PRs for ${repo}: ${error.message}`);
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node fetch_prs.cjs <repo> <dateRange> [outputFile]');
    process.exit(1);
  }

  const [repo, dateRange, outputFile] = args;
  const prs = fetchPRs(repo, dateRange);

  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(prs, null, 2));
    console.log(`Fetched ${prs.length} PRs from ${repo} for ${dateRange} and saved to ${outputFile}`);
  } else {
    console.log(JSON.stringify(prs, null, 2));
  }
}

main();
