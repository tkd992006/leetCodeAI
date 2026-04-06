// 채점 서버 전송: 헬스체크 + 트랜스크립트 업로드 + 채점 요청
// Usage: bun grade.ts <server_url> <payload_file> [transcript_file]
// server_url은 .aileet-session.json에서 읽어서 SKILL.md가 전달함

const serverUrl = Bun.argv[2];
const payloadFile = Bun.argv[3];
const transcriptFile = Bun.argv[4];

if (!serverUrl || !payloadFile) {
  console.log("ERROR: Usage: bun grade.ts <server_url> <payload_file> [transcript_file]");
  process.exit(1);
}

// 페이로드 파일 읽기
const payload = await Bun.file(payloadFile).text();

// 서버 헬스체크
try {
  const health = await fetch(`${serverUrl}/health`, {
    signal: AbortSignal.timeout(3000),
  });
  if (!health.ok) {
    console.log("SERVER_UNREACHABLE");
    process.exit(1);
  }
} catch {
  console.log("SERVER_UNREACHABLE");
  process.exit(1);
}

// 트랜스크립트 업로드 (파일 경로가 주어진 경우)
if (transcriptFile) {
  try {
    const transcript = await Bun.file(transcriptFile).text();
    const res = await fetch(`${serverUrl}/api/upload-transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: transcript,
    });
    const result = await res.json();
    console.log("===TRANSCRIPT_RESULT===");
    console.log(JSON.stringify(result));
  } catch {
    console.log("===TRANSCRIPT_RESULT===");
    console.log("UPLOAD_FAILED");
  }
}

// 채점 요청
const scoreRes = await fetch(`${serverUrl}/api/score`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: payload,
});
const scoreResult = await scoreRes.json();
console.log("===SCORE_RESULT===");
console.log(JSON.stringify(scoreResult));

// 임시 파일 정리
try {
  const { unlink } = await import("fs/promises");
  await unlink(payloadFile);
  if (transcriptFile) await unlink(transcriptFile);
} catch {}
