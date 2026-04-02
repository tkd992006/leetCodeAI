---
name: leet-ai-start
description: Leet Code AI challenge start — check environment, unpack template, begin coding
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
echo "=== Leet Code AI Environment Check ==="

if command -v bun &>/dev/null; then
  echo "BUN: $(bun --version)"
else
  echo "BUN: NOT_FOUND"
fi

if command -v git &>/dev/null; then
  echo "GIT: $(git --version)"
else
  echo "GIT: NOT_FOUND"
fi

FILE_COUNT=$(ls -A 2>/dev/null | wc -l | tr -d ' ')
echo "FILES_IN_CWD: $FILE_COUNT"

AILEET_START_TIME=$(date +%s)
echo "START_TIME: $AILEET_START_TIME"
```

Display results:
- If bun is found: "✅ bun X.X detected"
- If bun is missing: "❌ bun not installed"
- If git is found: "✅ git detected"
- If git is missing: "❌ git not installed"
- If directory is empty: "✅ Empty directory confirmed"
- If files exist: "❌ Files found"

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

### Step 1.5: Auto-update skill

Check the skill repository for version updates and pull if a newer version is available:

```bash
SKILL_DIR="$HOME/.claude/skills/leet-ai-start"
[ -L "$SKILL_DIR" ] && SKILL_DIR="$(cd "$SKILL_DIR" && pwd -P)"
REPO_DIR="$(cd "$SKILL_DIR" && git rev-parse --show-toplevel 2>/dev/null)"

if [ -n "$REPO_DIR" ] && [ -f "$REPO_DIR/version.json" ]; then
  LOCAL_VER=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$REPO_DIR/version.json" | cut -d'"' -f4)
  git -C "$REPO_DIR" fetch --quiet origin main 2>/dev/null
  REMOTE_VER=$(git -C "$REPO_DIR" show origin/main:version.json 2>/dev/null | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)

  if [ -n "$LOCAL_VER" ] && [ -n "$REMOTE_VER" ] && [ "$LOCAL_VER" != "$REMOTE_VER" ]; then
    echo "UPDATE: $LOCAL_VER → $REMOTE_VER"
  else
    echo "UP_TO_DATE"
  fi
else
  echo "SKIP_UPDATE"
fi
```

- If `UPDATE`: Run `git -C "$REPO_DIR" pull --ff-only origin main`
  - Success: "✅ Skill updated ($LOCAL_VER → $REMOTE_VER)"
  - Failure: "⚠️ Auto-update failed. Continuing with current version."
- If `UP_TO_DATE` or `SKIP_UPDATE`: Continue silently (no message)

### Step 2: Consent

AskUserQuestion: "Session conversation content will be sent to the grading server. File paths will be removed and only conversation content will be transmitted. Do you agree?"
A) Agree → Continue
B) Decline → Abort

### Step 2.5: Select language

AskUserQuestion: "Choose your preferred language for grading results:"
A) 한국어 → Set locale to "ko"
B) English → Set locale to "en"

Save the selected locale for Step 7 (session config).

### Step 3: Prepare challenge

"📦 Preparing challenge files..."

```bash
# Find skill directory (resolve if symlink — macOS compatible)
SKILL_DIR="$HOME/.claude/skills/leet-ai-start"
[ -L "$SKILL_DIR" ] && SKILL_DIR="$(cd "$SKILL_DIR" && pwd -P)"
TEMPLATE_DIR="$SKILL_DIR/challenges/easy-cart/template"
CHALLENGE_JSON="$SKILL_DIR/challenges/easy-cart/challenge.json"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ERROR: Template not found: $TEMPLATE_DIR"
  exit 1
fi

# Unpack template files into the current directory
cp -r "$TEMPLATE_DIR/"* ./
cp -r "$TEMPLATE_DIR/".* ./ 2>/dev/null || true

# Also copy challenge.json (used by submit to read challengeId)
[ -f "$CHALLENGE_JSON" ] && cp "$CHALLENGE_JSON" ./challenge.json

bun install
```

"✅ Template copied"
"✅ Dependencies installed"

### Step 4: Initialize Git

```bash
git init && git add -A && git commit -m "initial" --no-verify
```

"✅ Git initialized"

### Step 5: Open editor

"🖥️ Opening editor..."

```bash
if command -v code &>/dev/null; then
  code .
elif command -v cursor &>/dev/null; then
  cursor .
else
  open .
fi
```

### Step 6: Run tests

"🧪 Checking current test status..."

```bash
bun run test 2>&1
```

### Step 7: Save session config + instructions

After environment setup and test run are complete, record the start time.
From this point on is the user's actual working time:

```bash
cat > .aileet-session.json << SESS_EOF
{
  "challengeId": "easy-cart-v1",
  "startTime": $(date +%s),
  "serverUrl": "${AILEET_SERVER_URL:-https://aileetserver-production.up.railway.app}",
  "locale": "${AILEET_LOCALE:-ko}"
}
SESS_EOF

# Create timestamp marker for fallback session file filtering
touch /tmp/.aileet-start-marker
```

Display instructions:

```
=== Leet Code AI Challenge Start ===

📋 Shopping Cart Bug Fix [Medium] | ⏱️ 30 minutes

💡 Usage:
  `bun run dev`  → View app in browser (localhost:5173)
  `bun run test` → Run tests

Pass all the tests.
When done, run `/leet-ai-submit`

⚠️ Only conversations in this session will be graded.

📧 Questions or feedback: tkd99200622@gmail.com
```

Do NOT add analysis of failing tests.
The user starts working immediately after this. Do not provide additional explanations or analysis.
