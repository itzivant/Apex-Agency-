#!/bin/bash
# Safety hook: blocks any Bash command that looks like it's trying to send email,
# make outbound API calls to mail/SMS providers, or otherwise contact a real person
# without Ivan in the loop. Exit code 2 blocks the command and feeds the message
# back to the agent.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

if [ -z "$COMMAND" ]; then
  exit 0
fi

# Patterns that indicate an attempt to actually send something
SEND_PATTERNS='(sendmail|mail -s|msmtp|mutt|swaks|curl.*api\.sendgrid|curl.*api\.mailgun|curl.*api\.postmark|curl.*api\.twilio|curl.*api\.resend|curl.*hooks\.slack\.com|gh api.*POST.*comments|gh issue create|gh pr create)'

if echo "$COMMAND" | grep -iE "$SEND_PATTERNS" > /dev/null; then
  echo "BLOCKED by guard-no-send.sh: This command appears to send a message externally." >&2
  echo "All outreach must be drafted to outreach/ for Ivan to send manually." >&2
  echo "Command attempted: $COMMAND" >&2
  exit 2
fi

exit 0
