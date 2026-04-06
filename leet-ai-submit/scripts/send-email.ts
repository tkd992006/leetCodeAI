// 이메일 전송
// Usage: bun send-email.ts <server_url> <submission_id> <email>
// server_url은 .aileet-session.json에서 읽어서 SKILL.md가 전달함

const serverUrl = Bun.argv[2];
const submissionId = Bun.argv[3];
const email = Bun.argv[4];

if (!serverUrl || !submissionId || !email) {
  console.log("ERROR: Missing arguments. Usage: bun send-email.ts <server_url> <submission_id> <email>");
  process.exit(1);
}

const res = await fetch(`${serverUrl}/api/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ submissionId, email }),
});
const result = await res.json();
console.log(JSON.stringify(result));
