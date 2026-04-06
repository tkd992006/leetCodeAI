#!/bin/bash
# 환경 체크 + 스킬 자동 업데이트 + 환경 설정 로드
echo "=== Leet Code AI Environment Check ==="

# bun/git 확인
if command -v bun &>/dev/null; then echo "BUN: $(bun --version)"; else echo "BUN: NOT_FOUND"; fi
if command -v git &>/dev/null; then echo "GIT: $(git --version)"; else echo "GIT: NOT_FOUND"; fi

FILE_COUNT=$(ls -A 2>/dev/null | wc -l | tr -d ' ')
echo "FILES_IN_CWD: $FILE_COUNT"
echo "START_TIME: $(date +%s)"

# 스킬 디렉토리 resolve
SKILL_DIR="${CLAUDE_SKILL_DIR:-$HOME/.claude/skills/leet-ai-start}"
[ -L "$SKILL_DIR" ] && SKILL_DIR="$(cd "$SKILL_DIR" && pwd -P)"
SKILL_ROOT="$(dirname "$SKILL_DIR")"

# config.json에서 서버 URL 로드 (config.local.json 우선)
CONFIG_FILE="$SKILL_ROOT/config.local.json"
[ ! -f "$CONFIG_FILE" ] && CONFIG_FILE="$SKILL_ROOT/config.json"

if [ -f "$CONFIG_FILE" ]; then
  AILEET_SERVER=$(grep -o '"server"[[:space:]]*:[[:space:]]*"[^"]*"' "$CONFIG_FILE" | cut -d'"' -f4)
fi
AILEET_SERVER="${AILEET_SERVER:-https://aileetserver-production.up.railway.app}"

echo "AILEET_SERVER: $AILEET_SERVER"

# Auto-update
REPO_DIR="$(cd "$SKILL_DIR" && git rev-parse --show-toplevel 2>/dev/null)"
if [ -n "$REPO_DIR" ] && [ -f "$REPO_DIR/version.json" ]; then
  LOCAL_VER=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$REPO_DIR/version.json" | cut -d'"' -f4)
  git -C "$REPO_DIR" fetch --quiet origin main 2>/dev/null
  REMOTE_VER=$(git -C "$REPO_DIR" show origin/main:version.json 2>/dev/null | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)

  if [ -n "$LOCAL_VER" ] && [ -n "$REMOTE_VER" ] && [ "$LOCAL_VER" != "$REMOTE_VER" ]; then
    echo "UPDATE: $LOCAL_VER → $REMOTE_VER"
    git -C "$REPO_DIR" pull --ff-only origin main 2>/dev/null && echo "UPDATE_SUCCESS" || echo "UPDATE_FAILED"
  else
    echo "UP_TO_DATE"
  fi
else
  echo "SKIP_UPDATE"
fi
