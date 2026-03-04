const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function fetchTeamMembers(org, teamSlug) {
  try {
    console.log(`Fetching members for team: ${teamSlug}...`);
    const command = `gh api orgs/${org}/teams/${teamSlug}/members --paginate --jq '.[].login'`;
    const output = execSync(command, { encoding: 'utf8' }).trim();
    return output ? output.split('\n') : [];
  } catch (error) {
    console.error(`Error fetching team ${teamSlug}: ${error.message}`);
    return [];
  }
}

function main() {
  const org = 'flutter';
  // Replaced 'collaborators' with 'flutter-hackers' as requested
  const teams = ['googlers', 'robots', 'flutter-hackers'];
  const teamData = {};

  teams.forEach(team => {
    teamData[team] = fetchTeamMembers(org, team);
  });

  const outputPath = process.argv[2] || 'teams.json';
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(teamData, null, 2));
  console.log(`Saved team membership to ${outputPath}`);
}

main();
