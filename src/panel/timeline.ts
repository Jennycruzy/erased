import type { Company } from "../core/trail";

const NS = "http://www.w3.org/2000/svg";

/** Lays out one dot per company along the years, stacking dots that would overlap. Pure, for testing. */
export function layoutTimeline(cs: Company[], width: number, now: number) {
  const joined = (c: Company) => c.signedUp ?? c.firstSeen;
  const dated = cs.filter((c) => Number.isFinite(joined(c)));
  if (!dated.length) return { dots: [], years: [] as Array<{ x: number; label: string }>, height: 40 };
  const start = new Date(Math.min(...dated.map(joined)));
  const t0 = Date.UTC(start.getUTCFullYear(), 0, 1);
  const pad = 10;
  const x = (t: number) => pad + ((t - t0) / Math.max(1, now - t0)) * (width - 2 * pad);
  const cols = new Map<number, number>();
  const dots = dated
    .sort((a, b) => joined(a) - joined(b))
    .map((c) => {
      const cx = Math.round(x(joined(c)) / 6) * 6;
      const level = cols.get(cx) ?? 0;
      cols.set(cx, level + 1);
      const r = Math.min(5, 2 + Math.log2(1 + c.emails) / 2);
      const kind = c.breachedAfterJoining.length ? "red" : c.breaches.length ? "amber" : c.stale ? "grey" : "dark";
      return { cx, level, r, kind, domain: c.domain };
    });
  const maxLevel = Math.max(...dots.map((d) => d.level), 0);
  const height = Math.min(140, 26 + (maxLevel + 1) * 7);
  const years: Array<{ x: number; label: string }> = [];
  for (let y = start.getUTCFullYear(); y <= new Date(now).getUTCFullYear(); y++) years.push({ x: x(Date.UTC(y, 0, 1)), label: String(y) });
  return { dots, years, height };
}

/** The data-trail strip: dots stack upwards from the year axis; red = breached after you joined. */
export function drawTimeline(host: HTMLElement, cs: Company[], now = Date.now()) {
  const width = host.clientWidth || 360;
  const { dots, years, height } = layoutTimeline(cs, width, now);
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${cs.length} companies by the year you joined; ${cs.filter((c) => c.breachedAfterJoining.length).length} breached after you joined`);
  const base = height - 16;
  const step = Math.max(1, Math.ceil(years.length / 6));
  years.forEach((y, i) => {
    if (i % step) return;
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(Math.min(width - 14, Math.max(14, y.x)))); t.setAttribute("y", String(height - 3)); t.setAttribute("class", "tl-year");
    t.textContent = y.label;
    svg.append(t);
  });
  const axis = document.createElementNS(NS, "line");
  axis.setAttribute("x1", "0"); axis.setAttribute("x2", String(width)); axis.setAttribute("y1", String(base + 2)); axis.setAttribute("y2", String(base + 2));
  axis.setAttribute("class", "tl-axis");
  svg.append(axis);
  // Red dots last so they sit on top.
  for (const d of [...dots].sort((a, b) => Number(a.kind === "red") - Number(b.kind === "red"))) {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", String(d.cx)); c.setAttribute("cy", String(base - 4 - d.level * 7)); c.setAttribute("r", String(d.r));
    c.setAttribute("class", `tl-dot ${d.kind}`);
    const title = document.createElementNS(NS, "title");
    title.textContent = d.domain;
    c.append(title);
    svg.append(c);
  }
  host.replaceChildren(svg);
}
