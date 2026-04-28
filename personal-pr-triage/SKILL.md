---
name: personal-pr-triage
description: Automates the weekly PR triage for Flutter teams, following the standards in docs/triage/README.md.
---

# PR Triage Skill

This skill automates the weekly PR triage for Flutter teams, following the standards in `docs/triage/README.md`.

## Workflow

### 1. Identify Team and Retrieve PR Lists
- Locate the team's PR queries in `docs/triage/README.md`.
- Retrieve ALL open, non-draft PRs for the primary repository and any owned packages.
- Use `gh pr list --search "[QUERY] -is:draft" --limit 100 --json number --jq '.[].number'` to get the lists.

### 2. Fetch Detailed Audit Data
For each PR number, fetch comprehensive JSON and save to `audit_data.json` (for main repo) and `packages_audit_data.json` (for packages).
- Required fields: `number,title,author,reviews,comments,reviewRequests,statusCheckRollup,updatedAt,reviewDecision,labels,url`.
- Example loop:
```bash
echo "[" > audit_data.json
first=true
for num in $(cat pr_numbers.txt); do
  if [ "$first" = true ]; then first=false; else echo "," >> audit_data.json; fi
  gh pr view $num --json number,title,author,reviews,comments,reviewRequests,statusCheckRollup,updatedAt,reviewDecision,labels,url >> audit_data.json
done
echo "]" >> audit_data.json
```

### 3. Generate the Report
Run the bundled triage script to process the data and generate `triage_report_pr_[TEAM].md`.
```bash
python3 .agents/skills/personal-pr-triage/scripts/generate_triage_report.py [TEAM_NAME]
```

## ⚠️ Critical Verification Mandate (Zero-Trust)
1. **Zero Redundancy**: NEVER use labels like "Summary:", "Notes:", or "Action:". Use "To-do:" for actions.
2. **Action Precision**: 
    - Google testing fail -> "Googler to help with Google testing".
    - Stale + last comment is member ping -> "Nothing, already pinged author".
    - Approved + Blocked -> To-do MUST start with "Nudge author (already approved by @user)".
3. **Stale calculation**: If the last activity was a member pinging the author, calculate the "stale days" from that ping.
4. **CI Requirement for Landing**: Only list PRs in "Ready to Land" if CI is completely green.
5. **Deterministic Logic**: Always use the provided Python script to ensure consistency across triage sessions.

## 🛠 Useful Scripts
**Fetch detailed state:**
```bash
gh pr view [NUMBER] --json number,title,author,authorAssociation,reviews,comments,reviewRequests,statusCheckRollup,updatedAt,reviewDecision,labels,url
```
