---
name: schedule-followup
description: Find stale leads and contracts, draft re-engagement messages. Use when Ivan asks "who haven't I followed up with?" or runs weekly. Reads all leads/ and contracts/ folders, applies stale rules.
allowed-tools: Read, Write, Glob, Grep, Bash
---

# Find stale items and draft follow-ups

## Stale rules
- `outreach-sent` + 3 days no reply → follow-up #1
- follow-up #1 + 5 days → follow-up #2 (different angle)
- follow-up #2 + 7 days → breakup email, then dormant
- contract sent + 3 days no signature → nudge
- contract sent + 7 days → ask if there's a concern
- no-show + 24 hours → reschedule attempt
- no-show + 1 week → mark ghosted

## Run
1. Glob `leads/*.json` and `contracts/sent/*.json` (or wherever Ivan tracks sent contracts).
2. Compute days since `last_contact` for each.
3. Apply rules. For each stale item, draft `outreach/{lead-slug}_followup_{n}.md`.
4. Use a different angle each time (not just "checking in" three times in a row).
5. Update `last_contact` and `follow_up_count` in JSON files **only after Ivan approves and sends**.

## Report
List all drafted follow-ups, recommended sends vs holds, any leads to mark dormant.
