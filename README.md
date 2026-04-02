🇰🇷 [한국어](README.ko.md)

# Leet AI — AI-Powered Coding Challenge

A hands-on challenge that measures how effectively you can work with an AI coding assistant.
Solve coding problems with Claude Code, get scored on 4 criteria, and earn badges.

## Installation (30 seconds)

```bash
git clone https://github.com/tkd992006/leetCodeAI.git ~/.claude/skills/leetCodeAI && ~/.claude/skills/leetCodeAI/setup
```

## See it work

```
You:    mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude

        ── inside Claude Code ──

You:    /leet-ai-start
Claude: Checking your environment...
        ✅ bun 1.2 detected
        ✅ git detected
        ✅ Empty directory confirmed
        📦 Preparing challenge files...
        ✅ Template copied, dependencies installed

        === Leet AI Challenge Start ===
        📋 Shopping Cart Bug Fix [Medium] | ⏱️ 30 minutes
        Pass all the tests. When done, run leet-ai-submit

You:    [work with AI to fix bugs, write code, run tests]

You:    bun run test
Claude: ✅ 12/12 tests passed

You:    /leet-ai-submit
Claude: 📊 Submitting for grading...
        ✅ Score: 87/100
        🏅 Badge: PROMPT SURGEON
```

> **Note:** `leet-ai-start`, `leet-ai-submit`, `leet-ai-reset` are Claude Code skills.
> Type them as messages inside a Claude Code session — not as terminal commands.

## Scoring

4 criteria, 25 points each, 100 total:

| Criteria | What's measured | How |
|----------|----------------|-----|
| **Completeness** | Test pass rate | Automated |
| **Output Quality** | Code quality, structure, naming | AI review (code diff) |
| **Process Quality** | Prompt clarity, context usage, iteration | AI review (conversation) |
| **Trap Detection** | Finding hidden bugs / incorrect tests | Automated |

### Badges

16 badges awarded based on performance and behavior:

| Badge | Description |
|-------|-------------|
| ZERO SHOT SHIPPER | Perfect score in under 15 minutes |
| HALLUCINATION HUNTER | Top AI hallucination detection |
| PROMPT SURGEON | Exceptional code quality |
| CONTEXT ARCHITECT | Master of context utilization |
| DEBUG WHISPERER | Consistent and methodical debugging |
| TOKEN SWEEPER | Heavy token consumption |
| ??? | 10 secret badges |

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
