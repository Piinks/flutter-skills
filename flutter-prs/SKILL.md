---
name: flutter-prs
description: Analyze GitHub pull requests from the Flutter organization. Generates detailed reports on team distribution, monthly trends, sub-team activity (via labels), and review latency. Use to understand community health, contributor patterns, and triage responsiveness across multiple repositories.
---

# Flutter PR Analysis

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated (`gh auth login`).
- Network access to the `flutter` organization on GitHub.

## Overview

This skill generates a comprehensive health report for the Flutter organization on GitHub. It transforms raw pull request metadata into actionable insights across five key areas:
1.  **Temporal Trends**: 28-day window comparisons of PR submissions and merges.
2.  **Team-Based Metrics**: Analysis of Googlers, Robots, flutter-hackers, and Community contributions.
3.  **Functional Sub-teams**: Detailed activity breakdown for Framework, Engine, Android, iOS, Web, etc., based on labels and repositories.
4.  **Triage Performance**: Measurement of "Time to First Human Response" (Review Latency).
5.  **Repository Deep-Dives**: Per-repository analysis for the most active projects.

## Workflow

### 1. Unified Orchestration
The recommended way to run this skill is using the `orchestrate.sh` script. It handles pagination (to bypass GitHub's 1000-result limit) and review-latency enrichment automatically.

```bash
./flutter-prs/scripts/orchestrate.sh <startDate> <endDate> [outputSubDir]
```
- **Example**: `./flutter-prs/scripts/orchestrate.sh 2025-09-02 2026-03-02 six_month_overview`
- **Output**: The report will be saved to `flutter-prs/output/<outputSubDir>/report.md`.

## Output Expectations

For every run, the user receives an output directory containing:
- **`report.md`**: The primary Markdown report containing the summary, trends, and team tables.
- **`prs.json`**: The enriched PR metadata used for the analysis.
- **`teams.json`**: Membership snapshots for Googlers, Robots, and flutter-hackers.

### Core Metrics Explained
- **Abandoned**: A PR that was closed without merging *after* receiving at least one review or comment from a non-bot human.
- **Closed w/o Review**: A PR that was closed without merging and without *any* human interaction.
- **Avg Latency (Days)**: The average time from PR creation to the first interaction (review or comment) from a non-bot human.
- **High Friction**: PRs with more than 10 comments.

## Resources & Customization

- **`references/pr_labels.md`**: Defines how GitHub labels map to functional sub-teams.
- **`references/robots.md`**: Contains a comprehensive list of bot usernames to ensure human-only latency metrics.

## Tips
- **Date Range**: Use `YYYY-MM-DD` format. Maximum recommended range is 6 months.
- **Persistence**: If you rerun analysis on the same output directory, the skill will reuse `prs.json` and `teams.json` to avoid expensive GitHub API calls.
- **Bot Filtering**: The skill automatically ignores archived repositories and uses a strict multi-layered bot identification logic.
