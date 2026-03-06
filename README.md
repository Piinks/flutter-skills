# Flutter Organization Management Skills

This repository contains a collection of specialized skills for [Gemini CLI](https://geminicli.com) designed to assist maintainers and contributors working **within** the Flutter GitHub organization. 

**Note:** These tools are built for repository management, health analysis, and community reporting. They are not intended for building Flutter applications themselves.

## Available Skills

### [flutter-prs](./flutter-prs/SKILL.md)
Comprehensive health analysis of GitHub pull requests across the Flutter organization.
- **Temporal Trends**: 28-day comparisons of submissions and merges.
- **Team Metrics**: Analysis of Googlers, Robots, flutter-hackers, and Community contributions.
- **Triage Performance**: Measurement of "Time to First Human Response" (Review Latency).
- **Sub-team Activity**: Activity breakdown for Framework, Engine, Android, iOS, Web, etc.

### [flutter-notable-changes](./flutter-notable-changes/SKILL.md)
Automates the compilation of the weekly notable changes report for the `flutter/flutter` repository.
- **Data Gathering**: Automates fetching of recent commits and PR details.
- **Contributor Recognition**: Verifies first-time contributors to ensure proper attribution.
- **Report Drafting**: Generates reports based on established engineering standards and templates.

## Skills in Development

We are actively working on expanding this toolkit to include:
- **Automated Code Review**: Assistance with initial PR triage and style checks.
- **Notable Commits Tracking**: Identifying high-impact changes outside the weekly report cycle.
- **Release Blog Drafting**: Streamlining the creation of technical content for stable releases.
- **Advanced Org Analysis**: Deeper insights into repository dependencies and contributor retention.

## Documentation & Resources

To learn more about using or extending these skills, check out the following resources:
- [Creating Skills with Gemini CLI](https://geminicli.com/docs/cli/creating-skills/)
- [Gemini CLI Documentation](https://geminicli.com/docs/)

## Usage

These skills are automatically discovered by the Gemini CLI. You can activate them in two ways:

1.  **By Name**: Simply type the name of the skill (e.g., `flutter-notable-changes`) to explicitly trigger its activation.
2.  **By Task**: Describe the task you want to perform in your prompt. The agent will autonomously identify the relevant skill and ask for your confirmation to activate it.

**Example Prompts:**
- `flutter-notable-changes` (Direct activation)
- "Generate a PR health report for the last 6 months" (Task-based activation)
- "Help me compile this week's notable changes for the Flutter repo" (Task-based activation)

You can manage available skills using the following commands:
- `/skills list`: See all discovered skills and their status.
- `/skills enable <name>`: Enable a specific skill for use.
- `/skills disable <name>`: Disable a skill to prevent it from being suggested.


