// /lib/export.js

export function chatToMarkdown(messages) {
  const parts = (messages || []).map(m => {
    const role = m.role === "user" ? "You" : "Assistant";
    return `### ${role}\n\n${m.content}\n`;
  });
  return `# PromptPilot Chat Export\n\n${parts.join("\n")}`;
}

export function download(filename, text) {
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
