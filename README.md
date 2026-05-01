# Flutter Contributor Skills

This repository contains a collection of specialized skills for [Gemini CLI](https://geminicli.com) designed to assist maintainers and contributors working **within** the Flutter GitHub organization. 

**Note:** These tools are built for repository management, health analysis, and community reporting. They are not intended for building Flutter applications themselves.

## Available Skills

### [flutter-prs](./flutter-prs/SKILL.md)
Comprehensive health analysis of GitHub pull requests across the Flutter organization.
- **Temporal Trends**: 28-day, and up to 6-month, comparisons of submissions and merges.
- **Team Metrics**: Analysis of Googlers, Robots, flutter-hackers, and Community contributions.
- **Triage Performance**: Measurement of "Time to First Human Response" (Review Latency).
- **Sub-team Activity**: Activity breakdown for Framework, Engine, Android, iOS, Web, etc.
- **Repository Deep-Dives**: Per-repository analysis for the most active projects.

### [personal-flutter-notable-changes](./personal-flutter-notable-changes/SKILL.md)
Automates the compilation of the weekly notable changes report for the `flutter/flutter` repository.
- **Data Gathering**: Automates fetching of recent commits and PR details.
- **Contributor Recognition**: Verifies first-time contributors to ensure proper attribution.
- **Report Drafting**: Generates reports based on established engineering standards and templates.

### [flutter-code-review](./flutter-code-review/SKILL.md)
Comprehensive code review of GitHub pull requests across the Flutter organization.
- **Workflow-Driven**: Guides you through checkout, initial analysis, and detailed review.
- **Issue Identification**: Uses specialized checklists to catch logic errors, breaking changes, and performance antipatterns.
- **Verification Tests**: Guides you in writing and running reproduction tests for identified issues.

### [personal-framework-release-blog](./personal-framework-release-blog/SKILL.md)
Drafts the "What's New in the Framework" section for Flutter release blogs.
- **Theme Identification**: Identifies high-level themes like Material, Web, and Accessibility from commit logs.
- **PR Verification**: Cross-references PRs with reverts/relands and ensures they are ancestors of the release tag.
- **Narrative Focus**: Groups changes into a cohesive story rather than a simple list.

### [personal-issue-closer](./personal-issue-closer/SKILL.md)
Automates the identification and closing of outdated, stale, or resolved issues.
- **Deep Investigation**: Analyzes the complete comment history and current codebase status.
- **Technical Justification**: Drafts detailed closing comments using established rationale templates.
- **Safety Protocol**: Requires explicit user approval for each issue before closing.

### [personal-issue-triage](./personal-issue-triage/SKILL.md)
Automated issue triage for Flutter teams based on established triage standards.
- **Automated Routing**: Fetches untriaged issues for specific teams based on `docs/triage/README.md`.
- **Priority Recommendations**: Suggests P0-P3 priorities based on impact and urgency signals.
- **Standardized Reporting**: Generates structured reports compatible with team triage notes.

### [personal-pr-triage](./personal-pr-triage/SKILL.md)
Automates the weekly PR triage for Flutter teams to monitor health and progress.
- **Reviewer Tracking**: Identifies PRs needing initial or second reviewers based on member associations.
- **Landing Readiness**: Verifies if PRs meet approval requirements and pass CI.
- **Activity Monitoring**: Flags stale PRs or those blocked by conflicts or CI failures.

### [personal-team-weekly](./personal-team-weekly/SKILL.md)
Generates weekly team activity reports and PR metrics for a list of GitHub usernames and triage queues.
- **Metric Gathering**: Fetches PR metrics (landed, open, involved) for developers and open PR counts for team triage queues.
- **Impact Summaries**: Drafts concise, intent-focused summaries of each team member's weekly focus.
- **Team-Wide Metrics**: Provides deduplicated unique PR counts to show the team's total reach and triage load.

## Skills in Development

We are actively working on expanding this toolkit to include:
- **Advanced Org Analysis**: Deeper insights into repository dependencies and contributor retention.

## Documentation & Resources

To learn more about using or extending these skills, check out the following resources:
- [Creating Skills with Gemini CLI](https://geminicli.com/docs/cli/creating-skills/)
- [Gemini CLI Documentation](https://geminicli.com/docs/)

## Installation

You can install these skills using the Gemini CLI via `npx`. By default, this will install them to your user scope (`~/.gemini/skills/`), making them available in all your projects.

```bash
npx @google/gemini-cli skills install https://github.com/Piinks/flutter-skills
```

To install them only for your current project, use the `--scope workspace` flag:

```bash
npx @google/gemini-cli skills install https://github.com/Piinks/flutter-skills --scope workspace
```

## Usage

These skills are automatically discovered by the Gemini CLI. You can activate them in two ways:

1.  **By Name**: Simply type the name of the skill (e.g., `personal-flutter-notable-changes`) to explicitly trigger its activation.
2.  **By Task**: Describe the task you want to perform in your prompt. The agent will autonomously identify the relevant skill and ask for your confirmation to activate it.

**Example Prompts:**
- `personal-flutter-notable-changes` (Direct activation)
- "Generate a PR health report for the last 6 months" (Task-based activation)
- "Help me compile this week's notable changes for the Flutter repo" (Task-based activation)
- "Find and close outdated team-framework issues" (Task-based activation)

You can manage available skills using the following commands:
- `/skills list`: See all discovered skills and their status.
- `/skills enable <name>`: Enable a specific skill for use.
- `/skills disable <name>`: Disable a skill to prevent it from being suggested.


