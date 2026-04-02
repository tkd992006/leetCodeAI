---
name: leet-ai-submit
description: AI LeetCode 챌린지 제출 — 채점 과정 안내 후 실행
---

# /leet-ai-submit

챌린지를 제출하고 채점합니다.

### 0단계: 챌린지 확인

현재 디렉토리가 챌린지 프로젝트인지 확인합니다 (start가 현재 디렉토리에 파일을 풀어넣으므로):

```bash
[ -f "./package.json" ] && [ -d "./tests" ] && echo "CHALLENGE_FOUND" || echo "NO_CHALLENGE"
```

`NO_CHALLENGE`이면: "챌린지를 찾을 수 없습니다. `/leet-ai-start`로 시작하세요." 하고 중단.

세션 설정을 읽습니다:

```bash
[ -f "./.aileet-session.json" ] && cat ./.aileet-session.json || echo "SESSION_CONFIG: NOT_FOUND"
```

`.aileet-session.json`에서 읽는 값:
- `challengeId`: 챌린지 ID (기본값: "easy-cart-v1")
- `startTime`: 시작 시간 (unix timestamp) → 소요 시간 계산에 사용
- `serverUrl`: 채점 서버 주소 (기본값: "https://aileetserver-production.up.railway.app")

파일이 없으면 기본값 사용.

### 1단계: 제출 과정 안내

다음 메시지를 표시합니다:

```
📋 제출 과정 안내:

  [1/6] 테스트 실행 (자동)
  [2/6] 코드 변경사항 수집 (자동)
  [3/6] AI 대화 기록 수집 — 파일 경로 제거 후 요약
  [4/6] 원본 Transcript 업로드 — 서버에 저장
  [5/6] 채점 서버 전송 — LLM이 코드와 대화를 평가 (5-10초)
  [6/6] 결과 표시

⚠️ 3-4단계에서 대화 내용이 채점 서버로 전송됩니다.
   파일 경로는 제거되고 대화 내용만 전송됩니다.
```

AskUserQuestion: "제출을 진행할까요?"
A) 진행 → 계속
B) 취소 → 중단

### 2단계: [1/6] 테스트 실행

"⏳ [1/6] 테스트 실행 중..."

```bash
bun run test 2>&1
```

출력에서 추출: 전체 테스트 수, 통과 수, 실패 수.

"✅ [1/6] 테스트 완료: {passed}/{total} 통과"

### 3단계: [2/6] 코드 변경사항

"⏳ [2/6] 코드 변경사항 수집 중..."

```bash
git diff HEAD
```

"✅ [2/6] 코드 변경사항 수집 완료"

### 4단계: [2.5/6] 수정된 테스트 파일

```bash
git diff HEAD --name-only -- tests/
```

### 5단계: [3/6] 대화 기록 수집

"⏳ [3/6] 대화 기록 수집 중..."

세션 파일을 찾습니다 (두 경로 모두 탐색):

```bash
# projects 경로 (최신 Claude Code)
SESSION_FILE=$(find ~/.claude/projects -name "*.jsonl" -not -path "*/subagents/*" 2>/dev/null | xargs ls -t 2>/dev/null | head -1)
# 없으면 transcripts 경로 (이전 버전)
[ -z "$SESSION_FILE" ] && SESSION_FILE=$(ls -t ~/.claude/transcripts/*.jsonl 2>/dev/null | head -1)
echo "SESSION_FILE: ${SESSION_FILE:-NOT_FOUND}"
```

세션 파일이 있으면 Read 도구로 읽습니다.

JSONL에서 `tool_use` 타입 레코드를 분석하여:
- 도구별 사용 횟수 집계
- 첫 번째 도구 이름
- `user` 타입 레코드 수 = 전체 턴 수

`toolUseSummary` 구성:
```json
{
  "toolCounts": { "read": 12, "edit": 6, "bash": 4 },
  "firstTool": "read",
  "totalTurns": 10
}
```

세션 파일이 없으면 빈 값 사용:
```json
{ "toolCounts": {}, "firstTool": "", "totalTurns": 0 }
```

같은 세션 파일에서 `user`와 `assistant` 타입 메시지를 추출합니다.

전처리:
1. 파일 경로를 `[PATH]`로 치환
2. ~5000 토큰으로 요약

세션 파일이 없으면 `conversationSummary`를 빈 문자열로.

"✅ [3/6] 대화 요약 생성 완료 (tool_use 패턴 포함)"

### 6단계: [4/6] Transcript 업로드

"⏳ [4/6] Transcript 원본 업로드 중..."

세션 파일 원본을 서버에 업로드합니다 (admin 정밀 확인용):

```bash
# 세션 설정에서 서버 주소 읽기
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"
```

세션 파일 원본을 읽어서 서버에 POST합니다:

```bash
TRANSCRIPT_FILE=$(mktemp)
# 세션 파일 내용을 임시 파일에 저장
curl -s -X POST "$AILEET_SERVER/api/upload-transcript" \
  -H "Content-Type: application/json" \
  -d @"$TRANSCRIPT_FILE"
rm -f "$TRANSCRIPT_FILE"
```

응답에서 `transcriptUrl`을 받아서 다음 단계의 score 페이로드에 포함합니다.

성공: "✅ [4/6] 업로드 완료"
실패: "⚠️ [4/6] 업로드 실패 (채점은 계속 진행)"

업로드 실패해도 채점은 계속 진행합니다 (transcriptUrl을 빈 문자열로).

### 7단계: [5/6] 채점 서버 전송

"⏳ [5/6] 채점 서버에 전송 중... (5-10초 소요)"

```bash
# 세션 설정에서 서버 주소 읽기 (없으면 기본값)
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"

# 서버 연결 확인
curl -s --connect-timeout 3 "$AILEET_SERVER/health" > /dev/null 2>&1
echo "SERVER: $?"
```

서버 연결 실패 시:
"채점 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요: `bun run dev:server`"
하고 중단.

서버가 OK면 JSON 페이로드를 구성하여 전송:

```bash
PAYLOAD_FILE=$(mktemp)
# JSON 페이로드를 파일에 작성
curl -s -X POST "$AILEET_SERVER/api/score" \
  -H "Content-Type: application/json" \
  -d @"$PAYLOAD_FILE"
rm -f "$PAYLOAD_FILE"
```

전송 데이터:
- `challengeId`: challenge.json의 id 또는 "easy-cart-v1"
- `sessionId`: 세션 ID
- `durationSeconds`: 소요 시간
- `testResults`: { passed, failed, total, details }
- `modifiedTestFiles`: 수정된 테스트 파일 목록
- `toolUseSummary`: { toolCounts, firstTool, totalTurns }
- `codeDiff`: git diff 결과
- `conversationSummary`: 대화 요약
- `transcriptUrl`: 6단계에서 받은 원본 URL (없으면 빈 문자열)
- `timestamp`: 제출 시각

"✅ [5/6] 채점 완료!"

### 8단계: [6/6] 결과 표시

```
=== 채점 결과 ===

🏆 점수: {total}/100
🎖️ 칭호: {title}
📊 요약: {summary}

💬 채점평: {feedback}

테스트: {passed}/{total} 통과
소요 시간: {minutes}분 {seconds}초
```

### 9단계: 이메일 수집

AskUserQuestion:
"📧 정밀 채점 결과를 이메일로 받으시겠습니까?
정밀 채점에서는 코드 리뷰, 프롬프트 분석, 개선 제안을 포함합니다."
A) 이메일 입력 → 이메일 주소를 물어본 뒤 서버에 POST
B) 건너뛰기 → 10단계로 이동

이메일을 받으면:

```bash
AILEET_SERVER=$(cat .aileet-session.json 2>/dev/null | grep -o '"serverUrl"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
[ -z "$AILEET_SERVER" ] && AILEET_SERVER="https://aileetserver-production.up.railway.app"
```

`$AILEET_SERVER/api/email`에 `submissionId`와 `email`을 POST합니다.

### 10단계: 마무리

`scoreUrl`이 있으면 브라우저에서 열 것인지 제안합니다.

"수고하셨습니다! 🎉"
