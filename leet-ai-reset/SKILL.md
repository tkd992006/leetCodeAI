---
name: leet-ai-reset
description: AI LeetCode 챌린지 초기화 — 코드 변경사항 되돌리기
---

# /leet-ai-reset

챌린지를 초기 상태로 되돌립니다.

### 1단계: 챌린지 확인

```bash
[ -f "./package.json" ] && [ -d "./tests" ] && echo "CHALLENGE_FOUND" || echo "NO_CHALLENGE"
```

`NO_CHALLENGE`이면: "챌린지 디렉토리가 아닙니다." 하고 중단.

### 2단계: 확인

AskUserQuestion: "모든 코드 변경사항을 되돌리고 초기 상태로 리셋합니다. 진행할까요?"
A) 리셋
B) 취소

B이면 중단.

### 3단계: 리셋

```bash
git checkout -- . && git clean -fd
```

```
리셋 완료! 초기 상태로 돌아갔습니다.
`bun run test`로 확인하세요.
```
