export type Route = "email" | "form" | "portal" | "account_settings" | "none" | "unknown";

export interface DirectoryEntry {
  domain: string;
  company: string;
  privacy_url: string;
  request_route: Route;
  dsar_email: string | null;
  form_url: string | null;
  laws_named: string[];
  /** Sentence from the page that names the route. Kept only if found word for word on the page. */
  route_quote: string | null;
  verified: boolean;
  verified_at: string;
  method: "page_text" | "url_context";
}

export const DIRECTORY_SCHEMA = {
  type: "object",
  properties: {
    company: { type: "string", description: "Company or service name." },
    request_route: { type: "string", enum: ["email", "form", "portal", "account_settings", "none"], description: "How a person asks to delete their personal data." },
    dsar_email: { type: ["string", "null"], description: "Email address for privacy or deletion requests, exactly as written on the page." },
    form_url: { type: ["string", "null"], description: "Link to a privacy request form or portal, if given." },
    laws_named: { type: "array", items: { type: "string" }, description: "Privacy laws the page names, e.g. GDPR, CCPA, LGPD." },
    route_quote: { type: "string", description: "One sentence copied exactly from the page that says how to ask for deletion or make a privacy rights request (not general settings or marketing choices)." },
  },
  required: ["company", "request_route", "dsar_email", "form_url", "laws_named", "route_quote"],
} as const;

export const directoryPrompt = (domain: string) =>
  `You read the public privacy policy of ${domain}. Find how a person asks this company to delete their personal data. ` +
  `Prefer a dedicated privacy/DPO email or request form over general support. Copy route_quote exactly from the page, ` +
  `word for word. If the page gives no way to request deletion, use request_route "none".`;
