import { companyDomain } from "./domain";

export interface Breach {
  name: string;
  title: string;
  domain: string;
  /** ISO date the breach happened. */
  date: string;
  accounts: number;
  dataClasses: string[];
}

export type BreachIndex = Map<string, Breach[]>;

/** Indexes the public Have I Been Pwned catalogue by company domain. Fabricated and spam-list entries are left out. */
export function indexBreaches(raw: Array<Record<string, unknown>>): BreachIndex {
  const idx: BreachIndex = new Map();
  for (const b of raw) {
    if (b.IsFabricated || b.IsSpamList || b.IsRetired) continue;
    const d = typeof b.Domain === "string" && b.Domain ? companyDomain(b.Domain) : null;
    if (!d) continue;
    const entry: Breach = {
      name: String(b.Name), title: String(b.Title), domain: d, date: String(b.BreachDate),
      accounts: Number(b.PwnCount) || 0, dataClasses: (b.DataClasses as string[]) ?? [],
    };
    idx.set(d, [...(idx.get(d) ?? []), entry]);
  }
  return idx;
}
