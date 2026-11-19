import { ACCOUNT_SEARCH } from "../core/headers";
import { scanSearch, type Row } from "./reader";

/** Runs inside mail.google.com. Streams header rows to the side panel over a local extension port. */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "erased-scan") return;
  port.onMessage.addListener(async (msg: { type: string; query?: string }) => {
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
    });
    port.postMessage({ type: "done", pages, total: seen.size });
  });
});
