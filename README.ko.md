🇺🇸 [English](README.md)

# Leet AI — AI-Powered Coding Challenge

AI 코딩 어시스턴트를 얼마나 잘 다루는지 측정하는 실전 챌린지입니다.

Claude Code로 코딩 문제를 풀고, 4가지 기준으로 채점받으세요. 뱃지도 받을 수 있습니다.

## 설치

```bash
git clone https://github.com/tkd992006/leetCodeAI.git ~/.claude/skills/leetCodeAI && ~/.claude/skills/leetCodeAI/setup
```

## 사용법

### 1. 빈 디렉토리에서 시작

```bash
mkdir ~/aileet-challenge && cd ~/aileet-challenge && claude
```

### 2. 챌린지 시작

Claude Code에서:
```
/leet-ai-start
```

환경 확인 → 챌린지 템플릿 설치 → 에디터 오픈까지 자동으로 진행됩니다.

### 3. 문제 풀기

AI와 대화하며 코드를 작성하세요. 목표는 **모든 테스트를 통과**시키는 것입니다.

```bash
bun run dev   # 브라우저에서 앱 확인
bun run test  # 테스트 실행
```

### 4. 제출

```
/leet-ai-submit
```

### 5. 결과 확인

채점 후 웹에서 점수, 뱃지, AI 리뷰를 확인할 수 있습니다.

---

## 채점 방식

4가지 기준으로 채점됩니다 (각 25점, 총 100점):

| 기준 | 설명 | 평가 방식 |
|------|------|----------|
| **완성도** | 테스트 통과율 | 자동 (passed/total x 25) |
| **산출물 품질** | 코드 품질, 구조, 네이밍 | AI 심사 (코드 diff 분석) |
| **프로세스 품질** | 프롬프트 명확성, 맥락 활용, 반복 개선 | AI 심사 (대화 요약 분석) |
| **함정 탐지** | 의도적으로 숨겨진 버그/잘못된 테스트 발견 | 자동 (수정된 테스트 파일 매칭) |

### 뱃지

성적과 행동 패턴에 따라 16종의 뱃지 중 하나가 부여됩니다:

| 뱃지 | 설명 |
|------|------|
| ZERO SHOT SHIPPER | 15분 안에 만점 |
| HALLUCINATION HUNTER | AI 환각 탐지 능력 최고 |
| PROMPT SURGEON | 높은 코드 품질 |
| CONTEXT ARCHITECT | 맥락 활용의 달인 |
| DEBUG WHISPERER | 꾸준한 디버깅 |
| TOKEN SWEEPER | 토큰 대량 소비 |
| ??? | 10종의 시크릿 뱃지 |

---

## 제출 시 전송되는 데이터

- 코드 변경사항 (git diff)
- AI 대화 요약 (~5000 토큰, 파일 경로 제거됨)
- 테스트 결과
- 도구 사용 패턴 (어떤 도구를 몇 번 사용했는지)
- 수정된 테스트 파일 목록

> 파일 경로는 제거되며, 제출 전 동의를 구합니다.

## 명령어

| 명령어 | 설명 |
|--------|------|
| `/leet-ai-start` | 챌린지 시작 |
| `/leet-ai-submit` | 제출 & 채점 |
| `/leet-ai-reset` | 코드를 초기 상태로 리셋 |

## 요구사항

- [Claude Code](https://claude.ai/download)
- [Bun](https://bun.sh)
- Git
