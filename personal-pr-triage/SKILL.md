# PR Triage Skill

This skill automates the weekly PR triage for Flutter teams, following the standards in `docs/triage/README.md`.

## Workflow

### 1. Identify Team and Retrieve PR Lists
- Locate the team's PR queries in `docs/triage/README.md`.
- Retrieve all open, non-draft PRs for the primary repository and any owned packages.
- Use `gh pr list --search "[QUERY] -is:draft"` to get the definitive list.

### 2. Analyze PR State (Strict Verification)
For each PR, fetch comprehensive JSON: `gh pr view --json number,title,author,authorAssociation,reviews,comments,reviewRequests,statusCheckRollup,updatedAt,files`.
- **Reviewer Status:**
    - **Needs Reviewer:** Categorize here ONLY if `reviewRequests` is empty AND NO user with `MEMBER` association has submitted a review or technical comment.
    - **Member Involvement:** Check `reviews` and `comments` for users with `MEMBER` or `OWNER` association.
- **Approval & Landing Logic:**
    - **External Authors:** Require TWO member approvals. If it has exactly one, move to **⚖️ Needs Second Reviewer**.
    - **Member Authors:** Require ONE member approval (other than themselves).
    - **Ready to Land:** Fully approved per rules above AND `statusCheckRollup` is `SUCCESS`.
- **Inactivity & Staleness:**
    - **Active Review Queue:** Functional activity (technical comments/commits) within the last 7 days.
    - **Stale:** No functional activity for > 14 days. Ping author if waiting on them, or reviewer if waiting on review.
    - **Blocked:** Explicit merge conflicts or CI failures (except for security-gated external PRs).

### 3. Generate the Report
Present the findings in `triage_report_pr_framework.md` using the following sections. Each header MUST include the PR count in parentheses. Below each header, provide a direct GitHub search link listing all PRs in that section.

**Format for Search Link:** `https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+org%3Aflutter+pr%3A+[LIST_OF_PR_NUMBERS]`

**Sections:**
- **🔍 Needs Reviewer ([COUNT])**: `Needs Initial Review`.
- **⚖️ Needs Second Reviewer ([COUNT])**: External PRs with one approval. Use `(Monitor)` suffix for high-priority items.
- **✅ Ready to Land ([COUNT])**: Approved PRs needing `autosubmit`.
- **🚨 Blocked or Stale ([COUNT])**: CI failures, conflicts, or inactivity.
- **📥 Active Review Queue ([COUNT])**: PRs with recent functional activity.

**Table Columns:**
...
...
| PR | Repo | Summary | Verification | Triage Action | Rationale |

## ⚠️ Critical Verification Mandate (Zero-Trust)
To prevent hallucinations and miscategorization, follow these rules:
1. **Never trust `reviewRequests` alone:** A PR may have NO formal requests but have an active review in the `reviews` or `comments` arrays from a member.
2. **Persistence is mandatory:** For batches > 10 PRs, save intermediate JSON data to temporary files (e.g., `audit_data.json`) before generating the report. Do not rely on memory for PR titles or association levels.
3. **Verify "Member" status:** Only users with `MEMBER` or `OWNER` association count for unblocking or landing requirements.
4. **Strict Draft Handling:** Always confirm if the triage intent includes or excludes drafts. Default to excluding (`-is:draft`) unless specified.

## 🚫 Common Pitfalls to Avoid
- **hallucinating summaries:** If you haven't read the PR body or latest comments, do not guess the summary.
- **Missing second approval:** Remember that external authors **always** require two member approvals, even if the PR is "green".
- **Stale PRs with approvals:** A PR can be "Ready to Land" but still "Stale" if it hasn't been merged. Prioritize "Ready to Land".
- **Misidentifying duplicates:** Check PR numbers carefully; do not confuse similar-sounding titles (e.g., selection overlap fixes).

## 📚 References
...
- [Flutter Triage Guide](docs/triage/README.md): Primary source for team queries and ownership.
- [Tree Hygiene](docs/contributing/Tree-hygiene.md): Standards for reviews and landing PRs.

## 🛠 Useful Scripts
**Fetch all non-draft PRs for a team:**
```bash
gh pr list --search "label:framework -label:\"f: material design\" -label:\"f: cupertino\" -is:draft sort:updated-desc" --limit 100 --json number --jq '.[].number'
```

**Fetch detailed review state for a PR:**
```bash
gh pr view [NUMBER] --json author,authorAssociation,reviewRequests,reviews,updatedAt
```

## 📝 Example Report Section
#### ⚖️ Needs Second Reviewer (1)
[https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+org%3Aflutter+pr%3A+179690](https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+org%3Aflutter+pr%3A+179690)

| PR | Repo | Summary | Verification | Triage Action | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [#179690](https://github.com/flutter/flutter/pull/179690) | flutter | Fix SliverResizingHeader focus | **Approved & Passing** | **Monitor** | External author. Approved by `Renzo-Olivares`. `Piinks` requested. |
