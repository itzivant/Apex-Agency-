#!/bin/bash
# Weekly follow-up sweep — runs unattended via cron.
# Spawns Claude Code in headless mode, has the follow-up-manager scan all stale
# leads/contracts, and writes drafts to outreach/ for Ivan to review on Monday morning.
#
# Install as a cron job:
#   crontab -e
#   0 6 * * 1 cd /path/to/webdev-contracts && ./scripts/weekly-followup.sh >> logs/cron.log 2>&1
#
# (Runs every Monday at 6am)

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

TODAY=$(date +%Y-%m-%d)
echo "[$TODAY $(date +%H:%M:%S)] Starting weekly follow-up sweep"

# Headless run: -p for prompt, --output-format stream-json for parseable output,
# --permission-mode acceptEdits so it can write drafts without prompting.
claude -p \
  --permission-mode acceptEdits \
  --output-format text \
  "Use the follow-up-manager subagent to scan all leads in leads/ and contracts in contracts/sent/. Find anything stale per the rules in CLAUDE.md and the follow-up-manager prompt. Draft follow-up messages to outreach/ for each. Do not send anything. Report back the count of drafts created and which ones to look at first." \
  > "logs/weekly-followup-${TODAY}.log" 2>&1

echo "[$TODAY $(date +%H:%M:%S)] Sweep complete. Review drafts in outreach/ and logs/weekly-followup-${TODAY}.log"
