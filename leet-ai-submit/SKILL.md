---
name: leet-ai-submit
description: Leet Code AI challenge submission — guide through grading process and execute
---

# /leet-ai-submit

Submit and grade the challenge.

### Step 0: Check challenge

Verify that the current directory is a challenge project (since start unpacks files into the current directory):

```bash
[ -f "./package.json" ] && [ -d "./tests" ] && echo "CHALLENGE_FOUND" || echo "NO_CHALLENGE"
```

If `NO_CHALLENGE`: "Challenge not found. Start with `/leet-ai-start`." and abort.

Read session config:

```bash
[ -f "./.aileet-session.json" ] && cat ./.aileet-session.json || echo "SESSION_CONFIG: NOT_FOUND"
```

Values read from `.aileet-session.json`:
- `challengeId`: Challenge ID (default: "easy-cart-v1")
- `startTime`: Start time (unix timestamp) → used to calculate elapsed time
- `serverUrl`: Grading server URL (default: "https://aileetserver-production.up.railway.app")
- `locale`: User language preference (default: "ko")

Use defaults if the file is missing.

### Step 1: Submission process overview

Display the following message:

```
📋 Submission Process:

  [1/6] Run tests (automatic)
  [2/6] Collect code changes (automatic)
  [3/6] Collect AI conversation log — summarize after removing file paths
  [4/6] Upload original transcript — saved to server
  [5/6] Send to grading server — LLM evaluates code and conversation (5-10 sec)
  [6/6] Display results

⚠️ In steps 3-4, conversation content will be sent to the grading server.
   File paths will be removed and only conversation content will be transmitted.
```

AskUserQuestion: "Proceed with submission?"
A) Proceed → Continue
B) Cancel → Abort

### Step 2: [1/6] Run tests

"⏳ [1/6] Running tests..."

```bash
bun run test 2>&1
```

Extract from output: total tests, passed, failed.

"✅ [1/6] Tests complete: {passed}/{total} passed"

### Step 3: [2/6] Code changes

"⏳ [2/6] Collecting code changes..."

```bash
git diff HEAD
```

"✅ [2/6] Code changes collected"

### Step 4: [2.5/6] Modified test files

```bash
git diff HEAD --name-only -- tests/
```

### Step 5: [3/6] Collect conversation log

"⏳ [3/6] Collecting conversation log..."

Find the session file scoped to the **current project directory only** (prevents leaking other sessions):

```bash
# Claude Code stores sessions at: ~/.claude/projects/<project-key>/<uuid>.jsonl
# Project key = git root path (or CWD outside git) with slashes → dashes
# Session files live directly in the project dir, NOT in a sessions/ subdirectory
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PROJECT_KEY=$(echo "$PROJECT_ROOT" | sed 's|/|-|g')
PROJECT_DIR="$HOME/.claude/projects/$PROJECT_KEY"

# Find the most recent session JSONL in the current project directory only
if [ -d "$PROJECT_DIR" ]; then
  SESSION_FILE=$(ls -t "$PROJECT_DIR"/*.jsonl 2>/dev/null | head -1)
fi

# Fallback: older Claude Code stored transcripts at ~/.claude/transcripts/
# Scope by modification time after challenge start
if [ -z "$SESSION_FILE" ]; then
  SESSION_FILE=$(find ~/.claude/transcripts -name "*.jsonl" -newer /tmp/.aileet-start-marker 2>/dev/null | xargs ls -t 2>/dev/null | head -1)
fi

echo "SESSION_FILE: ${SESSION_FILE:-NOT_FOUND}"
```

**Important:** Only use session files from the current project directory. Never send transcripts from other projects.

If the session file exists, read it with the Read tool.

Analyze `tool_use` type records from the JSONL:
- Tally usage count per tool
- First tool name
- Number of `user` type records = total turns

Construct `toolUseSummary`:
```json
{
  "toolCounts": { "read": 12, "edit": 6, "bash": 4 },
  "firstTool": "read",
  "totalTurns": 10
}
```

If no session file, use empty values:
```json
{ "toolCounts": {}, "firstTool": "", "totalTurns": 0 }
```

Extract `user` and `assistant` type messages from the same session file.

Preprocessing:
1. Replace file paths with `[PATH]`
2. Summarize to ~5000 tokens

If no session file, set `conversationSummary` to an empty string.

"✅ [3/6] Conversation summary generated (including tool_use patterns)"

### Step 6: [4/6] Upload transcript

"⏳ [4/6] Uploading original transcript..."

Upload the original session file to the server (for admin detailed review):

```bash
# Read server URL from session config
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"
```

Read the original session file and POST it to the server:

```bash
TRANSCRIPT_FILE=$(mktemp)
# Save session file contents to temp file
curl -s -X POST "$AILEET_SERVER/api/upload-transcript" \
  -H "Content-Type: application/json" \
  -d @"$TRANSCRIPT_FILE"
rm -f "$TRANSCRIPT_FILE"
```

Receive `transcriptUrl` from the response and include it in the score payload in the next step.

Success: "✅ [4/6] Upload complete"
Failure: "⚠️ [4/6] Upload failed (grading will continue)"

Grading continues even if upload fails (set transcriptUrl to empty string).

### Step 7: [5/6] Send to grading server

"⏳ [5/6] Sending to grading server... (5-10 seconds)"

```bash
# Read server URL from session config (use default if missing)
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"

# Check server connection
curl -s --connect-timeout 3 "$AILEET_SERVER/health" > /dev/null 2>&1
echo "SERVER: $?"
```

If server connection fails:
"Cannot connect to grading server. Make sure the server is running: `bun run dev:server`"
and abort.

If server is OK, construct and send JSON payload:

```bash
PAYLOAD_FILE=$(mktemp)
# Write JSON payload to file
curl -s -X POST "$AILEET_SERVER/api/score" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_FILE"
rm -f "$PAYLOAD_FILE"
```

Submitted data:
- `challengeId`: id from challenge.json or "easy-cart-v1"
- `sessionId`: Session ID
- `durationSeconds`: Elapsed time
- `testResults`: { passed, failed, total, details }
- `modifiedTestFiles`: List of modified test files
- `toolUseSummary`: { toolCounts, firstTool, totalTurns }
- `codeDiff`: git diff output
- `conversationSummary`: Conversation summary
- `transcriptUrl`: Original URL from step 6 (empty string if unavailable)
- `locale`: User language preference from session config (default: "ko")
- `timestamp`: Submission time

"✅ [5/6] Grading complete!"

### Step 8: [6/6] Display results

```
=== Grading Results ===

🏆 Score: {total}/100
🎖️ Title: {title}
📊 Summary: {summary}

💬 Feedback: {feedback}

Tests: {passed}/{total} passed
Time: {minutes}m {seconds}s
```

### Step 9: Collect email

First, detect the user's email from git config:

```bash
git config user.email
```

**If git email is found (e.g., `user@gmail.com`):**

AskUserQuestion:
"📧 채점 결과를 이메일로 보내드릴까요?"
A) {detected git email} 으로 전송 → POST this email to server immediately
B) 다른 이메일 입력 → Ask for email address, then POST
C) 건너뛰기 → Go to step 10

**If no git email found:**

AskUserQuestion:
"📧 채점 결과를 이메일로 받으시겠습니까?
이메일을 입력하시면 코드 리뷰, 프롬프트 분석, 개선 제안이 포함된 상세 리포트를 보내드립니다."
A) 이메일 입력 → Ask for email address, then POST
B) 건너뛰기 → Go to step 10

If email is provided (either from git or manual input):

```bash
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"
```

POST `submissionId` and `email` to `$AILEET_SERVER/api/email`.

### Step 10: Wrap up

If `scoreUrl` is available, suggest opening it in the browser.

"Great job! 🎉"

"📧 Questions or feedback: tkd99200622@gmail.com"
