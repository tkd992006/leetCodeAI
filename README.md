🇰🇷 [한국어](README.ko.md)

# Leet Code AI — AI-Powered Coding Challenge

A hands-on challenge that measures how effectively you can work with an AI coding assistant.
Solve coding problems with Claude Code, get scored on 4 criteria, and earn badges.

## Installation

```bash
git clone https://github.com/tkd992006/leetCodeAI.git ~/.claude/skills/leetCodeAI && ~/.claude/skills/leetCodeAI/setup
```

## Taking the Challenge

**1. Open a terminal** and run one of the following:

# Standard — Claude asks permission for each action
```bash
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
# Auto-approve — skip all permission prompts (faster, for experienced users)
```
```bash
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude --dangerously-skip-permissions
```

**2. Start the challenge** — type this inside Claude Code:

```
/leet-ai-start
```

**3. Solve, test, submit:**

| Where | What | Command |
|-------|------|---------|
| Claude Code | Talk to AI, fix bugs, write code | just chat |
| Terminal | Preview the app | `bun run dev` |
| Terminal | Run tests | `bun run test` |
| Claude Code | Submit for grading | `/leet-ai-submit` |

## See it work

```
── terminal ──

$ mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude

── inside Claude Code ──

You:    /leet-ai-start
Claude: ✅ bun 1.2 detected
        ✅ git detected
        ✅ Empty directory confirmed
        📦 Preparing challenge files...
        ✅ Template copied, dependencies installed

        📋 Shopping Cart Bug Fix [Medium] | ⏱️ 30 minutes
        Pass all the tests. When done, type /leet-ai-submit

You:    [work with AI to fix bugs, write code, run tests]

You:    /leet-ai-submit
Claude: 📊 Submitting for grading...
        ✅ Score: 87/100
        🏅 Badge: PROMPT SURGEON
```

## Scoring

Graded on **100 points** across multiple criteria — code quality, test results, how you use AI, and more.
Exact weights are not disclosed.

### Badges

16 badges based on your performance and behavior patterns:

| Badge | Hint |
|-------|------|
| ZERO SHOT SHIPPER | Speed + perfection |
| PROMPT SURGEON | Exceptional output quality |
| ??? | 14 secret badges |

## Data Sent on Submission

- Code changes (git diff)
- AI conversation summary (~5000 tokens, file paths removed)
- Test results
- Tool usage patterns
- Modified test file list

> File paths are stripped. Your consent is requested before submission.

## Requirements

- [Claude Code](https://claude.ai/download)
- [Bun](https://bun.sh)
- Git
