/** The public "who actually deletes" board, downloaded whole and matched on this device. */

export const BOARD_COUNTERS = ["requests", "confirmed", "proven", "broken", "refused", "overdue"] as const;
export type BoardCounter = (typeof BOARD_COUNTERS)[number];
export type BoardCounts = Partial<Record<BoardCounter, number>>;

/** A company is shown only once this many people have reported on it. */
export const BOARD_MIN_REPORTS = 5;

export function reports(c: BoardCounts): number {
  return Math.max(...BOARD_COUNTERS.map((k) => c[k] ?? 0));
}

/** Keeps companies with enough reports; the rest stay private. */
export function publicBoard(all: Record<string, BoardCounts>, min = BOARD_MIN_REPORTS): Record<string, BoardCounts> {
  return Object.fromEntries(Object.entries(all).filter(([, c]) => reports(c) >= min));
}

/** One line for a trail row, e.g. "12 people asked · 4 told they were deleted · 2 still got marketing". */
export function boardLine(c: BoardCounts | undefined): string | null {
  if (!c || reports(c) < BOARD_MIN_REPORTS) return null;
  const parts = [`${reports(c)} people asked`];
  const confirmed = (c.confirmed ?? 0) + (c.proven ?? 0);
  if (confirmed) parts.push(`${confirmed} told they were deleted`);
  if (c.broken) parts.push(`${c.broken} still got marketing`);
  if (c.refused) parts.push(`${c.refused} refused`);
  if (c.overdue) parts.push(`${c.overdue} no answer in time`);
  return parts.join(" · ");
}
