const norm = (s: string) =>
  s.normalize("NFKC").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

/** A model's quote counts only if it appears word for word in the email it came from. */
export function quoteIsIn(quote: string | undefined | null, text: string): boolean {
  if (!quote) return false;
  const q = norm(quote);
  return q.length >= 8 && norm(text).includes(q);
}

/** A deletion that is only scheduled or pending is not proof: the quoted sentence decides, not the label. */
const NOT_DONE_YET = /\b(scheduled|will be|pending|in \d+ days|within \d+ days|once (we|your|the))\b/i;
/** Words that say the deletion already happened. */
const DONE = /\b(has|have|had) been (permanently |successfully |fully )?(deleted|erased|removed|closed|anonymi[sz]ed)\b|\b(we|i)( have| 've)? (permanently |successfully )?(deleted|erased|removed|closed|anonymi[sz]ed)\b|\b(was|were|is|are) (now )?(permanently |successfully )?(deleted|erased|removed|closed)\b|\bno longer (hold|have|store|process)\b/i;

/**
 * "deleted" is the one label that can end up as proof, so the quoted sentence must say it already happened.
 * Scheduled or pending deletions, policy text, forms and receipts become "ack".
 */
export function notDoneYet<T extends string>(reply: T, quote: string): T | "ack" {
  return reply === "deleted" && (NOT_DONE_YET.test(quote) || !DONE.test(quote)) ? "ack" : reply;
}
