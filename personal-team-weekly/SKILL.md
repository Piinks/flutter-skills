---
name: personal-team-weekly
description: Generate a weekly team activity report for a list of GitHub usernames within the Flutter organization. Use this skill when the user asks for a team summary, weekly snippets, or PR metrics for a specific set of developers.
---

# Weekly Team Activity Report

This skill automates the gathering of PR metrics and activity summaries for a team of Flutter developers over a 7-day period.

## Workflow

1. **Identify Team, Members, and Date Range**: Confirm the list of GitHub usernames, the 7-day window (default is the last 7 days including today), and the list of team names for triage metrics (e.g., "framework, design, accessibility").
2. **Gather Member Data**: Use `scripts/get_team_activity.sh` to fetch metrics for each user.
   ```bash
   bash scripts/get_team_activity.sh "user1 user2 user3" 2026-04-04 2026-04-10
   ```
3. **Gather Team Triage Data**: Use `scripts/get_team_triage.sh` to fetch open PR counts for specific teams.
   ```bash
   bash scripts/get_team_triage.sh "framework accessibility design text-input"
   ```
4. **Draft Summaries**: For each user, analyze their landed and open PR titles to write a concise, one-sentence summary of their main focus for the week.
5. **Format Report**:
   - **User Section**: A bulleted list of members:
     - **[@username](https://github.com/username)**: {Summary of focus}.
       - Reviewing: {TOTAL_INVOLVED_COUNT}
   - **Team Triage Section**: A "Team Triage Load" section listing the count for each requested team.
   - **Final Totals**:
     - **TOTAL UNIQUE PRs (Members)**: {OVERALL_TEAM_UNIQUE_COUNT}
     - **TOTAL UNIQUE PRs (Triage Queue)**: {OVERALL_TRIAGE_UNIQUE_COUNT}

## Design Principles

- **Concise Summaries**: Focus on the *intent* and *benefit* of the work, not just the "what".
- **Healthy Team Culture**: Avoid "leaderboards". Focus on qualitative impact and being mindful of review load (`TOTAL_INVOLVED_COUNT`).
- **Efficiency**: Use consolidated lookups and local filtering (`jq`) to minimize API calls.
- **Accuracy & Integrity**: **NEVER** present an incomplete or incorrect report. If the script hits an API rate limit or fails to gather data for any team member, do **not** create the report. Instead, inform the user about the failure and wait for further instructions.
- **Unique Counts**: Always report unique PR counts (deduplicated across the team) for the final total to show the true reach of the team.
