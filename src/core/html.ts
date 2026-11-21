/**
 * Gmail's page enforces Trusted Types, so DOMParser and innerHTML writes throw there, also from a content script.
 * These helpers turn the print view into text with plain string work and never touch an HTML sink.
 */

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", copy: "©", reg: "®", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", zwnj: "", zwj: "" };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Visible text of an HTML document: drops head, scripts and styles, keeps line breaks at block ends. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style|head|title|noscript)\b[\s\S]*?<\/\1\s*>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|tr|li|h[1-6]|table|blockquote)\s*>/gi, "\n")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/[\u00ad\u034f\u200b\u200c\u200d\u2060\ufeff]/g, "")
    .replace(/[\u00a0\u2009\u202f]/g, " ")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Gmail's per-account key ("ik"), from the page source. Current Gmail writes `var GM_ID_KEY = '…'` in <head>. */
export function gmailIdKey(source: string): string | null {
  const m = source.match(/GM_ID_KEY\s*=\s*'([0-9a-f]+)'/) ?? source.match(/"ik"\s*:\s*"([0-9a-f]+)"/);
  return m ? m[1] : null;
}

/** Thread ids come as hex (data-legacy-thread-id) or decimal (data-thread-id "thread-f:…"); print view wants hex. */
export function hexThreadId(id: string): string | null {
  const t = id.replace(/^#?thread-f:/, "");
  if (/^[0-9a-f]{12,20}$/i.test(t) && /[a-f]/i.test(t)) return t.toLowerCase();
  if (/^\d{15,22}$/.test(t)) return BigInt(t).toString(16);
  if (/^[0-9a-f]{12,20}$/i.test(t)) return t.toLowerCase();
  return null;
}

/** Print view of one thread. Without the key Gmail answers "Conversation deleted". */
export function printViewUrl(base: string, ik: string, threadId: string): string | null {
  const th = hexThreadId(threadId);
  return th ? `${base}?ik=${ik}&view=pt&search=all&th=${th}` : null;
}

/** A message header line in Gmail's print view text: "Name <a@b.com> Fri, Nov 20, 2026 at 5:17 PM To: …". */
const HEADER = /^(?:.*?<([^<>\s]+@[^<>\s]+)>|([^<>\s]+@[^<>\s]+))\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \d{1,2}, \d{4} at \d{1,2}:\d{2}\s?[AP]M\b/;
const HELPDESK_DATE = /^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2}(\s?[AP]M)? [A-Z]{2,5}$/;
const META = /^(To|Cc|Bcc|Reply-To):/i;
const QUOTE_START = /^(On .{6,200} wrote:|-{2,}\s*Original Message\s*-{2,}|From: .+(Sent|Date): .+|_{8,})$/i;

/**
 * The newest message in a print-view thread from `from` (else the newest message), without the print header,
 * the address lines or quoted history. If the layout is not recognised, returns the whole text.
 */
export function latestMessage(text: string, from?: string): string {
  const lines = text.split("\n");
  const heads: Array<{ i: number; email: string }> = [];
  lines.forEach((l, i) => { const m = l.match(HEADER); if (m) heads.push({ i, email: (m[1] ?? m[2]).toLowerCase() }); });
  if (!heads.length) return text;
  const want = from?.toLowerCase();
  const pickAt = [...heads].reverse().find((h) => h.email === want) ?? heads[heads.length - 1];
  const end = heads.find((h) => h.i > pickAt.i)?.i ?? lines.length;
  const body: string[] = [];
  for (const l of lines.slice(pickAt.i + 1, end)) {
    if (!body.length && (META.test(l) || !l)) continue;
    if (QUOTE_START.test(l) || /^>/.test(l)) break;
    // Help desks (Zendesk and alike) quote earlier messages under "Name" + "Nov 20, 2026, 12:17 EST"; their own
    // reply can open with the same pair, so this only cuts once the reply has real content above it.
    if (HELPDESK_DATE.test(l) && body.filter(Boolean).length >= 4) { body.pop(); break; }
    body.push(l);
  }
  return body.join("\n").replace(/\n{3,}/g, "\n\n").trim() || text;
}

/** Sender and time of every message in a print-view thread. Gmail prints times in the browser's own zone. */
export function messageTimes(text: string): Array<{ email: string; at: number }> {
  const out: Array<{ email: string; at: number }> = [];
  for (const l of text.split("\n")) {
    const m = l.match(HEADER);
    if (!m) continue;
    const when = l.match(/(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), ([A-Z][a-z]{2} \d{1,2}, \d{4}) at (\d{1,2}:\d{2})\s?([AP]M)/);
    const at = when ? Date.parse(`${when[1]} ${when[2]} ${when[3]}`) : NaN;
    if (!Number.isNaN(at)) out.push({ email: (m[1] ?? m[2]).toLowerCase(), at });
  }
  return out;
}
