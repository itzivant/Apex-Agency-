#!/bin/bash
# Daily lead hunt — finds 5 new leads in a rotating niche each weekday.
# Add to cron:
#   0 7 * * 1-5 cd /path/to/webdev-contracts && ./scripts/daily-lead-hunt.sh >> logs/cron.log 2>&1

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

TODAY=$(date +%Y-%m-%d)
DAY_OF_WEEK=$(date +%u)  # 1=Mon ... 7=Sun

# Rotate niches by day of week so we don't keep mining the same well
case $DAY_OF_WEEK in
  1) NICHE="plumbers" ;;
  2) NICHE="landscapers" ;;
  3) NICHE="HVAC contractors" ;;
  4) NICHE="house cleaners" ;;
  5) NICHE="mobile mechanics or detailers" ;;
  *) NICHE="local service businesses" ;;
esac

# Rotate cities too
CITIES=("Madera" "Fresno" "Visalia" "Clovis" "Hanford")
CITY_INDEX=$(( ($(date +%j) - 1) % 5 ))
CITY="${CITIES[$CITY_INDEX]}"

echo "[$TODAY $(date +%H:%M:%S)] Daily lead hunt: $NICHE in $CITY, CA"

claude -p \
  --permission-mode acceptEdits \
  --output-format text \
  "Use the lead-hunter subagent to find 5 new ${NICHE} in ${CITY}, CA that don't have a website or have a broken/outdated one. Score them A/B/C and write to leads/. Then use lead-qualifier to enrich the A-rated ones. Report back: count found, count qualified, and which leads I should look at first." \
  > "logs/daily-hunt-${TODAY}.log" 2>&1

echo "[$TODAY $(date +%H:%M:%S)] Hunt complete. New leads in leads/, log in logs/daily-hunt-${TODAY}.log"
