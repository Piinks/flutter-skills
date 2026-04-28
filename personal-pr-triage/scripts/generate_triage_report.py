import json
import datetime
import sys
import os
from datetime import timezone

def get_search_link(prs):
    nums = [str(pr['number']) for pr in prs]
    if not nums: return "#"
    return f"https://github.com/pulls?q=is%3Aopen+is%3Apr+archived%3Afalse+org%3Aflutter+pr%3A+{'+'.join(nums)}"

def process_file(file_path, repo_name, now):
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            f.seek(0)
            content = f.read().strip()
            if content.startswith('{'):
                data = json.loads("[" + content.replace('}\n{', '},{') + "]")
            else:
                return []
    
    processed = []
    for pr in data:
        if not pr: continue
        pr['repo'] = repo_name
        
        updated_at_str = pr.get('updatedAt', pr.get('updated_at'))
        if not updated_at_str: continue
        updated_at = datetime.datetime.fromisoformat(updated_at_str.replace('Z', '+00:00'))
        pr['days_since_update'] = (now - updated_at).days
        
        author_login = pr['author']['login']
        member_approvals = []
        has_member_involvement = False
        member_commenters = []
        
        reviews = pr.get('reviews', [])
        comments = pr.get('comments', [])
        
        for review in reviews:
            assoc = review.get('authorAssociation')
            reviewer_login = review['author']['login']
            if assoc in ['MEMBER', 'OWNER']:
                if reviewer_login != author_login:
                    has_member_involvement = True
                    if review['state'] == 'APPROVED':
                        member_approvals.append(reviewer_login)
        
        for comment in comments:
            assoc = comment.get('authorAssociation')
            commenter_login = comment['author']['login']
            if assoc in ['MEMBER', 'OWNER']:
                if commenter_login != author_login:
                    has_member_involvement = True
                    member_commenters.append(commenter_login)
        
        is_member_author = False
        for r in reviews + comments:
            if r['author']['login'] == author_login and r.get('authorAssociation') in ['MEMBER', 'OWNER']:
                is_member_author = True
                break
        
        ci_failures = []
        has_ci = False
        google_testing_failed = False
        for check in pr.get('statusCheckRollup', []):
            if check.get('conclusion') == 'FAILURE':
                name = check.get('name', 'Unknown')
                ci_failures.append(name)
                if 'google testing' in name.lower():
                    google_testing_failed = True
            if check.get('status') == 'COMPLETED':
                has_ci = True
        
        pr['ci_failures'] = ci_failures
        pr['google_testing_failed'] = google_testing_failed
        pr['member_approvals'] = list(set(member_approvals))
        pr['member_commenters'] = list(set(member_commenters))
        pr['is_member_author'] = is_member_author
        pr['has_ci'] = has_ci
        
        labels = [l['name'] for l in pr.get('labels', [])]
        pr['freeze_labels'] = [l for l in labels if 'freeze' in l.lower()]
        pr['has_member_involvement'] = has_member_involvement
        
        processed.append(pr)
    return processed

def main():
    now = datetime.datetime.now(timezone.utc)
    team_name = sys.argv[1] if len(sys.argv) > 1 else "team"
    
    all_prs = process_file('audit_data.json', 'flutter', now) + \
              process_file('packages_audit_data.json', 'packages', now)
    
    cats = {
        'needs_reviewer': [],
        'needs_second_reviewer': [],
        'ready_to_land': [],
        'blocked': [],
        'stale': [],
        'active': []
    }
    
    for pr in all_prs:
        if not pr['has_member_involvement'] and not pr.get('reviewRequests'):
            cats['needs_reviewer'].append(pr)
        elif not pr['is_member_author'] and len(pr['member_approvals']) == 1:
            cats['needs_second_reviewer'].append(pr)
        elif (pr['is_member_author'] and len(pr['member_approvals']) >= 1) or \
             (not pr['is_member_author'] and len(pr['member_approvals']) >= 2):
            if not pr['ci_failures'] and pr['has_ci'] and not pr['freeze_labels']:
                cats['ready_to_land'].append(pr)
            else:
                cats['blocked'].append(pr)
        elif pr['ci_failures'] or pr['freeze_labels']:
            cats['blocked'].append(pr)
        elif pr['days_since_update'] > 14:
            cats['stale'].append(pr)
        else:
            cats['active'].append(pr)

    total_count = len(all_prs)
    report = [f"### PR Triage Report: {team_name} {total_count} PRs Total\n"]

    sections = [
        ('needs_reviewer', '🔍 Needs Reviewer'),
        ('needs_second_reviewer', '⚖️ Needs Second Reviewer'),
        ('ready_to_land', '✅ Ready to Land'),
        ('blocked', '🚨 Blocked'),
        ('stale', '💤 Stale'),
        ('active', '📥 Active Review Queue')
    ]

    for key, title in sections:
        count = len(cats[key])
        link = get_search_link(cats[key])
        report.append(f"#### {title} ({count}) ({link})")
        
        if key == 'active':
            report.append("These are actively making progress, so we did not check on these.")
            continue
            
        items = cats[key]
        if key == 'blocked':
            items.sort(key=lambda x: not bool(x['member_approvals']))
            
        for pr in items:
            report.append(f"* [#{pr['number']}]({pr['url']}) (**{pr['repo']}**) - {pr['title']}")
            
            if key == 'needs_reviewer':
                if pr['member_commenters']:
                    report.append(f"  * @{', @'.join(pr['member_commenters'])} left a comment but hasn't reviewed yet.")
            elif key in ['needs_second_reviewer', 'ready_to_land']:
                report.append(f"  * Approved by @{', @'.join(pr['member_approvals'])}")
            elif key == 'blocked':
                notes = []
                if pr['ci_failures']: notes.append(f"Failing {', '.join(pr['ci_failures'])}")
                if pr['freeze_labels']: notes.append(f"Gated by {', '.join(pr['freeze_labels'])}")
                if notes: report.append(f"  * {'; '.join(notes)}")
                
                todo = "Author to fix CI"
                if pr['member_approvals']: todo = f"Nudge author (already approved by @{', @'.join(pr['member_approvals'])})"
                elif pr['google_testing_failed']: todo = "Googler to help with Google testing"
                elif pr['freeze_labels']: todo = "Wait for code freeze to lift"
                
                report.append(f"  * **To-do**: {todo}")
            elif key == 'stale':
                all_events = pr.get('reviews', []) + pr.get('comments', [])
                all_events.sort(key=lambda x: x.get('submittedAt', x.get('createdAt', '')), reverse=True)
                waiting_on = "Author"
                last_days = pr['days_since_update']
                date_type = "update"
                if all_events:
                    last_event = all_events[0]
                    last_date = datetime.datetime.fromisoformat(last_event.get('submittedAt', last_event.get('createdAt', '')).replace('Z', '+00:00'))
                    last_days = (now - last_date).days
                    if last_event.get('authorAssociation') in ['MEMBER', 'OWNER']:
                        waiting_on = "Author"
                        date_type = "ping"
                    else:
                        waiting_on = "Reviewer"
                
                report.append(f"  * {last_days} days since last {date_type}. Waiting on {waiting_on}.")
                
                todo = f"Ping {waiting_on}"
                if waiting_on == "Author" and date_type == "ping":
                    todo = "Nothing, already pinged author"
                report.append(f"  * **To-do**: {todo}")
        
        report.append("")

    print('\n'.join(report))

if __name__ == "__main__":
    main()
