#!/bin/bash
# 챌린지 준비: 템플릿 복사 + 의존성 설치 + Git 초기화
# Usage: setup.sh <challenge-slug>
set -e

CHALLENGE="${1:-easy-cart}"
SKILL_DIR="${CLAUDE_SKILL_DIR:-$HOME/.claude/skills/leet-ai-start}"
[ -L "$SKILL_DIR" ] && SKILL_DIR="$(cd "$SKILL_DIR" && pwd -P)"
SKILL_ROOT="$(dirname "$SKILL_DIR")"
TEMPLATE_DIR="$SKILL_ROOT/challenges/$CHALLENGE/template"
CHALLENGE_JSON="$SKILL_ROOT/challenges/$CHALLENGE/challenge.json"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "ERROR: Template not found: $TEMPLATE_DIR"
  exit 1
fi

cp -r "$TEMPLATE_DIR/"* ./
cp -r "$TEMPLATE_DIR/".* ./ 2>/dev/null || true
[ -f "$CHALLENGE_JSON" ] && cp "$CHALLENGE_JSON" ./challenge.json

bun install
echo "TEMPLATE_COPIED"

git init && git add -A && git commit -m "initial" --no-verify --allow-empty
echo "GIT_INITIALIZED"
echo "SETUP_TIME: $(date +%s)"
