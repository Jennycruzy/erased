const norm = (s: string) =>
  s.normalize("NFKC").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();

/** A model's quote counts only if it appears word for word in the email it came from. */
export function quoteIsIn(quote: string | undefined | null, text: string): boolean {
  if (!quote) return false;
  const q = norm(quote);
  return q.length >= 8 && norm(text).includes(q);
}
