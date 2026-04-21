#!/bin/bash
# Regenerates dashboard/data.json from the leads/, outreach/, contracts/, and logs/ folders.
# Run manually or add to .claude/settings.json PostToolUse hook.

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
OUT="$ROOT/dashboard/data.json"

mkdir -p "$ROOT/dashboard"

# ── Helpers ───────────────────────────────────────────────────
count_files() { find "$1" -maxdepth 1 -name "*.json" 2>/dev/null | wc -l | tr -d ' '; }
count_files_glob() { find "$1" -maxdepth 1 -name "$2" 2>/dev/null | wc -l | tr -d ' '; }

# ── KPIs ──────────────────────────────────────────────────────
TOTAL_LEADS=$(count_files "$ROOT/leads")
QUALIFIED=0
if command -v jq &>/dev/null; then
  QUALIFIED=$(find "$ROOT/leads" -maxdepth 1 -name "*.json" -exec jq -r 'select(.status=="qualified") | .status' {} \; 2>/dev/null | wc -l | tr -d ' ')
fi
ACTIVE_CONTRACTS=$(( $(count_files "$ROOT/contracts/drafts") + $(count_files "$ROOT/contracts/sent") ))
SIGNED=$(count_files "$ROOT/contracts/signed")

# ── Leads array ───────────────────────────────────────────────
LEADS_JSON="[]"
if command -v jq &>/dev/null && [ "$TOTAL_LEADS" -gt 0 ]; then
  LEADS_JSON=$(find "$ROOT/leads" -maxdepth 1 -name "*.json" -print0 2>/dev/null \
    | xargs -0 jq -cs 'map({
        business_name: (.business_name // .name // "Unknown"),
        niche:         (.niche // "—"),
        score:         (.score // "C"),
        status:        (.status // "new"),
        last_contact:  (.last_contact // .created_at // "—")
      })' 2>/dev/null || echo "[]")
fi

# ── Outreach array ────────────────────────────────────────────
OUTREACH_JSON="[]"
OUTREACH_FILES=$(find "$ROOT/outreach" -maxdepth 1 -name "*.md" -o -name "*.txt" 2>/dev/null | head -50)
if [ -n "$OUTREACH_FILES" ]; then
  OUTREACH_JSON=$(echo "$OUTREACH_FILES" | while IFS= read -r f; do
    FNAME=$(basename "$f")
    FDATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$f" 2>/dev/null || date +%Y-%m-%d)
    printf '{"filename":"%s","lead_name":"%s","channel":"email","date":"%s","status":"pending"}' \
      "$FNAME" "${FNAME%.*}" "$FDATE"
  done | jq -cs '.' 2>/dev/null || echo "[]")
fi

# ── Contracts array ───────────────────────────────────────────
CONTRACTS_JSON="[]"
ALL_CONTRACTS=""
for DIR in "$ROOT/contracts/drafts" "$ROOT/contracts/sent"; do
  STATUS=$(basename "$DIR")
  FILES=$(find "$DIR" -maxdepth 1 -name "*.md" -o -name "*.json" 2>/dev/null)
  if [ -n "$FILES" ]; then
    while IFS= read -r f; do
      FNAME=$(basename "$f")
      FDATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$f" 2>/dev/null || date +%Y-%m-%d)
      ALL_CONTRACTS="${ALL_CONTRACTS}{\"filename\":\"$FNAME\",\"client\":\"${FNAME%.*}\",\"status\":\"$STATUS\",\"date\":\"$FDATE\"},"
    done <<< "$FILES"
  fi
done
if [ -n "$ALL_CONTRACTS" ]; then
  CONTRACTS_JSON=$(echo "[${ALL_CONTRACTS%,}]")
fi

# ── Activity (last 20 lines from today's log) ─────────────────
TODAY=$(date +%Y-%m-%d)
ACTIVITY_JSON="[]"
LOGFILE="$ROOT/logs/activity/$TODAY.md"
if [ -f "$LOGFILE" ]; then
  ACTIVITY_JSON=$(tail -20 "$LOGFILE" | grep -v '^#' | grep -v '^$' | \
    awk '{printf "{\"entry\":\"%s\",\"time\":\"%s\"},", $0, strftime("%H:%M")}' | \
    sed 's/,$//' | sed 's/^/[/' | sed 's/$/]/' 2>/dev/null || echo "[]")
fi

# ── Write output ──────────────────────────────────────────────
cat > "$OUT" <<EOF
{
  "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "kpis": {
    "total_leads": $TOTAL_LEADS,
    "qualified": $QUALIFIED,
    "active_contracts": $ACTIVE_CONTRACTS,
    "signed": $SIGNED
  },
  "leads": $LEADS_JSON,
  "outreach": $OUTREACH_JSON,
  "contracts": $CONTRACTS_JSON,
  "activity": $ACTIVITY_JSON
}
EOF

echo "✅ Dashboard data refreshed → dashboard/data.json"
echo "   Leads: $TOTAL_LEADS total, $QUALIFIED qualified"
echo "   Contracts: $ACTIVE_CONTRACTS active, $SIGNED signed"
