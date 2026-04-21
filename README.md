# Web Development Contracts — Agent Team

A production-grade Claude Code agent team for running a local web development side business on autopilot. Built around 7 specialized subagents that hunt leads, qualify them, draft outreach, book calls, draft contracts, follow up, and onboard clients — all while keeping you (Ivan) in the loop on every send.

---

## What's in this folder

```
webdev-contracts/
├── CLAUDE.md                     ← Master brain: business rules, pricing, routing
├── .claude/
│   ├── settings.json             ← Permissions + hooks config
│   ├── agents/                   ← 7 subagent definitions
│   │   ├── orchestrator.md       ← Manager — coordinates the team
│   │   ├── lead-hunter.md        ← Finds new prospects via web search
│   │   ├── lead-qualifier.md     ← Enriches & scores leads
│   │   ├── outreach-writer.md    ← Drafts cold emails / SMS
│   │   ├── appointment-booker.md ← Schedules discovery calls
│   │   ├── contract-drafter.md   ← Drafts CA-compliant contracts
│   │   ├── follow-up-manager.md  ← Re-engages stale leads
│   │   └── client-onboarder.md   ← Sets up signed clients
│   └── skills/                   ← Reusable playbooks (slash commands)
│       ├── qualify-lead/
│       ├── draft-contract/
│       ├── send-outreach/
│       └── schedule-followup/
├── templates/
│   ├── business-info.md          ← FILL THIS IN FIRST
│   ├── email-templates.md        ← Reference patterns for outreach
│   └── contract-template.md      ← CA-compliant contract template
├── scripts/
│   ├── log-activity.sh           ← Hook: logs every file write
│   ├── log-subagent-finish.sh    ← Hook: logs subagent completions
│   ├── guard-no-send.sh          ← Hook: blocks accidental real sends
│   ├── weekly-followup.sh        ← Cron: weekly stale-lead sweep
│   └── daily-lead-hunt.sh        ← Cron: daily new-lead hunt
├── leads/                        ← One JSON per lead
├── outreach/                     ← Drafts awaiting your approval
├── appointments/                 ← .ics files + briefings
├── contracts/
│   ├── drafts/                   ← Awaiting review
│   ├── sent/                     ← Sent to client
│   └── signed/                   ← Fully executed
├── clients/                      ← Active client folders
└── logs/                         ← Activity audit trail
```

---

## Setup (one-time, ~10 minutes)

### 1. Install Claude Code
If you haven't already:
```bash
npm install -g @anthropic-ai/claude-code
```
Then sign in:
```bash
claude
```

### 2. Drop this folder where you want it
```bash
# e.g. ~/projects/webdev-contracts
mv webdev-contracts ~/projects/
cd ~/projects/webdev-contracts
```

### 3. Make the hook scripts executable
```bash
chmod +x scripts/*.sh
```

### 4. Fill in your business info
Open `templates/business-info.md` and fill in every `[TODO]`. This is the single source of truth your agents pull from.

### 5. Launch Claude Code in the project
```bash
cd ~/projects/webdev-contracts
claude
```

You should see your custom agents loaded. Type `/agents` to confirm — you'll see all 7.

### 6. (Optional) Set up the cron jobs for autopilot mode
Edit your crontab:
```bash
crontab -e
```
Add these two lines (replace `~/projects/webdev-contracts` with your actual path):
```cron
# Daily lead hunt — weekdays at 7am
0 7 * * 1-5 cd ~/projects/webdev-contracts && ./scripts/daily-lead-hunt.sh

# Weekly follow-up sweep — Mondays at 6am
0 6 * * 1 cd ~/projects/webdev-contracts && ./scripts/weekly-followup.sh
```

Now every weekday morning, you'll wake up to fresh leads in `leads/` and follow-up drafts in `outreach/`.

---

## How to use it day-to-day

### Most common commands

**Find new leads:**
> "Find me 10 plumbers in Fresno without websites."
The orchestrator delegates to lead-hunter, then lead-qualifier in parallel.

**Draft outreach for everything qualified:**
> "Draft outreach for all qualified leads."

**Or use a slash command directly:**
> `/send-outreach 2026-04-21_smith-plumbing`

**Book a call after a reply:**
> "Carlos at Smith Plumbing replied — he wants to talk Wednesday or Thursday afternoon. Book it."

**Draft a contract after the call:**
> `/draft-contract smith-plumbing standard`

**Check who's gone cold:**
> "Who haven't I followed up with?"
Or just `/schedule-followup`

**Onboard a signed client:**
> "Smith Plumbing signed and paid the deposit. Onboard them."

### The golden rule
**No agent ever sends anything externally.** Everything goes to a draft folder (`outreach/`, `contracts/drafts/`) for you to review and send from your real email client. This keeps deliverability high and you legally protected.

---

## How the team works together

```
You: "Find 10 plumbers in Fresno and reach out to the qualified ones"
        │
        ▼
   ORCHESTRATOR  (decomposes the request)
        │
        ├──► lead-hunter      (finds 10 candidates → leads/*.json)
        │
        ├──► lead-qualifier   (×10 in parallel: enriches each)
        │
        └──► outreach-writer  (×N for qualified ones: drafts → outreach/*.md)
        │
        ▼
   Reports back: "8 qualified, 8 drafts in outreach/, recommend sending 6"
        │
        ▼
You review drafts, send from Gmail, mark replies as they come in
        │
        ▼
   appointment-booker → contract-drafter → client-onboarder
```

Each agent has its own context window, its own memory directory, and its own colored badge in the UI so you can see who's doing what.

---

## Agent memory

Most agents have `memory: project` enabled, which means they keep notes between sessions in `.claude/agent-memory/{agent-name}/MEMORY.md`. Over time:
- `lead-hunter` learns which niches and zip codes you've already mined
- `outreach-writer` learns which subject lines get replies
- `follow-up-manager` learns which industries have longer sales cycles
- `contract-drafter` learns what scope creep tends to look like

You can check or edit these memory files directly. They're plain markdown.

---

## Customizing for growth

When this side business takes off, edit these spots:
- **Pricing:** `CLAUDE.md` § Service offerings & pricing
- **Target customer:** `CLAUDE.md` § Target customer profile
- **New niches:** `scripts/daily-lead-hunt.sh` (the case statement)
- **New geographies:** `scripts/daily-lead-hunt.sh` (the CITIES array)
- **Add a new agent** (e.g., a "portfolio-builder" or "invoice-sender"): create a new file in `.claude/agents/`, restart Claude Code

---

## Safety features built in

- **`guard-no-send.sh` hook** blocks any Bash command that looks like it's trying to send email/SMS via APIs. Even if an agent gets confused, it can't accidentally email a real lead.
- **`disable-model-invocation` is OFF** by default for skills, so Claude can use them when relevant — but key destructive commands are denied at the permission layer (`rm -rf`, `git push`, piped curl).
- **All writes are logged** to `logs/activity/{date}.md` so you have a full audit trail.
- **Contracts include CA 3-day right-to-cancel** by default and reference Madera County jurisdiction.
- **Pricing floor enforced** in `CLAUDE.md` — agents won't quote below $750/$1,500/$2,500.

---

## Troubleshooting

**Agents aren't being delegated to automatically:**
Run `/agents` to confirm they loaded. If a description doesn't match what you're asking, rephrase or @-mention the agent: `@orchestrator find me leads`.

**Hook scripts not running:**
Make sure they're executable (`chmod +x scripts/*.sh`) and that `jq` is installed (`brew install jq` on Mac, `apt install jq` on Linux).

**Cron jobs not firing:**
Check `logs/cron.log`. Make sure the path in your crontab is absolute, not `~`. Verify with `crontab -l`.

**An agent is doing too much / too little:**
Edit its `.md` file directly. Changes take effect within the current session — no restart needed.

---

## Next-level upgrades (when you're ready)

1. **MCP integrations** — connect Gmail / Google Calendar / Stripe via MCP servers so agents can actually read your inbox (still drafting, not sending). See `https://code.claude.com/docs/en/mcp`.
2. **Plugin packaging** — bundle this whole setup as a Claude Code plugin so you can reuse it for other side businesses (NEMT, real estate, content). See `https://code.claude.com/docs/en/plugins`.
3. **Web dashboard** — build a simple HTML dashboard that reads `leads/` and `outreach/` and shows your pipeline at a glance.

---

Built for Ivan. Don't sell anything for less than $750.
