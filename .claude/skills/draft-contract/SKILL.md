---
name: draft-contract
description: Draft a web development contract for a client based on agreed scope. Use when scope is finalized after a discovery call and Ivan needs the formal doc. Pulls from templates/contract-template.md and fills in client-specific details.
argument-hint: [client-slug] [package-tier]
allowed-tools: Read, Write, Edit, Glob
---

# Draft contract for $0 — $1 package

1. Read `leads/{...}{$0}.json` and any post-call notes in `appointments/`.
2. Read `templates/contract-template.md` and `templates/business-info.md`.
3. Fill in:
   - Parties (legal names — verify, don't guess)
   - Scope (specific page list, features list)
   - Price + payment schedule (50/50 default; floor: $750/$1,500/$2,500)
   - Timeline in business days
   - Out-of-scope items (at least 3 specifics to prevent scope creep)
   - Revisions: 2 rounds per page included
   - CA right-to-cancel (3 days)
   - IP transfer on full payment
4. Save: `contracts/drafts/{date}_$0_v1.md`
5. Generate plain-English summary: `contracts/drafts/{date}_$0_summary.md`
6. Run quality checklist (no placeholders, math checks, business days specified, etc.)

Report back: file paths, total price, key terms, anything Ivan should double-check before sending.
