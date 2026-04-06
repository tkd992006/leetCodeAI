---
name: leet-ai-start
description: Leet Code AI challenge start — check environment, unpack template, begin coding
allowed-tools: Bash(bash *) Bash(bun *) Bash(git *) Bash(cp *) Bash(code *) Bash(cursor *) Bash(open *) Bash(date *) Bash(touch *) Read Write Glob
---

# /leet-ai-start

Start the AI proficiency assessment challenge.

**Prerequisite:** You must be running Claude Code in an empty directory.
```
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
```

### Step 1: Check environment

Display the following message: "🔍 Checking your environment..."

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/env-check.sh
```

Parse the output and save key values:
- `BUN:` → bun version or NOT_FOUND
- `GIT:` → git version or NOT_FOUND
- `FILES_IN_CWD:` → file count
- `START_TIME:` → unix timestamp (save for Step 6)
- `AILEET_SERVER:` → server URL (save for Step 6)
- `UPDATE:` / `UP_TO_DATE` / `SKIP_UPDATE` → auto-update status

Display results:
- If bun is found: "✅ bun X.X detected"
- If bun is missing: "❌ bun not installed"
- If git is found: "✅ git detected"
- If git is missing: "❌ git not installed"
- If directory is empty: "✅ Empty directory confirmed"
- If files exist: "❌ Files found"
- If AILEET_SERVER contains "localhost": "⚠️ Local mode: {AILEET_SERVER}"

**If bun is missing:**
AskUserQuestion: "bun is not installed. Would you like to install it?"
A) Install it → Run `curl -fsSL https://bun.sh/install | bash`
B) I'll install it myself → Abort

**If git is missing:** "git is required." and abort.

**If the current directory is not empty (FILE_COUNT > 2):**
Display the following message and abort:
```
Files exist in the current directory.
You must start in an empty directory. Run the following command:

  mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude

Then run /leet-ai-start again in the new Claude Code session.
```

**Auto-update results:**
- If `UPDATE_SUCCESS`: "✅ Skill updated ($LOCAL_VER → $REMOTE_VER)"
- If `UPDATE_FAILED`: "⚠️ Auto-update failed. Continuing with current version."
- If `UP_TO_DATE` or `SKIP_UPDATE`: Continue silently (no message)

### Step 2: Consent

AskUserQuestion: "Session conversation content will be sent to the grading server. File paths will be removed and only conversation content will be transmitted. Do you agree?"
A) Agree → Continue
B) Decline → Abort

### Step 2.5: Select language

AskUserQuestion: "Choose your preferred language for grading results:"
A) 한국어 → Set locale to "ko"
B) English → Set locale to "en"

Save the selected locale for Step 6 (session config).

### Step 2.7: Select challenge

AskUserQuestion: "Choose a challenge:"
A) 🛒 Shopping Cart Bug Fix [Medium] | 30 min — Fix bugs in a shopping cart app
B) 📝 Task API Comments [Medium] | 45 min — Add a comment system to a task management API

Save the selected challenge slug:
- A → Set AILEET_CHALLENGE to "easy-cart"
- B → Set AILEET_CHALLENGE to "medium-task-api"

### Step 3: Prepare challenge + Initialize Git

"📦 Preparing challenge files..."

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/setup.sh ${AILEET_CHALLENGE}
```

If output contains `TEMPLATE_COPIED`: "✅ Template copied, ✅ Dependencies installed"
If output contains `GIT_INITIALIZED`: "✅ Git initialized"
If output contains `ERROR`: Display the error and abort.

### Step 4: Open editor

"🖥️ Opening editor..."

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/open-editor.sh
```

### Step 5: Run tests

"🧪 Checking current test status..."

```bash
bun run test 2>&1
```

### Step 6: Save session config + instructions

After environment setup and test run are complete, record the start time.
From this point on is the user's actual working time.

Read `./challenge.json` using the Read tool and extract `id` and `timeLimitMinutes`.

Use the Write tool to create `.aileet-session.json` using `AILEET_SERVER` from Step 1 and `SETUP_TIME` from Step 3:
```json
{
  "challengeId": "<id from challenge.json>",
  "startTime": <SETUP_TIME from Step 3 output>,
  "serverUrl": "<AILEET_SERVER from Step 1>",
  "locale": "<selected locale from Step 2.5>"
}
```

Read the challenge metadata from challenge.json, and display instructions dynamically:

- If the challenge is `easy-cart-v1`:
```
=== Leet Code AI Challenge Start ===

📋 Shopping Cart Bug Fix [Medium] | ⏱️ 30 minutes

💡 Usage:
  `bun run dev`  → View app in browser (localhost:5173)
  `bun run test` → Run tests

Pass all the tests.
When done, run `/leet-ai-submit`
```

- If the challenge is `medium-task-api-v1`:
```
=== Leet Code AI Challenge Start ===

📋 Task API Comment System [Medium] | ⏱️ 45 minutes

💡 Usage:
  `bun run test` → Run tests

Read the PRD.md file for feature requirements.
Explore the existing codebase, then implement the comment system.
Pass all the tests.
When done, run `/leet-ai-submit`
```

Always append:
```
⚠️ Only conversations in this session will be graded.

📧 Questions or feedback: tkd99200622@gmail.com
```

Do NOT add analysis of failing tests.
The user starts working immediately after this. Do not provide additional explanations or analysis.
