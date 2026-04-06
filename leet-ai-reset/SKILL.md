---
name: leet-ai-reset
description: Leet Code AI challenge reset — revert code changes
allowed-tools: Bash(git checkout -- .) Bash(git clean -fd) Glob
---

# /leet-ai-reset

Reset the challenge to its initial state.

### Step 1: Check challenge

Use the Glob tool to verify:
- `package.json` exists
- `tests/` directory exists (check for any file in `tests/**/*`)

If either is missing: "This is not a challenge directory." and abort.

### Step 2: Confirm

AskUserQuestion: "This will revert all code changes and reset to the initial state. Proceed?"
A) Reset
B) Cancel

If B, abort.

### Step 3: Reset

```bash
git checkout -- . && git clean -fd
```

```
Reset complete! Returned to initial state.
Run `bun run test` to verify.
```
