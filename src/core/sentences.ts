/** Splits mail text into numbered sentences, so the on-device model can point at its proof by number instead of copying it. */
export function sentencesOf(text: string, max = 80): string[] {
  const flat = text.replace(/\r/g, "").split(/\n{1,}/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const out: string[] = [];
  for (const line of flat) {
    for (const s of line.match(/.+?(?:[.!?]+["')\]]*(?=\s|$)|$)/g) ?? []) {
      const t = s.trim();
      if (t.length >= 2) out.push(t);
      if (out.length >= max) return out;
    }
  }
  return out;
}

export const numbered = (sents: string[]) => sents.map((s, i) => `[${i + 1}] ${s}`).join("\n");

/** The sentence the model pointed at, or "" if the number is out of range. */
export const pick = (sents: string[], n: unknown) => (Number.isInteger(n) && (n as number) >= 1 && (n as number) <= sents.length ? sents[(n as number) - 1] : "");
