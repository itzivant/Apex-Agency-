---
name: qualify-lead
description: Qualify a single lead — pull contact info, score fit, decide if worth pursuing. Use when Ivan says "qualify this lead" or pastes a business name/URL. Front-loads what to look for so you don't waste tool calls.
allowed-tools: Read, Write, Edit, WebSearch, WebFetch, Glob
---

# Qualify a lead

Run this checklist:

1. **Identity check** — confirm business actually exists, is open, and is the right one (common name confusion).
2. **Website audit** — fetch the homepage if one exists. Score: none / broken / outdated / decent. Look for: mobile responsive, contact form, SSL, last updated, professional vs DIY (Wix template smell).
3. **Contact info** — owner first name, best email, phone. Try in this order: their site → Google Business → LinkedIn → Facebook page.
4. **Pain signals** — check Google reviews (sort by recent). Look for: "couldn't reach", "no online booking", "outdated info", "wish they had X".
5. **Budget signal** — review count, fleet size in photos, whether running ads (search "{business} site:facebook.com ads"), how long they've been around.
6. **Fit decision** — yes if matches CLAUDE.md profile; no if chain/franchise/closed/wrong size.

Update the lead JSON in `leads/` with all findings. Set `status: qualified` or `status: disqualified` with reason.

Final output: 4-line summary — fit yes/no, owner name, top hook for outreach, what's missing if anything.
