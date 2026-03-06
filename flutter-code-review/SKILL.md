---
name: flutter-code-review
description: Review Flutter repository pull requests. Checkout the PR, analyze changes and past comments, identify issues or antipatterns using a checklist, and write verification tests for any found issues.
---

# Flutter Code Review

This skill guides you through a comprehensive review of a Flutter pull request.

## Prerequisites
- GitHub CLI (`gh`) installed and authenticated.
- Local clone of the `flutter/flutter` repository.

## Workflow

### 1. Checkout the PR
Checkout the PR to your local machine to run tests and examine the full context.

```bash
gh pr checkout <PR_NUMBER> -b review-<PR_NUMBER>
```

### 2. Initial Analysis
Review the PR description, the code diff, and all existing comments or reviews to understand the current state.

```bash
gh pr view <PR_NUMBER>
gh pr diff <PR_NUMBER>
gh pr view <PR_NUMBER> --json reviews,comments
```

### 3. Detailed Code Review
Use the [Code Review Checklist](references/checklist.md) to identify issues, antipatterns, or optimization opportunities. Specifically look for:
- Logic errors or unhandled edge cases.
- **Breaking changes** in API or default behavior.
- Performance issues (e.g., object creation in build methods).
- Completeness of documentation and existing tests.

### 4. Verification & Reproduction Tests
For any issues or suspicious behavior found, write a test using the [reproduction template](references/repro_template.dart).
- Save the tests in `packages/flutter/test/review_tests_<PR_NUMBER>.dart`.
- Run the tests to confirm your findings: `flutter test <path_to_test_file>`.

### 5. Final Report
Report your review back to the user, including:
- **Overview**: A brief summary of the changes.
- **Status of Past Reviews**: Whether previous feedback has been addressed.
- **Findings**: Categorized list of issues, antipatterns, or improvements.
- **Test Summary**: Description of the verification tests you wrote and their results.

## Quality Standards
- **Evidence-Based**: Back up findings with code samples or test results.
- **Constructive**: Focus on specific improvements and rationale.
- **Thorough**: Ensure the PR is truly ready for landing before suggesting approval.
