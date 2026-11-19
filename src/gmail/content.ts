import { ACCOUNT_SEARCH } from "../core/headers";
import { accountEmail, scanSearch, threadText, type Row } from "./reader";

/**
 * Runs inside mail.google.com. Talks only to this extension's side panel over local ports and messages;
 * makes no network request except reading the user's own Gmail print view of a thread.
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "erased-scan") return;
  port.onMessage.addListener(async (msg: { type: string; query?: string; maxPages?: number }) => {
    if (msg.type !== "scan") return;
    const seen = new Set<string>();
    const pages = await scanSearch(msg.query ?? ACCOUNT_SEARCH, (rows: Row[], page: number) => {
      const fresh = rows.filter((r) => {
        const k = `${r.threadId ?? ""}|${r.from}|${r.at}|${r.subject}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      port.postMessage({ type: "rows", rows: fresh, page });
    }, msg.maxPages ?? 200);
    port.postMessage({ type: "done", pages, total: seen.size });
  });
});

chrome.runtime.onMessage.addListener((msg: { type: string; threadId?: string }, _sender, reply) => {
  if (msg.type === "whoami") { reply({ email: accountEmail() }); return false; }
  if (msg.type === "thread" && msg.threadId) { threadText(msg.threadId).then((text) => reply({ text })); return true; }
  return false;
});
