#!/bin/bash

# Usage: ./orchestrate.sh <startDate> <endDate> [outputSubDir]

START_DATE=$1
END_DATE=$2
SUB_DIR=$3

if [ -z "$START_DATE" ] || [ -z "$END_DATE" ]; then
  echo "Usage: ./orchestrate.sh <startDate> <endDate> [outputSubDir]"
  exit 1
fi

# 6-month check
START_TS=$(date -j -f "%Y-%m-%d" "$START_DATE" "+%s" 2>/dev/null || date -d "$START_DATE" "+%s" 2>/dev/null)
END_TS=$(date -j -f "%Y-%m-%d" "$END_DATE" "+%s" 2>/dev/null || date -d "$END_DATE" "+%s" 2>/dev/null)
DIFF=$(( (END_TS - START_TS) / 86400 ))

if [ $DIFF -gt 183 ]; then
  echo "Error: Date range exceeds 6 months ($DIFF days)."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$SKILL_DIR/output"

if [ -n "$SUB_DIR" ]; then
  OUTPUT_DIR="$OUTPUT_DIR/$SUB_DIR"
fi

mkdir -p "$OUTPUT_DIR"

# 1. Fetch Teams
TEAMS_FILE="$OUTPUT_DIR/teams.json"
if [ ! -f "$TEAMS_FILE" ]; then
  node "$SCRIPT_DIR/fetch_teams.cjs" "$TEAMS_FILE"
fi

# 2. Fetch PRs
PRS_FILE="$OUTPUT_DIR/prs.json"
if [ ! -f "$PRS_FILE" ]; then
  node "$SCRIPT_DIR/fetch_org_prs_paginated.cjs" "$START_DATE" "$END_DATE" "$PRS_FILE"
fi

# 2.5 Fetch ALL Open PRs (Global Backlog)
ALL_OPEN_PRS_FILE="$OUTPUT_DIR/all_open_prs.json"
if [ ! -f "$ALL_OPEN_PRS_FILE" ]; then
  node "$SCRIPT_DIR/fetch_all_open_prs.cjs" "flutter" "$ALL_OPEN_PRS_FILE"
fi

# 3. Check for human reviews (Abandoned logic)
node "$SCRIPT_DIR/fetch_pr_reviews.cjs" "$PRS_FILE" "$TEAMS_FILE"

# 4. Analyze and Report
REPORT_FILE="$OUTPUT_DIR/report.md"
node "$SCRIPT_DIR/analyze_prs.cjs" "$PRS_FILE" "$TEAMS_FILE" "Flutter Org" "$START_DATE..$END_DATE" "$REPORT_FILE" "$ALL_OPEN_PRS_FILE"

echo "Workflow complete. Data and report available in $OUTPUT_DIR"
