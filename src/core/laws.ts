import { addDays, addMonths } from "./time";

export type LawId = "gdpr" | "uk_gdpr" | "ccpa" | "policy";
export type RequestKind = "delete" | "stop_marketing";

export interface Law {
  id: LawId;
  name: string;
  /** Where the user lives, for picking the law. */
  regions: string[];
  deleteArticle: string;
  objectArticle: string;
  /** Deadline from the day the company received the request. */
  deadline: (sentAt: number) => number;
  /** Latest date if the company gives notice of an extension. */
  extendedDeadline: (sentAt: number) => number;
  deadlineText: string;
  complaintTo: string;
}

const EU = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO"];

export const LAWS: Record<LawId, Law> = {
  gdpr: {
    id: "gdpr", name: "EU General Data Protection Regulation (GDPR)", regions: EU,
    deleteArticle: "Article 17 GDPR (right to erasure)",
    objectArticle: "Article 21(2) and (3) GDPR (right to object to direct marketing)",
    deadline: (t) => addMonths(t, 1),
    extendedDeadline: (t) => addMonths(t, 3),
    deadlineText: "one month (Article 12(3) GDPR), extendable by two further months with notice and reasons",
    complaintTo: "the data protection authority of the EU/EEA country where you live (Article 77 GDPR)",
  },
  uk_gdpr: {
    id: "uk_gdpr", name: "UK GDPR and Data Protection Act 2018", regions: ["GB"],
    deleteArticle: "Article 17 UK GDPR (right to erasure)",
    objectArticle: "Article 21(2) and (3) UK GDPR (right to object to direct marketing)",
    deadline: (t) => addMonths(t, 1),
    extendedDeadline: (t) => addMonths(t, 3),
    deadlineText: "one month (Article 12(3) UK GDPR), extendable by two further months with notice and reasons",
    complaintTo: "the Information Commissioner's Office (ico.org.uk)",
  },
  ccpa: {
    id: "ccpa", name: "California Consumer Privacy Act (CCPA), as amended by the CPRA", regions: ["US-CA"],
    deleteArticle: "Cal. Civ. Code § 1798.105 (right to delete)",
    objectArticle: "Cal. Civ. Code § 1798.120 (right to opt out of sale or sharing)",
    deadline: (t) => addDays(t, 45),
    extendedDeadline: (t) => addDays(t, 90),
    deadlineText: "45 days, extendable once by 45 more days with notice",
    complaintTo: "the California Privacy Protection Agency (cppa.ca.gov)",
  },
  policy: {
    id: "policy", name: "the company's own privacy policy", regions: [],
    deleteArticle: "your privacy policy's deletion commitment",
    objectArticle: "your privacy policy's marketing opt-out",
    deadline: (t) => addDays(t, 30),
    extendedDeadline: (t) => addDays(t, 30),
    deadlineText: "30 days",
    complaintTo: "your national consumer or data protection authority",
  },
};

/** Picks the law from where the user lives (ISO country code, or "US-CA"). */
export function lawFor(region: string): Law {
  const r = region.toUpperCase();
  for (const law of Object.values(LAWS)) if (law.regions.includes(r)) return law;
  return LAWS.policy;
}
