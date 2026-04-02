🇰🇷 [한국어](README.ko.md)

# Leet AI — AI-Powered Coding Challenge

A hands-on challenge that measures how effectively you can work with an AI coding assistant.

Solve coding problems with Claude Code, get scored on 4 criteria, and earn badges.

## Installation

```bash
git clone https://github.com/tkd992006/leetCodeAI.git ~/.claude/skills/leetCodeAI
```

> Clone into the Claude Code skills directory (`~/.claude/skills/`) and it's ready to use.

## Usage

### 1. Start in an empty directory

```bash
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
```

### 2. Begin the challenge

In Claude Code:
```
/leet-ai-start
```

This automatically checks your environment, installs the challenge template, and opens the editor.

### 3. Solve the problem

Write code by collaborating with AI. The goal is to **pass all tests**.

```bash
bun run dev   # Preview the app in your browser
bun run test  # Run tests
```

### 4. Submit

```
/leet-ai-submit
```

### 5. View results

After grading, you can check your score, badges, and AI review on the web.

---

## Scoring

Your submission is evaluated on 4 criteria (25 points each, 100 total):

| Criteria | Description | Evaluation Method |
|----------|-------------|-------------------|
| **Completeness** | Test pass rate | Automated (passed/total x 25) |
| **Output Quality** | Code quality, structure, naming | AI review (code diff analysis) |
| **Process Quality** | Prompt clarity, context usage, iterative improvement | AI review (conversation summary analysis) |
| **Trap Detection** | Finding intentionally hidden bugs / incorrect tests | Automated (modified test file matching) |

### Badges

One of 16 badges is awarded based on your performance and behavior patterns:

| Badge | Description |
|-------|-------------|
| ZERO SHOT SHIPPER | Perfect score in under 15 minutes |
| HALLUCINATION HUNTER | Top AI hallucination detection |
| PROMPT SURGEON | Exceptional code quality |
| CONTEXT ARCHITECT | Master of context utilization |
| DEBUG WHISPERER | Consistent and methodical debugging |
| TOKEN SWEEPER | Heavy token consumption |
| ??? | 10 secret badges |

---

## Data Sent on Submission

- Code changes (git diff)
- AI conversation summary (~5000 tokens, file paths removed)
- Test results
- Tool usage patterns (which tools were used and how often)
- List of modified test files

> File paths are stripped from the data, and your consent is requested before submission.

## Commands

| Command | Description |
|---------|-------------|
| `/leet-ai-start` | Start the challenge |
| `/leet-ai-submit` | Submit & grade |
| `/leet-ai-reset` | Reset code to initial state |

## Requirements

- [Claude Code](https://claude.ai/download)
- [Bun](https://bun.sh)
- Git
