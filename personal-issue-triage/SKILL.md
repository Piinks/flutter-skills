---
name: personal-issue-triage
description: Automated issue triage for Flutter teams based on docs/triage/README.md. Fetches issues for a specific team, recommends team assignment or priority, and provides a summary report.
---

# Personal Issue Triage

This skill automates the routine triage of incoming GitHub issues by following the living standards in `docs/triage/README.md`. It can be used by any subteam to process their specific triage queue.

## Workflow

### 1. Identify Team and Retrieve Search Query
- Read `docs/triage/README.md` to locate the "Incoming issue list" search query for the requested team (e.g., `team-framework`, `team-engine`).
- Execute `gh issue list --search "[QUERY]"` to fetch untriaged issues for that team.

### 2. Analyze and Recommend (Dual-Mode)
For each issue, determine if the current team (e.g., `team-framework`) owns it:

#### **A. Team Triage (Owned Issues)**
*If the issue has the team's label (e.g., `team-framework`):*
- **Recommend Priority:** (`P0`, `P1`, `P2`, `P3`) based on [references/priority.md](references/priority.md).
- **Recommend Triage Label:** (e.g., `triaged-framework`).
- **Rationale:** Technical impact + urgency signals (upvotes, keywords, CI signal).

#### **B. Routing/Review Triage (FYI or Non-Owned Issues)**
*If the issue is `fyi-team` (e.g., `fyi-framework`) or needs redirection:*
- **Recommend Triage Label:** (e.g., `triaged-framework`) to signal the review is complete for this team.
- **Action:** DO NOT assign a priority label; this is the responsibility of the owner team (e.g., `team-ios`).
- **Rationale:** Why the review is complete or why it belongs to a different team.

### 3. User Review
Present the recommendations for user approval in a structured report titled **Issue Triage Report** using the following heading levels for compatibility with triage notes:
- **Title (H3):** `### Issue Triage Report: [TEAM] [DATE]`
- **🚨 Urgent Attention (H4):** `#### 🚨 Urgent Attention`
- **📥 Standard Queue (H4):** `#### 📥 Standard Queue`

The report should include:
    - **Issue:** Number and Title.
    - **Verification Status:** (e.g., `Verified ✅`, `Failed to Reproduce ❌`, `User Error/Help Request ℹ️`).
    - **Summary:** A 1-2 sentence explanation of the problem and why it belongs to the target team.
    - **Triage Action:** Priority (if owner) and Triage labels.
    - **Rationale:** Why that specific priority/action was chosen.

#### **C. Non-Actionable / User Issues**
*If the issue is a help request, duplicate, or cannot be reproduced:*
- **Action:** Recommend `r: invalid`, `r: duplicate`, or `waiting for customer response`.
- **Rationale:** Cite specific reasons (e.g., "Documentation in api.flutter.dev covers this", "Provided script runs without error").

### 4. Execute and Report
Apply labels using `gh issue edit`. Provide a final summary of actions.

## References
- [docs/triage/README.md](../../docs/triage/README.md) - Living triage standards and search links.
- [references/priority.md](references/priority.md) - Local P0-P3 definitions and urgency signals.
