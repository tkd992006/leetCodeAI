---
name: leet-ai-submit
description: Leet Code AI challenge submission — guide through grading process and execute
allowed-tools: Bash(bash *) Bash(bun *) Bash(git diff *) Read Write Glob
---

# /leet-ai-submit

<!-- 서버 URL은 .env.deploy / .env.local에서 관리.
     /leet-ai-start가 env-check.sh로 로드 → .aileet-session.json에 저장 → submit이 읽음 -->

Submit and grade the challenge.

### Step 0: Check challenge

Verify that the current directory is a challenge project using Glob tool:
- Check that `package.json` exists
- Check that `tests/` directory exists (look for any file in `tests/**/*`)

If either is missing: "Challenge not found. Start with `/leet-ai-start`." and abort.

Read `.aileet-session.json` using the Read tool.

Values read from `.aileet-session.json`:
- `challengeId`: Challenge ID (default: "easy-cart-v1")
- `startTime`: Start time (unix timestamp) → used to calculate elapsed time
- `serverUrl`: Grading server URL (from .env config, set during /leet-ai-start)
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

### Step 2: [1/6] Run tests + [2/6] Code changes

"⏳ [1/6] Running tests + [2/6] Collecting code changes..."

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/collect.sh
```

Parse the output using delimiters:
- `===TEST_RESULTS===` ~ `===CODE_DIFF===`: test output → extract total, passed, failed
- `===CODE_DIFF===` ~ `===MODIFIED_TEST_FILES===`: git diff output
- `===MODIFIED_TEST_FILES===` ~ end: list of modified test files

"✅ [1/6] Tests complete: {passed}/{total} passed"
"✅ [2/6] Code changes collected"

### Step 3: [3/6] Collect conversation log

"⏳ [3/6] Collecting conversation log..."

Find the session file scoped to the **current project directory only** (prevents leaking other sessions).

Use the Glob tool to find the most recent `.jsonl` file:
1. First, determine the project key: get the git root path (or CWD), replace `/` with `-`
2. Glob for `~/.claude/projects/<project-key>/*.jsonl`
3. The Glob tool returns files sorted by modification time — take the most recent one

If no file found via Glob, try the fallback path:
- Glob for `~/.claude/transcripts/*.jsonl` and filter by modification time (after challenge start)

**Important:** Only use session files from the current project directory. Never send transcripts from other projects.

If the session file exists, parse it with the script:

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/parse-session.ts <session_file_path>
```

Parse the output:
- `===TOOL_SUMMARY===`: JSON with `toolCounts`, `firstTool`, `totalTurns`
- `===MESSAGES===` ~ `===END===`: conversation messages (file paths already replaced with `[PATH]`)

Use the messages to create a `conversationSummary` (~5000 tokens).

If no session file found via Glob, use empty values:
```json
{ "toolCounts": {}, "firstTool": "", "totalTurns": 0 }
```
and set `conversationSummary` to an empty string.

**Important:** Do NOT use Python or inline bash to parse the JSONL. Always use the parse-session.ts script.

"✅ [3/6] Conversation summary generated (including tool_use patterns)"

### Step 4: [4/6] Upload transcript + [5/6] Send to grading server

"⏳ [4/6] Uploading original transcript..."
"⏳ [5/6] Sending to grading server... (5-10 seconds)"

First, use the Write tool to create a temporary JSON payload file (e.g., `/tmp/aileet-payload.json`):
```json
{
  "challengeId": "<from session config>",
  "sessionId": "<session ID>",
  "durationSeconds": <elapsed time>,
  "testResults": { "passed": N, "failed": N, "total": N, "details": "..." },
  "modifiedTestFiles": ["..."],
  "toolUseSummary": { ... },
  "codeDiff": "<git diff output>",
  "conversationSummary": "<summarized conversation>",
  "transcriptUrl": "",
  "locale": "<from session config>",
  "timestamp": "<ISO timestamp>"
}
```

If a session file was found, also write the transcript content to a temporary file (e.g., `/tmp/aileet-transcript.json`).

Run the grading script. The server URL comes from the session config read in Step 0:

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/grade.ts <serverUrl> /tmp/aileet-payload.json /tmp/aileet-transcript.json
```

The script reads both files, sends to server, and cleans up temp files automatically.

Parse the output:
- `===TRANSCRIPT_RESULT===`: transcript upload result → extract `transcriptUrl` if available
- `===SCORE_RESULT===`: grading result JSON
- `SERVER_UNREACHABLE`: "Cannot connect to grading server. Make sure the server is running: `bun run dev:server`" and abort.

If transcript upload succeeded: "✅ [4/6] Upload complete"
If transcript upload failed: "⚠️ [4/6] Upload failed (grading will continue)"

"✅ [5/6] Grading complete!"

### Step 5: [6/6] Display results

```
=== Grading Results ===

🏆 Score: {total}/100
🎖️ Title: {title}
📊 Summary: {summary}

💬 Feedback: {feedback}

Tests: {passed}/{total} passed
Time: {minutes}m {seconds}s
```

### Step 6: Collect email

First, detect the user's email. Read `~/.gitconfig` using the Read tool and extract the `email` field from the `[user]` section.

**If git email is found (e.g., `user@gmail.com`):**

AskUserQuestion:
"📧 채점 결과를 이메일로 보내드릴까요?"
A) {detected git email} 으로 전송 → Send this email
B) 다른 이메일 입력 → Ask for email address
C) 건너뛰기 → Go to step 7

**If no git email found:**

AskUserQuestion:
"📧 채점 결과를 이메일로 받으시겠습니까?
이메일을 입력하시면 코드 리뷰, 프롬프트 분석, 개선 제안이 포함된 상세 리포트를 보내드립니다."
A) 이메일 입력 → Ask for email address
B) 건너뛰기 → Go to step 7

If email is provided (either from git or manual input):

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/send-email.ts <serverUrl> <submissionId> <email>
```

### Step 7: Wrap up

If `scoreUrl` is available, display the URL on its own line as plain text (not as a markdown link) so it is cmd+clickable in the terminal:

```
🔗 상세 결과 보기:
https://leet-a-icode-web.vercel.app/result/{submissionId}
```

"Great job! 🎉"

"📧 Questions or feedback: tkd99200622@gmail.com"
