---
name: leet-ai-reset
description: Leet AI challenge reset — revert code changes
---

# /leet-ai-reset

Reset the challenge to its initial state.

### Step 1: Check challenge

```bash
[ -f "./package.json" ] && [ -d "./tests" ] && echo "CHALLENGE_FOUND" || echo "NO_CHALLENGE"
```

If `NO_CHALLENGE`: "This is not a challenge directory." and abort.

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
