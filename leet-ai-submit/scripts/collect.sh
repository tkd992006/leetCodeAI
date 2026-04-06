#!/bin/bash
# 테스트 실행 + 코드 변경사항 수집
echo "===TEST_RESULTS==="
bun run test 2>&1

echo "===CODE_DIFF==="
git diff HEAD

echo "===MODIFIED_TEST_FILES==="
git diff HEAD --name-only -- tests/
