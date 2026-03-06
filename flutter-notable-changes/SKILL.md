---
name: flutter-notable-changes
description: Compile the weekly notable changes report for the Flutter repository. Use this to automate data gathering from git/gh, verify first-time contributors, and draft the report according to established engineering standards.
---

# Flutter Notable Changes

This skill automates the compilation of the weekly notable changes report for the `flutter/flutter` repository.

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated.
- Local clone of the `flutter/flutter` repository.

## Workflow

### 1. Initial Data Gathering
Get all commits from the last 7 days and select approximately 15 notable ones based on the [rubric](references/rubric.md).

```bash
git log --since="7 days ago" --pretty=format:"%H - %s"
```

### 2. Detailed Info Retrieval
For each selected PR, gather the author, approved reviewers, diff, and visual media.

```bash
gh pr view <PR_NUMBER> --json author,reviews,body,title -q '{author: .author.login, title: .title, reviewers: [.reviews[] | select(.state=="APPROVED") | .author.login] | unique, body: .body}'
gh pr diff <PR_NUMBER> --patch | head -n 50
```

### 3. First-Time Contributor Verification (CRITICAL)
Identify contributors whose first ever commit landed this week. This is a multi-step process:
1.  Check `packages/flutter/known_authors.md`.
2.  If not present, check their first commit date: `git log --author="<LOGIN>" --reverse --pretty=format:"%ci" | head -n 1`.
3.  Secondary check: `gh search commits --author-date "..<START_DATE>" --author="<LOGIN>" --repo "flutter/flutter"`.
4.  **Ask the user for manual verification** if any doubt remains.

### 4. Drafting the Report
Follow the [report template](references/report_template.md). Ensure titles are in **Sentence case** (not ALL CAPS). Summaries should explain the *benefit* or *impact*, not just the "what".

### 5. Housekeeping
- Update `packages/flutter/known_authors.md` with all unique authors from this week.
- Ensure the file is alphabetized and unique: `sort -u -o known_authors.md known_authors.md`.

## Quality Standards
- **Accuracy**: PR-Author-Reviewer links must be correct.
- **Tone**: Professional, direct, and celebratory.
- **Validation**: Re-verify a sample of data against primary sources before finality.
