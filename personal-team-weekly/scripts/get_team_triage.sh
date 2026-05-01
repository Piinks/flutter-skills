#!/bin/bash
# scripts/get_team_triage.sh

TEAMS=$1
TRIAGE_README="docs/triage/README.md"

if [ -z "$TEAMS" ]; then
  echo "Usage: $0 \"team1 team2 ...\""
  exit 1
fi

if [ ! -f "$TRIAGE_README" ]; then
  echo "Error: $TRIAGE_README not found."
  exit 1
fi

echo "--- TEAM TRIAGE METRICS ---"

TEAM_PR_TRACKER=$(mktemp)

# Function to extract queries for a team
extract_queries() {
  local team_pattern=$1
  # Find the line number of the team header
  local start_line=$(grep -inE "###.*$team_pattern.*team" "$TRIAGE_README" | head -n 1 | cut -d: -f1)
  
  if [ -z "$start_line" ]; then
    return
  fi

  # Find the next team header or end of section
  local end_line=$(tail -n +$((start_line + 1)) "$TRIAGE_README" | grep -inE "###" | head -n 1 | cut -d: -f1)
  if [ -z "$end_line" ]; then
    end_line=$(wc -l < "$TRIAGE_README")
  else
    end_line=$((start_line + end_line))
  fi

  # Extract links containing pulls?q=
  sed -n "${start_line},${end_line}p" "$TRIAGE_README" | grep -oE "https://github.com/flutter/[^/]+/pulls\?q=[^)]+"
}

for team_input in $TEAMS; do
  team_regex=$(echo "$team_input" | sed 's/-/ /g')
  
  echo "TEAM:$team_input"
  
  QUERIES=$(extract_queries "$team_regex")
  
  if [ -z "$QUERIES" ]; then
    echo "No triage queries found for team: $team_input"
    echo "COUNT:0"
    echo "---"
    continue
  fi

  USER_PR_TMP=$(mktemp)
  
  while read -r url; do
    # Strip any trailing characters that aren't part of the query
    url=$(echo "$url" | sed 's/[)]*$//')
    
    # Extract repo and query_raw
    repo=$(echo "$url" | sed -E 's|https://github.com/([^/]+/[^/]+)/pulls.*|\1|')
    query_raw=$(echo "$url" | sed -E 's|.*pulls\?q=([^ ]+)|\1|')
    
    # Use gh api to execute the raw search query
    # We append repo:$repo to the query
    gh api "search/issues?q=repo:$repo+$query_raw&per_page=100" --jq ".items[] | \"$repo#\(.number)\"" >> "$USER_PR_TMP" 2>/dev/null
  done <<< "$QUERIES"

  # Count unique PRs for this team
  count=$(sort -u "$USER_PR_TMP" | wc -l | tr -d ' ')
  echo "COUNT:$count"
  
  # Add to team tracker
  cat "$USER_PR_TMP" >> "$TEAM_PR_TRACKER"
  rm "$USER_PR_TMP"
  
  echo "---"
done

echo -n "OVERALL_TRIAGE_UNIQUE_COUNT:"
if [ -s "$TEAM_PR_TRACKER" ]; then
  sort -u "$TEAM_PR_TRACKER" | wc -l | tr -d ' '
else
  echo "0"
fi
rm "$TEAM_PR_TRACKER"
