# Flutter PR Triage Policies

This reference defines the standards for triaging pull requests in the Flutter repository.

## Pings & Reminders
- **7-Day Grace Period:** Do NOT ping an author or reviewer if their last activity (comment, review, or functional commit) was less than 7 days ago.
- **7-Day Idle (Author/Reviewer):** If a PR has been idle for more than 7 days, it is appropriate to "ping" the person whose turn it is.
- **2 Weeks Idle (Author):** If the author has not responded or pushed significant changes in 2 weeks, add a polite comment asking if they still intend to work on the PR.
- **4 Weeks Idle (Author):** If there has been no activity for 4 weeks despite a previous ping, the PR should be closed.
- **Merge Commits:** Note that "merge from master" or "syncing" commits without functional changes do NOT reset the staleness timer.

## CI & Security
- **CICD Label:** CI checks are gated on the `CICD` label. Reviewers should apply this label ONLY after verifying there are no security risks (e.g., malicious scripts in the PR).
- **Drafts:** Do not triage or ping authors of Draft PRs.

## Approvals & Landing
- **External Contributors:** If the author is NOT a member of the Flutter/Google GitHub org, the PR requires a second approval from a member before it can land, even if one member has already approved.
- **Autosubmit:** Once a PR is fully approved, passing CI, and ready to land, it should have the `autosubmit` label applied.

## Analysis Checklist
1. **Reviewer Status:** Is a reviewer assigned? Have they commented recently?
2. **Response Loop:** Whose turn is it? (Author or Reviewer).
3. **CI Status:** Are checks passing? Is the `CICD` label missing?
4. **Staleness:** How long since the last *functional* change or comment?
5. **Membership:** Is the author a member of the `flutter` or `google` org?
