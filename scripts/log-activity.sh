#!/bin/bash
# Logs every file write to logs/activity/{YYYY-MM-DD}.md so Ivan has an audit trail.
# Reads JSON from stdin (Claude Code passes hook input via stdin).

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)
TODAY=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

mkdir -p logs/activity
LOG_FILE="logs/activity/${TODAY}.md"

# Initialize log file if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  echo "# Activity log — ${TODAY}" > "$LOG_FILE"
  echo "" >> "$LOG_FILE"
fi

echo "- ${TIME} — wrote \`${FILE_PATH}\`" >> "$LOG_FILE"

exit 0
