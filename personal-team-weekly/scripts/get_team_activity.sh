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

for user in $TEAM_MEMBERS; do
  echo "USER:$user"
  
  # Landed PRs
  echo -n "LANDED_COUNT:"
  gh search prs --author "$user" --owner flutter --merged --merged-at "$START_DATE..$END_DATE" --json number -q 'length'
  
  echo "LANDED_TITLES:"
  gh search prs --author "$user" --owner flutter --merged --merged-at "$START_DATE..$END_DATE" --json title,number,repository -q '.[] | "\(.repository.name)#\(.number): \(.title)"'

  # Open PRs
  echo -n "OPEN_COUNT:"
  gh search prs --author "$user" --owner flutter --state open --json number -q 'length'
  
  echo "OPEN_TITLES:"
  gh search prs --author "$user" --owner flutter --state open --json title,number,repository -q '.[] | "\(.repository.name)#\(.number): \(.title)"'

  # Review Requested (Open)
  echo -n "REVIEW_REQUESTED_COUNT:"
  gh search prs --review-requested "$user" --owner flutter --state open --json number -q 'length'

  # Reviewed (Recently)
  echo -n "RECENTLY_REVIEWED_COUNT:"
  gh search prs --reviewed-by "$user" --owner flutter --updated "$START_DATE..$END_DATE" --json number -q 'length'
  
  # Total Involved (Involves + Review Requested)
  echo -n "TOTAL_INVOLVED_COUNT:"
  tmp_user_prs=$(mktemp)
  gh search prs --owner flutter --state open --review-requested "$user" --json repository,number -q '.[] | "\(.repository.name)#\(.number)"' >> "$tmp_user_prs"
  gh search prs --owner flutter --involves "$user" --updated "$START_DATE..$END_DATE" --json repository,number -q '.[] | "\(.repository.name)#\(.number)"' >> "$tmp_user_prs"
  sort -u "$tmp_user_prs" | wc -l | tr -d ' '
  rm "$tmp_user_prs"
  
  echo "---"
done

# Calculate Overall Team Unique PRs
echo "OVERALL_TEAM_UNIQUE_COUNT:"
tmp_team_prs=$(mktemp)
for user in $TEAM_MEMBERS; do
  gh search prs --owner flutter --state open --review-requested "$user" --json repository,number -q '.[] | "\(.repository.name)#\(.number)"' >> "$tmp_team_prs"
  gh search prs --owner flutter --involves "$user" --updated "$START_DATE..$END_DATE" --json repository,number -q '.[] | "\(.repository.name)#\(.number)"' >> "$tmp_team_prs"
done
sort -u "$tmp_team_prs" | wc -l | tr -d ' '
rm "$tmp_team_prs"
