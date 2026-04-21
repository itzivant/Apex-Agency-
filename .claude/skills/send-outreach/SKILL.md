---
name: send-outreach
description: Draft cold outreach (email + SMS) for a qualified lead. Always saves drafts to outreach/ for Ivan to send manually — never auto-sends. Use when Ivan says "draft outreach for [lead]" or "write a cold email to X".
argument-hint: [lead-slug]
allowed-tools: Read, Write, Glob
disable-model-invocation: false
---

# Draft outreach for $0

1. Read `leads/{date}_$0.json`. Confirm `status: qualified`. If not, refuse and say lead needs qualifying first.
2. Read `templates/email-templates.md` and `templates/business-info.md`.
3. Write 2 versions: warm + direct.
4. Rules:
   - Email <90 words, SMS <160 chars
   - Use real personalization hook from lead JSON
   - One concrete value prop, one clear ask
   - No buzzwords ("synergy", "leverage", "elevate", etc.)
   - Sign as Ivan with phone from business-info.md
5. Save: `outreach/{lead-slug}_email.md` and `outreach/{lead-slug}_sms.md`
6. Mark **AWAITING IVAN APPROVAL** in the file header.

Report: which version recommended, file paths, what hook you used.

**Never send the message yourself.** Cold sends from automation tools tank deliverability — Ivan sends from his real email client.
