---
name: personal-team-weekly
description: Generate a weekly team activity report for a list of GitHub usernames within the Flutter organization. Use this skill when the user asks for a team summary, weekly snippets, or PR metrics for a specific set of developers.
---

# Weekly Team Activity Report

This skill automates the gathering of PR metrics and activity summaries for a team of Flutter developers over a 7-day period.

## Workflow

1. **Identify Team and Date Range**: Confirm the list of GitHub usernames and the 7-day window (default is the last 7 days including today).
2. **Gather Data**: Use the bundled script `scripts/get_team_activity.sh` to fetch metrics for each user.
   ```bash
   bash scripts/get_team_activity.sh "user1 user2 user3" 2026-04-04 2026-04-10
   ```
3. **Draft Summaries**: For each user, analyze their landed and open PR titles to write a concise, one-sentence summary of their main focus for the week.
4. **Format Table**: Create a markdown table with the following columns:
   - **Team Member**: Bolded username/name.
   - **Summary**: Impactful summary of focus.
   - **Reviewing**: The `TOTAL_INVOLVED_COUNT` for the user.
   - **Open PRs**: The `OPEN_COUNT`.
   - **Landed (Week)**: The `LANDED_COUNT`.
5. **Final Total**: Include the `OVERALL_TEAM_UNIQUE_COUNT` as a "TOTAL UNIQUE" row at the bottom.

## Design Principles

- **Concise Summaries**: Focus on the *intent* and *benefit* of the work, not just the "what".
- **Unique Counts**: Always report unique PR counts (deduplicated across the team) for the "Reviewing" and "Total" metrics to show the true reach of the team.
- **Verification**: If metrics look unusual, double-check using `gh search prs`.
