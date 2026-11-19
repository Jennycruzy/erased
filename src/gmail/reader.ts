/** Reads the Gmail web page in this browser. Nothing here makes a network request. */
export interface Row {
  from: string;
  subject: string;
  at: number;
  threadId?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const main = () => document.querySelector<HTMLElement>('div[role="main"]') ?? document.body;
const visible = (el: Element | null): el is HTMLElement => !!el && (el as HTMLElement).offsetParent !== null;

export function parseGmailDate(title: string | null): number {
  if (!title) return NaN;
  return Date.parse(title.replace(/[\u202f\u00a0\u2009]/g, " ").replace(/ at /, " "));
}

export function rowsOnPage(): Row[] {
  const out: Row[] = [];
  const seen = new Set<Element>();
  main().querySelectorAll("[email]").forEach((s) => {
    if (!visible(s)) return;
    const row = s.closest("tr") ?? s.closest('[role="row"]');
    if (!row || seen.has(row)) return;
    seen.add(row);
    let at = NaN;
    row.querySelectorAll("[title]").forEach((t) => {
      const v = parseGmailDate(t.getAttribute("title"));
      if (Number.isNaN(at) && v > 0) at = v;
    });
    const subject = row.querySelector(".bog, [data-thread-id] span, .y6 span")?.textContent?.trim() ?? "";
    const threadId =
      row.querySelector("[data-legacy-thread-id]")?.getAttribute("data-legacy-thread-id") ??
      row.querySelector("[data-thread-id]")?.getAttribute("data-thread-id")?.replace(/^#?thread-f:/, "") ??
      undefined;
    out.push({ from: s.getAttribute("email") ?? "", subject, at, threadId });
  });
  return out;
}

const signature = () => rowsOnPage().slice(0, 3).map((r) => r.from + r.subject).join("|");
const olderButton = () =>
  [...document.querySelectorAll('[aria-label="Older"],[data-tooltip="Older"],[aria-label="Older messages"]')].find(visible);

/** Opens a Gmail search and pages through every result, calling onPage after each page. */
export async function scanSearch(query: string, onPage: (rows: Row[], page: number) => void, maxPages = 200): Promise<number> {
  location.hash = "#search/" + encodeURIComponent(query);
  for (let i = 0; i < 40 && rowsOnPage().length === 0; i++) await sleep(500);
  await sleep(1200);
  let page = 0;
  while (page < maxPages) {
    page++;
    onPage(rowsOnPage(), page);
    let btn: HTMLElement | undefined;
    for (let i = 0; i < 20 && !btn; i++) { btn = olderButton() as HTMLElement | undefined; if (!btn) await sleep(300); }
    if (!btn || btn.getAttribute("aria-disabled") === "true") break;
    const before = signature();
    for (const t of ["mousedown", "mouseup", "click"]) btn.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    let moved = false;
    for (let i = 0; i < 40; i++) { await sleep(400); const s = signature(); if (s && s !== before) { moved = true; break; } }
    if (!moved) break;
    await sleep(800);
  }
  return page;
}
