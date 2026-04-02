---
name: leet-ai-start
description: AI LeetCode 챌린지 시작 — 환경 확인, 템플릿 풀기, 바로 코딩 시작
---

# /leet-ai-start

AI 활용 능력 평가 챌린지를 시작합니다.

**사전 조건:** 빈 디렉토리에서 Claude Code를 실행한 상태여야 합니다.
```
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
```

### 1단계: 환경 확인

다음 메시지를 표시합니다: "🔍 환경을 확인하고 있습니다..."

```bash
echo "=== AI LeetCode 환경 확인 ==="

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

결과를 표시:
- bun이 있으면: "✅ bun X.X 감지"
- bun이 없으면: "❌ bun 미설치"
- git이 있으면: "✅ git 감지"
- git이 없으면: "❌ git 미설치"
- 빈 디렉토리면: "✅ 빈 디렉토리 확인"
- 파일이 있으면: "❌ 파일이 있음"

**bun이 없으면:**
AskUserQuestion: "bun이 설치되어 있지 않습니다. 설치할까요?"
A) 설치해줘 → `curl -fsSL https://bun.sh/install | bash` 실행
B) 직접 설치할게 → 중단

**git이 없으면:** "git이 필요합니다." 하고 중단.

**현재 디렉토리가 비어있지 않으면 (FILE_COUNT > 2):**
다음 메시지를 표시하고 중단:
```
현재 디렉토리에 파일이 있습니다.
빈 디렉토리에서 시작해야 합니다. 아래 명령을 실행하세요:

  mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude

새 Claude Code 세션에서 다시 /leet-ai-start를 실행하세요.
```

### 2단계: 동의

AskUserQuestion: "세션 대화 내용이 채점 서버로 전송됩니다. 파일 경로는 제거되고 대화 내용만 전송됩니다. 동의하시겠습니까?"
A) 동의 → 계속
B) 거부 → 중단

### 3단계: 챌린지 준비

"📦 챌린지 파일을 준비하고 있습니다..."

```bash
# 스킬 디렉토리 찾기 (심볼릭 링크면 resolve — macOS 호환)
SKILL_DIR="$HOME/.claude/skills/leet-ai-start"
[ -L "$SKILL_DIR" ] && SKILL_DIR="$(cd "$SKILL_DIR" && pwd -P)"
TEMPLATE_DIR="$SKILL_DIR/challenges/easy-cart/template"
CHALLENGE_JSON="$SKILL_DIR/challenges/easy-cart/challenge.json"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ERROR: 템플릿을 찾을 수 없습니다: $TEMPLATE_DIR"
  exit 1
fi

# 현재 디렉토리에 템플릿 파일 풀기
cp -r "$TEMPLATE_DIR/"* ./
cp -r "$TEMPLATE_DIR/".* ./ 2>/dev/null || true

# challenge.json도 복사 (submit에서 challengeId 읽기용)
[ -f "$CHALLENGE_JSON" ] && cp "$CHALLENGE_JSON" ./challenge.json

bun install
```

"✅ 템플릿 복사 완료"
"✅ 의존성 설치 완료"

### 4단계: Git 초기화

```bash
git init && git add -A && git commit -m "initial" --no-verify
```

"✅ Git 초기화 완료"

### 5단계: 에디터 열기

"🖥️ 에디터를 열고 있습니다..."

```bash
if command -v code &>/dev/null; then
  code .
elif command -v cursor &>/dev/null; then
  cursor .
else
  open .
fi
```

### 6단계: 테스트 실행

"🧪 현재 테스트 상태를 확인합니다..."

```bash
bun run test 2>&1
```

### 7단계: 세션 설정 저장 + 안내

환경 세팅, 테스트 실행이 모두 끝난 후 시작 시간을 기록합니다.
이 시점부터가 유저의 실제 작업 시간입니다:

```bash
cat > .aileet-session.json << SESS_EOF
{
  "challengeId": "easy-cart-v1",
  "startTime": $(date +%s),
  "serverUrl": "${AILEET_SERVER_URL:-https://aileetserver-production.up.railway.app}"
}
SESS_EOF
```

안내를 표시합니다:

```
=== AI LeetCode 챌린지 시작 ===

📋 장바구니 버그 수정 [Medium] | ⏱️ 30분

💡 사용법:
  `bun run dev`  → 브라우저에서 앱 확인 (localhost:5173)
  `bun run test` → 테스트 실행

모든 테스트를 통과시키세요.
완료되면 `/leet-ai-submit`

⚠️ 이 세션의 대화만 채점됩니다.
```

Do NOT add analysis of failing tests.
이후 유저가 바로 작업합니다. 추가 설명이나 분석을 제공하지 않습니다.
