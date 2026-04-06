// 세션 JSONL 파일 파싱: 도구 사용 통계 + 대화 요약 추출
// Usage: bun parse-session.ts <session_file>

const sessionFile = Bun.argv[2];

if (!sessionFile) {
  console.log("ERROR: Usage: bun parse-session.ts <session_file>");
  process.exit(1);
}

const content = await Bun.file(sessionFile).text();
const lines = content.split("\n").filter((l) => l.trim());

const toolCounts: Record<string, number> = {};
let firstTool = "";
let userTurns = 0;
const messages: { role: string; content: string }[] = [];

for (const line of lines) {
  try {
    const record = JSON.parse(line);
    const rtype = record.type;

    if (rtype === "user") {
      const msg = record.message?.content;
      if (typeof msg === "string" && msg) {
        userTurns++;
        const cleaned = msg.replace(/\/[^\s"]+/g, "[PATH]");
        messages.push({ role: "user", content: cleaned.slice(0, 500) });
      }
    } else if (rtype === "assistant") {
      const contentList = record.message?.content;
      if (Array.isArray(contentList)) {
        for (const item of contentList) {
          if (item?.type === "tool_use") {
            const name = item.name || "unknown";
            toolCounts[name] = (toolCounts[name] || 0) + 1;
            if (!firstTool) firstTool = name;
          } else if (item?.type === "text" && item.text) {
            const cleaned = item.text.replace(/\/[^\s"]+/g, "[PATH]");
            messages.push({
              role: "assistant",
              content: cleaned.slice(0, 500),
            });
          }
        }
      }
    }
  } catch {}
}

// 요약: 처음 10개 + 마지막 5개
const summary =
  messages.length > 15
    ? [...messages.slice(0, 10), ...messages.slice(-5)]
    : messages;

console.log("===TOOL_SUMMARY===");
console.log(JSON.stringify({ toolCounts, firstTool, totalTurns: userTurns }));
console.log("===MESSAGES===");
for (const m of summary) {
  console.log(JSON.stringify(m));
}
console.log("===END===");
