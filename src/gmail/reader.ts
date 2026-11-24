/** Reads the Gmail web page in this browser. Nothing here makes a network request. */
import { gmailIdKey, htmlToText, latestMessage, messageBodies, messageTimes, printViewUrl, anchorsOf } from "../core/html";
export interface Row {
  from: string;
  /** Every sender Gmail lists on the row; a thread with your request and their reply shows both. */
  senders?: string[];
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
    const senders = [...new Set([...row.querySelectorAll("[email]")].filter(visible).map((x) => x.getAttribute("email") ?? "").filter(Boolean))];
    out.push({ from: s.getAttribute("email") ?? "", senders, subject, at, threadId });
  });
  return out;
}

const signature = () => rowsOnPage().slice(0, 3).map((r) => r.from + r.subject).join("|");
const olderButton = () =>
  // Search results page with "Next results"; mailbox views with "Older".
  [...document.querySelectorAll('[aria-label="Next results"],[data-tooltip="Next results"],[aria-label="Older"],[data-tooltip="Older"],[aria-label="Older messages"]')].find(visible);

/** Opens a Gmail search and pages through every result, calling onPage after each page. */
export async function scanSearch(query: string, onPage: (rows: Row[], page: number) => void, maxPages = 200): Promise<number> {
  const back = location.hash;
  try {
    return await pageThrough(query, onPage, maxPages);
  } finally {
    location.hash = back;
  }
}

async function pageThrough(query: string, onPage: (rows: Row[], page: number) => void, maxPages: number): Promise<number> {
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

/** The signed-in Gmail address, from the page title ("Inbox (3) - you@example.com - Gmail"). */
export function accountEmail(): string | null {
  const m = document.title.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/);
  return m ? m[0].toLowerCase() : null;
}

/**
 * Text of one thread through Gmail's print view, fetched from this same Gmail page with the user's own session.
 * Stays in the browser; goes only to the on-device model.
 */
let idKey: string | null = null;

export async function threadFull(threadId: string, from?: string): Promise<{ text: string; at: number | null; earlier: Array<{ body: string; at: number | null }>; mine: number[]; links: Array<{ text: string; url: string }> } | null> {
  const base = location.pathname.match(/^\/mail\/u\/\d+\//)?.[0] ?? "/mail/u/0/";
  const ik = (idKey ??= gmailIdKey(document.documentElement.innerHTML));
  const url = ik ? printViewUrl(base, ik, threadId) : null;
  if (!url) return null;
  try {
    const r = await fetch(url, { credentials: "include", signal: AbortSignal.timeout(20_000) });
    if (!r.ok) return null;
    const html = await r.text();
    if (/<title>[^<]*Conversation deleted/i.test(html)) return null;
    const all = htmlToText(html);
    // Their earlier messages in the same thread, oldest first: a later "we are waiting for your answer" reminder
    // must not hide the question it reminds you of.
    // When you wrote in this thread: a reply after their ask means you already did what it asked.
    const me = accountEmail()?.toLowerCase();
    const mine = me ? messageTimes(all).filter((m) => m.email === me).map((m) => m.at) : [];
    // Their messages with times: "you answered" is judged against the asking message, not the thread's newest date.
    const theirs = messageBodies(all).filter((m) => m.email === from?.toLowerCase() && m.body).map((m) => ({ body: m.body, at: Number.isNaN(m.at) ? null : m.at }));
    const latest = theirs.at(-1);
    return { text: latestMessage(all, from), at: latest?.at ?? null, earlier: theirs.slice(0, -1), mine, links: anchorsOf(html) };
  } catch {
    return null;
  }
}

export async function threadText(threadId: string, from?: string): Promise<string | null> {
  const base = location.pathname.match(/^\/mail\/u\/\d+\//)?.[0] ?? "/mail/u/0/";
  const ik = (idKey ??= gmailIdKey(document.documentElement.innerHTML));
  const url = ik ? printViewUrl(base, ik, threadId) : null;
  if (!url) return null;
  try {
    const r = await fetch(url, { credentials: "include", signal: AbortSignal.timeout(20_000) });
    if (!r.ok) return null;
    const html = await r.text();
    if (/<title>[^<]*Conversation deleted/i.test(html)) return null;
    return latestMessage(htmlToText(html), from);
  } catch {
    return null;
  }
}

/** When `me` first wrote in this thread (the list row shows the newest message's date, not ours). */
export async function firstSentAt(threadId: string, me: string): Promise<number | null> {
  const base = location.pathname.match(/^\/mail\/u\/\d+\//)?.[0] ?? "/mail/u/0/";
  const ik = (idKey ??= gmailIdKey(document.documentElement.innerHTML));
  const url = ik ? printViewUrl(base, ik, threadId) : null;
  if (!url) return null;
  try {
    const r = await fetch(url, { credentials: "include", signal: AbortSignal.timeout(20_000) });
    if (!r.ok) return null;
    const mine = messageTimes(htmlToText(await r.text())).filter((x) => x.email === me.toLowerCase()).map((x) => x.at);
    return mine.length ? Math.min(...mine) : null;
  } catch {
    return null;
  }
}
