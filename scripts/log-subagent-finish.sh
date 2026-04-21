#!/bin/bash
# Logs every time a subagent finishes a task. Useful for debugging and auditing the team.

INPUT=$(cat)
AGENT_NAME=$(echo "$INPUT" | jq -r '.agent_name // .matcher // "unknown"' 2>/dev/null)
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)

mkdir -p "logs/subagents"
LOG_FILE="logs/subagents/${TODAY}.md"

if [ ! -f "$LOG_FILE" ]; then
  echo "# Subagent activity — ${TODAY}" > "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

echo "- ${TIME} — \`${AGENT_NAME}\` finished" >> "$LOG_FILE"

exit 0
