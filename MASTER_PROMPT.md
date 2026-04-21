# THE MASTER PROMPT
# Paste this into Claude Code (`claude` command) the very first time you launch in this folder.
# It bootstraps your agent team, verifies setup, and shows you what's possible.

---

You are operating inside Ivan's web development contracts business — a Claude Code project with a complete multi-agent team already defined in `.claude/agents/`.

Your first task is to do a setup audit and orient me.

**Step 1 — Verify the team is loaded.**
List every subagent in `.claude/agents/` and confirm each one has the required frontmatter fields (name, description, tools, model). If any are missing or malformed, flag them.

**Step 2 — Verify the skills are loaded.**
List every skill in `.claude/skills/` and confirm each `SKILL.md` has a description.

**Step 3 — Verify hooks and scripts.**
Check that `scripts/log-activity.sh`, `scripts/log-subagent-finish.sh`, and `scripts/guard-no-send.sh` exist and are executable. If they're not executable, run `chmod +x` on them and report.

**Step 4 — Check business-info template.**
Read `templates/business-info.md`. Tell me which `[TODO]` fields I haven't filled in yet. This blocks several agents from writing real outreach, so flag it clearly.

**Step 5 — Sanity-check the folder structure.**
Confirm these directories exist (create any that don't): `leads/`, `outreach/`, `appointments/`, `contracts/drafts/`, `contracts/sent/`, `contracts/signed/`, `clients/`, `logs/activity/`, `logs/subagents/`.

**Step 6 — Final report.**
Give me a single short report in this exact format:

```
✅ TEAM: 7 agents loaded (orchestrator, lead-hunter, lead-qualifier, outreach-writer, appointment-booker, contract-drafter, follow-up-manager, client-onboarder)
✅ SKILLS: 4 skills loaded (qualify-lead, draft-contract, send-outreach, schedule-followup)
✅ HOOKS: 3 hook scripts present and executable
⚠️  TODO: business-info.md has N unfilled fields — fill these before sending real outreach
✅ FOLDERS: all required directories exist

WHAT YOU CAN DO NOW:
1. "Find me 5 [niche] in [city]" — kicks off lead hunting + qualification
2. "Draft outreach for [lead-id]" or `/send-outreach [lead-id]` — writes cold email
3. "Book a call with [lead]" — proposes times, drafts confirmation
4. "Draft contract for [client] [tier]" or `/draft-contract [client] [tier]` — generates CA-compliant contract
5. "Who haven't I followed up with?" or `/schedule-followup` — finds stale leads
6. "Onboard [client]" — sets up signed client folder + welcome email

CRON OPTIONS (run unattended):
- ./scripts/daily-lead-hunt.sh — 5 fresh leads each weekday morning
- ./scripts/weekly-followup.sh — Monday morning re-engagement sweep
See README.md for crontab setup.

Ready when you are. What do you want to do first?
```

After the report, stop and wait. Do not start hunting or drafting anything until I tell you what to do.
