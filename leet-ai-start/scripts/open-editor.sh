#!/bin/bash
# 에디터 감지 + 열기
if command -v code &>/dev/null; then
  code .
elif command -v cursor &>/dev/null; then
  cursor .
else
  open .
fi
