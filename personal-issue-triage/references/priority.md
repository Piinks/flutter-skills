# Flutter Issue Triage & Priority Reference

This reference defines the standards for triaging issues in the Flutter repository.

## Priority Labels

### P0: Critical / Blocker
- **Description:** Regressions, critical security vulnerabilities, or bugs that block the entire development process or a release.
- **Criteria:**
    - Affects many users and has no workaround.
    - Breaks basic functionality that previously worked.
    - Security issue with high impact.

### P1: High Priority
- **Description:** Important bugs or feature requests that significantly impact a large number of users or key features.
- **Criteria:**
    - High impact on user experience.
    - Affects many users with a difficult workaround.
    - Regression from a recent stable release.

### P2: Medium Priority (Default)
- **Description:** Standard bugs and feature requests.
- **Criteria:**
    - Significant impact on a small number of users.
    - Minor impact on many users.
    - Reasonable workaround exists.
    - Most feature requests fall here.

### P3: Low Priority
- **Description:** Minor bugs, edge cases, or "nice to have" feature requests.
- **Criteria:**
    - Affects very few users.
    - Minimal impact on user experience.
    - Easy workaround exists.
    - Polishing tasks.

## Triage Labels

- **triaged-framework**: Use this label when the issue has been reviewed, prioritized, and assigned to the framework team's scope.
- **will need additional triage**: Use if more information is needed from the reporter or if it requires a specialist's eyes before a final priority can be set.
- **waiting for customer response**: Use when you've asked the reporter for more information (e.g., a reproduction script).

## Urgency Signals

In addition to technical impact, look for the following "Urgency Signals" to bubble up issues:

### 1. Popularity & Reach
- **Upvotes (Reactions):** High `THUMBS_UP` or `HEART` counts (e.g., >10) indicate a widespread issue or highly desired feature.
- **Comment Volume:** A high number of comments (e.g., >15) or many unique participants suggests significant community interest or frustration.
- **Frequency:** Multiple new comments within the last 24-48 hours indicate an active, ongoing problem.

### 2. Community Sentiment
- **Keywords:** Scan comments for "urgent", "blocking", "broken", "major regression", "unusable", "reverting", "showstopper".
- **Me-too reports:** Many users confirming the issue with "+1" or "happening for me too" comments.

### 3. Business/Release Impact
- **Release Blocking:** Explicit mention of a deadline or a blocker for a specific release (stable, beta).
- **Critical Service Impact:** Mention of high-traffic or high-profile applications being affected.

## Analysis Checklist
1. **Is it a valid issue?** (Clear description, reproduction steps, or relevant logs).
2. **Empirical Validation:** If a reproduction script is provided, attempt to run it locally (`flutter run`, `dart run`).
3. **Is it a regression?** (Search for "worked before", "recently started happening").
4. **What is the impact?** (How many users? How severe?).
5. **Urgency Check:** Does it have high popularity or critical sentiment?
6. **Is there a workaround?**
