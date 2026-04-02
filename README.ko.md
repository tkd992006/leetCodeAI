🇺🇸 [English](README.md)

# Leet AI — AI-Powered Coding Challenge

AI 코딩 어시스턴트를 얼마나 잘 다루는지 측정하는 실전 챌린지입니다.
Claude Code로 코딩 문제를 풀고, 4가지 기준으로 채점받으세요. 뱃지도 받을 수 있습니다.

## 설치

```bash
git clone https://github.com/tkd992006/leetCodeAI.git ~/.claude/skills/leetCodeAI && ~/.claude/skills/leetCodeAI/setup
```

## 시험 보기

```bash
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
```

Claude Code 안에서 `/leet-ai-start` 를 입력하세요.

## 이렇게 동작합니다

```
You:    mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude

        ── Claude Code 안에서 ──

You:    /leet-ai-start
Claude: 환경 확인 중...
        ✅ bun 1.2 감지됨
        ✅ git 감지됨
        ✅ 빈 디렉토리 확인
        📦 챌린지 파일 준비 중...
        ✅ 템플릿 복사 완료, 의존성 설치 완료

        === Leet AI Challenge Start ===
        📋 Shopping Cart Bug Fix [Medium] | ⏱️ 30분
        모든 테스트를 통과시키세요. 완료되면 leet-ai-submit

You:    [AI와 대화하며 버그 수정, 코드 작성, 테스트 실행]

You:    bun run test
Claude: ✅ 12/12 tests passed

You:    /leet-ai-submit
Claude: 📊 채점 서버에 제출 중...
        ✅ 점수: 87/100
        🏅 뱃지: PROMPT SURGEON
```

> **참고:** `leet-ai-start`, `leet-ai-submit`, `leet-ai-reset`은 Claude Code 스킬입니다.
> Claude Code 세션 안에서 메시지로 입력하세요 — 터미널 명령어가 아닙니다.

## 채점 방식

코드 품질, 테스트 결과, AI 활용 방식 등 여러 기준으로 **100점 만점** 채점됩니다.
세부 배점은 비공개입니다.

### 뱃지

성적과 행동 패턴에 따라 16종의 뱃지 중 하나가 부여됩니다:

| 뱃지 | 힌트 |
|------|------|
| ZERO SHOT SHIPPER | 속도 + 완벽함 |
| PROMPT SURGEON | 뛰어난 산출물 품질 |
| ??? | 14종의 시크릿 뱃지 |

## 제출 시 전송되는 데이터

- 코드 변경사항 (git diff)
- AI 대화 요약 (~5000 토큰, 파일 경로 제거됨)
- 테스트 결과
- 도구 사용 패턴
- 수정된 테스트 파일 목록

> 파일 경로는 제거되며, 제출 전 동의를 구합니다.

## 요구사항

- [Claude Code](https://claude.ai/download)
- [Bun](https://bun.sh)
- Git
