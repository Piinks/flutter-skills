---
name: personal-issue-closer
description: A skill to identify and close outdated, stale, or resolved issues in the flutter/flutter repository based on a specific label. Use this skill when a user wants to clean up old issues, investigate their current status, and close them with detailed technical justifications.
---

## Instructions

1.  **Identify Target Issues:**
    - Ask the user for a label (e.g., `team-framework`).
    - Use `gh issue list` to find the oldest open issues with that label.
    - Sort by creation date (`created-asc`) or last update (`updated-asc`) to find the most likely candidates for being outdated.
    - Fetch at least 30-50 candidates.

2.  **Investigate Status:**
    - For each candidate, analyze its description and the **complete** comment history.
    - **Pro Tip**: Use the bundled script `scripts/fetch_issue_details.sh <number>` to get a comprehensive view of the issue and ALL its comments.
    - Compare the issue's request or reported bug with the current state of the codebase.
    - Refer to `references/rationale_templates.md` for a library of common reasons issues become outdated in Flutter.

3.  **Draft and Review Closing Comments (CRITICAL MANDATE):**
    - For issues identified as candidates for closing, draft a detailed comment for each explaining *why* it can be closed.
    - **Style Constraint**: DO NOT use em dashes (—) in the comments. Use hyphens (-) or colons (:) instead.
    - **Template**: Consult `references/rationale_templates.md` for wording inspiration.
    - Each comment MUST end with: "If there is more work to do here, please let us know by filing a new issue with up to date information. Thanks!"
    - **User Approval Required**: You MUST present the identified issues and their drafted comments to the user and obtain explicit approval BEFORE running any command that closes an issue. Skipping this step is a violation of the skill's safety protocol.

4.  **Iterate on Skill Knowledge (Learning Loop):**
    - If you discover a new, distinct category of closing rationale that is not currently covered in `references/rationale_templates.md` (e.g., a specific new framework API that replaces an old pattern), **update the reference file** to include it.
    - This ensures the skill becomes more effective over time as it "learns" from the codebase evolution.

5.  **Execute and Summarize:**
    - Once approved, use `gh issue close` with the `-c` flag to post the comment and close the issue.
    - Provide the user with a clean bulleted list of links to each closing comment.

## Examples

- **User:** "I want to find old outdated issues in the flutter/flutter repo that are labeled team-framework that we can close."
- **Agent:**
    1. Runs `gh issue list --repo flutter/flutter --label "team-framework" --limit 50 --state open --search "sort:created-asc" --json number,title,url`.
    2. Uses `scripts/fetch_issue_details.sh` to vet candidates using full comment history.
    3. Finds a new rationale (e.g., "Superseded by Dart 3 Records") and updates `references/rationale_templates.md`.
    4. Drafts comments, obtains approval, closes the issues, and provides links.

