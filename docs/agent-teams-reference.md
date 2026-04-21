# Agent Teams — Master Reference Guide

> Source: https://code.claude.com/docs/en/agent-teams
> Requires: Claude Code v2.1.32+, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

---

## Table of Contents

1. [What Are Agent Teams](#1-what-are-agent-teams)
2. [Enabling Agent Teams](#2-enabling-agent-teams)
3. [Agent Teams vs Subagents](#3-agent-teams-vs-subagents)
4. [Architecture](#4-architecture)
5. [Starting a Team](#5-starting-a-team)
6. [Display Modes](#6-display-modes)
7. [Controlling Your Team](#7-controlling-your-team)
8. [Task Management](#8-task-management)
9. [Communication](#9-communication)
10. [Permissions](#10-permissions)
11. [Hooks for Quality Gates](#11-hooks-for-quality-gates)
12. [Token Costs](#12-token-costs)
13. [Best Practices](#13-best-practices)
14. [Use Case Examples](#14-use-case-examples)
15. [Troubleshooting](#15-troubleshooting)
16. [Limitations](#16-limitations)

---

## 1. What Are Agent Teams

Agent teams let you coordinate multiple Claude Code instances working together. One session acts as the **team lead**, coordinating work and synthesizing results. **Teammates** work independently, each in its own context window, and can communicate directly with each other.

Key differences from subagents:
- Teammates have full independence — they are not children of the lead's context
- Teammates can message each other directly (not just report back to the lead)
- A shared task list enables self-coordination without the lead micromanaging every step
- You (the user) can message individual teammates directly without going through the lead

---

## 2. Enabling Agent Teams

Agent teams are **disabled by default**. Enable via environment variable or settings:

**In `settings.json` (recommended for persistent use):**
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Or in your shell:**
```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## 3. Agent Teams vs Subagents

| Dimension | Subagents | Agent Teams |
|---|---|---|
| Context window | Own context; results return to caller | Own context; fully independent |
| Communication | Report to main agent only | Teammates message each other directly |
| Coordination | Main agent manages all work | Shared task list; self-coordination |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower (results summarized back) | Higher (each teammate is a full Claude instance) |

**Rule of thumb:** Use subagents when workers only need to report results. Use agent teams when workers need to share findings, challenge each other, or coordinate on their own.

---

## 4. Architecture

| Component | Role |
|---|---|
| **Team lead** | The originating session. Creates the team, spawns teammates, coordinates work |
| **Teammates** | Separate Claude Code instances, each working on assigned tasks |
| **Task list** | Shared list of work items that teammates claim and complete |
| **Mailbox** | Messaging system for direct agent-to-agent communication |

### Storage locations (auto-managed — do not edit by hand)

- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

The team config `members` array holds each teammate's name, agent ID, and agent type. Teammates can read this to discover each other.

> **Warning:** The team config is overwritten on every state update. Do not pre-author it or edit it manually. For reusable roles, use subagent definitions instead.

### Context each teammate receives at spawn

- Project `CLAUDE.md` files
- MCP servers (from project and user settings)
- Skills (from project and user settings)
- The spawn prompt from the lead
- **NOT** the lead's conversation history

---

## 5. Starting a Team

Describe the task and team structure in natural language — Claude does the rest:

```text
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude will:
1. Create a shared task list
2. Spawn teammates for each role
3. Have them explore the problem
4. Synthesize findings
5. Clean up the team when finished

**To get predictable teammate names** (so you can reference them in later prompts), tell the lead what to call each teammate in the spawn instruction.

### Specifying teammates and models

```text
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Using subagent definitions as teammates

Reuse a saved subagent role (project, user, plugin, or CLI-defined):

```text
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

- The definition's `tools` allowlist and `model` are honored
- The definition's body is **appended** to the teammate's system prompt (not replacing it)
- Team coordination tools (`SendMessage`, task management) are always available regardless of `tools` restrictions
- `skills` and `mcpServers` fields in the definition are **not** applied when running as a teammate — teammates load those from project/user settings

---

## 6. Display Modes

| Mode | Description | Requirement |
|---|---|---|
| `auto` (default) | Split panes if inside tmux, in-process otherwise | — |
| `in-process` | All teammates run inside your main terminal; Shift+Down to cycle | Any terminal |
| `tmux` | Each teammate gets its own pane; auto-detects tmux or iTerm2 | tmux or iTerm2 |

**Set globally in `~/.claude.json`:**
```json
{
  "teammateMode": "in-process"
}
```

**Override for a single session:**
```bash
claude --teammate-mode in-process
```

### Installing split-pane dependencies

- **tmux:** `brew install tmux` (or your system package manager). See [tmux wiki](https://github.com/tmux/tmux/wiki/Installing).
- **iTerm2:** install the [`it2` CLI](https://github.com/mkusaka/it2), then enable **iTerm2 → Settings → General → Magic → Enable Python API**.

> Split-pane mode is **not supported** in VS Code's integrated terminal, Windows Terminal, or Ghostty.

---

## 7. Controlling Your Team

All control is via natural language to the lead. Key operations:

### Require plan approval before implementation

```text
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

Flow:
1. Teammate works in read-only plan mode
2. Sends plan approval request to lead
3. Lead reviews and approves or rejects with feedback
4. If rejected, teammate revises and resubmits
5. Once approved, teammate exits plan mode and implements

To shape the lead's approval judgment, include criteria in your prompt:
- `"only approve plans that include test coverage"`
- `"reject plans that modify the database schema"`

### Talk to teammates directly

- **In-process mode:** Shift+Down to cycle to a teammate → type to message them. Press Enter to view their session, Escape to interrupt their current turn. Ctrl+T to toggle task list.
- **Split-pane mode:** Click into a teammate's pane to interact directly.

### Shut down a teammate

```text
Ask the researcher teammate to shut down
```

The lead sends a shutdown request. The teammate can approve (exits gracefully) or reject with an explanation.

### Clean up the team

```text
Clean up the team
```

> **Warning:** Always use the lead to clean up — never a teammate. Teammate cleanup may leave resources in an inconsistent state. Shut down all teammates before running cleanup; the cleanup command fails if active teammates are still running.

---

## 8. Task Management

The shared task list is the coordination backbone.

### Task states

| State | Meaning |
|---|---|
| Pending | Not yet claimed |
| In progress | Claimed by a teammate |
| Completed | Finished |

### Dependencies

Tasks can depend on other tasks. A pending task with unresolved dependencies cannot be claimed until those dependencies complete. The system unblocks dependent tasks automatically when their prerequisites finish.

### Claiming work

- **Lead assigns:** explicitly tell the lead which teammate gets which task
- **Self-claim:** after finishing a task, a teammate picks up the next unassigned, unblocked task on its own

Task claiming uses **file locking** to prevent race conditions when multiple teammates try to claim the same task simultaneously.

---

## 9. Communication

### Message types

| Type | Use case |
|---|---|
| `message` | Send to one specific teammate by name |
| `broadcast` | Send to all teammates simultaneously — use sparingly, costs scale with team size |

### Automatic behaviors

- Teammate messages are delivered automatically to recipients (no polling required)
- When a teammate finishes and stops, it automatically notifies the lead
- All agents can see task status and claim available work

---

## 10. Permissions

- Teammates start with the **lead's permission settings**
- If the lead runs with `--dangerously-skip-permissions`, all teammates do too
- You **cannot** set per-teammate permission modes at spawn time
- You **can** change individual teammate modes after spawning

To reduce friction from permission prompts, pre-approve common operations in your [permission settings](https://code.claude.com/docs/en/permissions) before spawning teammates.

---

## 11. Hooks for Quality Gates

Enforce rules at key moments in the team lifecycle using [hooks](https://code.claude.com/docs/en/hooks):

| Hook | When it fires | Exit code 2 effect |
|---|---|---|
| `TeammateIdle` | A teammate is about to go idle | Send feedback and keep the teammate working |
| `TaskCreated` | A task is being created | Prevent creation and send feedback |
| `TaskCompleted` | A task is being marked complete | Prevent completion and send feedback |

---

## 12. Token Costs

Token usage scales linearly with the number of active teammates — each has its own context window and consumes tokens independently.

- **Worth it:** research, parallel review, new feature modules, competing-hypothesis debugging
- **Not worth it:** sequential tasks, same-file edits, work with many dependencies, routine single-session tasks

See [agent team token costs](https://code.claude.com/docs/en/costs#agent-team-token-costs) for detailed guidance.

---

## 13. Best Practices

### Team size

- **Start with 3–5 teammates** for most workflows
- **5–6 tasks per teammate** keeps everyone productive without excessive context switching
- Scale up only when work genuinely benefits from simultaneous parallel effort
- Three focused teammates often outperform five scattered ones

### Task sizing

| Too small | Too large | Just right |
|---|---|---|
| Coordination overhead exceeds benefit | Teammates work too long without check-ins; high risk of wasted effort | Self-contained unit with a clear deliverable (a function, a test file, a review) |

### Spawn prompts — always include context

Teammates don't inherit the lead's conversation history. Be explicit:

```text
Spawn a security reviewer teammate with the prompt: "Review the authentication
module at src/auth/ for security vulnerabilities. Focus on token handling,
session management, and input validation. The app uses JWT tokens stored in
httpOnly cookies. Report any issues with severity ratings."
```

### Avoid file conflicts

Two teammates editing the same file leads to overwrites. Break work so each teammate **owns a different set of files**.

### Keep the lead focused on delegation

If the lead starts implementing instead of delegating:
```text
Wait for your teammates to complete their tasks before proceeding
```

### Monitor and steer actively

Check in on teammates' progress, redirect approaches that aren't working, and synthesize findings as they come in. Letting a team run unattended too long increases risk of wasted effort.

### Start with research and review tasks

If you're new to agent teams, begin with tasks that have clear boundaries and don't require writing code: reviewing a PR, researching a library, investigating a bug. These show the value of parallel exploration without the coordination challenges of parallel implementation.

### CLAUDE.md works normally

Teammates read `CLAUDE.md` from their working directory. Use this to provide project-specific guidance to all teammates automatically.

---

## 14. Use Case Examples

### Parallel code review

Split review criteria into independent domains so each gets thorough attention simultaneously:

```text
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Competing-hypothesis debugging

Force teammates to actively disprove each other's theories — the surviving theory is the real root cause:

```text
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk
to each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

### Multi-angle exploration / design

Use for open-ended exploration where diverse perspectives matter:

```text
Create an agent team to explore this problem from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

### Cross-layer feature implementation

Frontend, backend, and tests each owned by a different teammate:

```text
Create a team with 3 teammates to implement the new user profile feature:
- One teammate owns the React components in src/components/profile/
- One teammate owns the API endpoints in src/api/profile/
- One teammate owns the test suite in tests/profile/
```

---

## 15. Troubleshooting

| Problem | Fix |
|---|---|
| Teammates not appearing after creation | In in-process mode, press Shift+Down — they may already be running. Check task complexity (Claude only spawns teams when warranted). |
| Split panes not working | Run `which tmux` to verify it's installed and in PATH. For iTerm2, verify `it2` CLI is installed and Python API is enabled. |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning teammates. |
| Teammate stopped on an error | Use Shift+Down to view output, then give direct instructions or spawn a replacement teammate. |
| Lead shuts down before work is done | Tell it to keep going. Proactively tell it to wait for teammates before proceeding. |
| Orphaned tmux sessions | `tmux ls` to list, then `tmux kill-session -t <session-name>` |
| Task stuck / dependent tasks blocked | Check if work is actually done; manually update task status or tell the lead to nudge the teammate. |

---

## 16. Limitations

Current known limitations (experimental feature):

| Limitation | Detail |
|---|---|
| No session resumption with in-process teammates | `/resume` and `/rewind` do not restore in-process teammates. After resuming, tell the lead to spawn new teammates. |
| Task status can lag | Teammates sometimes fail to mark tasks complete, blocking dependents. Update status manually or nudge via the lead. |
| Slow shutdown | Teammates finish their current request/tool call before shutting down — this can take time. |
| One team per session | A lead can only manage one team at a time. Clean up before starting a new one. |
| No nested teams | Teammates cannot spawn their own teams or teammates. Only the lead can manage the team. |
| Lead is fixed | The session that creates the team is always the lead. No leadership transfer. |
| Permissions set at spawn | All teammates start with the lead's permission mode. Per-teammate modes cannot be set at spawn time (only after). |
| Split panes limited to tmux / iTerm2 | Not supported in VS Code integrated terminal, Windows Terminal, or Ghostty. |

---

## Quick Reference Card

```text
Enable:        CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json
Version:       claude --version  (requires v2.1.32+)

Start team:    Natural language — describe task + team structure
Cycle panes:   Shift+Down  (in-process mode)
Toggle tasks:  Ctrl+T
Interrupt:     Escape (while viewing a teammate's session)

Ideal size:    3–5 teammates, 5–6 tasks per teammate
Token cost:    Scales linearly — each teammate = full Claude instance

Team config:   ~/.claude/teams/{team-name}/config.json  (do not edit)
Task list:     ~/.claude/tasks/{team-name}/

Cleanup:       Always via the lead, never a teammate
               Shut down all teammates first, then "Clean up the team"
```
