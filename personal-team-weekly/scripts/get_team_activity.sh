#!/bin/bash
# scripts/get_team_activity.sh

TEAM_MEMBERS=$1
START_DATE=$2
END_DATE=$3

if [ -z "$TEAM_MEMBERS" ] || [ -z "$START_DATE" ] || [ -z "$END_DATE" ]; then
  echo "Usage: $0 \"user1 user2 ...\" YYYY-MM-DD YYYY-MM-DD"
  exit 1
fi

echo "--- TEAM ACTIVITY DATA ($START_DATE to $END_DATE) ---"

# Temporary file to track all unique PRs involved by the team
TEAM_PR_TRACKER=$(mktemp)

for user in $TEAM_MEMBERS; do
  echo "USER:$user"
  
  # Helper function to check for API errors
  check_error() {
    if [[ "$1" == *"403"* ]] || [[ "$1" == *"rate limit"* ]]; then
      echo "CRITICAL_ERROR: GitHub API rate limit hit for $user. Aborting." >&2
      exit 2
    fi
  }

  # Fetch Authored PRs
  AUTHORED_RAW=$(gh search prs --owner flutter --author "$user" --updated "$START_DATE..$END_DATE" --json number,title,state,author,repository --limit 100 2>&1)
  check_error "$AUTHORED_RAW"
  AUTHORED_JSON="$AUTHORED_RAW"
  
  # Fetch Reviewed PRs
  REVIEWED_RAW=$(gh search prs --owner flutter --reviewed-by "$user" --updated "$START_DATE..$END_DATE" --json number,repository --limit 100 2>&1)
  check_error "$REVIEWED_RAW"
  REVIEWED_JSON="$REVIEWED_RAW"
  
  # Fetch Review-Requested PRs
  REQUESTED_RAW=$(gh search prs --owner flutter --review-requested "$user" --state open --json number,repository --limit 100 2>&1)
  check_error "$REQUESTED_RAW"
  REQUESTED_JSON="$REQUESTED_RAW"
  
  # Landed Titles
  echo "LANDED_TITLES:"
  echo "$AUTHORED_JSON" | jq -r ".[] | select((.state | ascii_upcase) == \"MERGED\") | \"\(.repository.name)#\(.number): \(.title)\""

  # Open Titles
  echo "OPEN_TITLES:"
  echo "$AUTHORED_JSON" | jq -r ".[] | select((.state | ascii_upcase) == \"OPEN\") | \"\(.repository.name)#\(.number): \(.title)\""

  # Total Involved Count
  echo -n "TOTAL_INVOLVED_COUNT:"
  USER_PR_TMP=$(mktemp)
  echo "$AUTHORED_JSON" | jq -r ".[] | \"\(.repository.name)#\(.number)\"" >> "$USER_PR_TMP"
  echo "$REVIEWED_JSON" | jq -r ".[] | \"\(.repository.name)#\(_RESERVED_)\"" 2>/dev/null || echo "$REVIEWED_JSON" | jq -r ".[] | \"\(.repository.name)#\(.number)\"" >> "$USER_PR_TMP"
  echo "$REQUESTED_JSON" | jq -r ".[] | \"\(.repository.name)#\(.number)\"" >> "$USER_PR_TMP"
  
  sort -u "$USER_PR_TMP" | wc -l | tr -d ' '
  cat "$USER_PR_TMP" >> "$TEAM_PR_TRACKER"
  rm "$USER_PR_TMP"
  
  echo "---"
  
  # Sleep to avoid secondary rate limits
  sleep 2
done

echo -n "OVERALL_TEAM_UNIQUE_COUNT:"
if [ -s "$TEAM_PR_TRACKER" ]; then
  sort -u "$TEAM_PR_TRACKER" | wc -l | tr -d ' '
else
  echo "0"
fi
rm "$TEAM_PR_TRACKER"
