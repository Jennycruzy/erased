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

/**
 * Internet plumbing nobody holds an account with: DNS, ad and tag servers, CDNs, telemetry, update and
 * connectivity checks, raw cloud hosts. Kept out of the directory seed and out of coverage counts.
 */
const PLUMBING_EXACT = new Set([
  "gtld-servers.net", "domaincontrol.com", "2mdn.net", "doubleclick.net", "googlesyndication.com", "googletagservices.com",
  "googleadservices.com", "googletagmanager.com", "google-analytics.com", "app-measurement.com", "app-analytics-services.com",
  "gstatic.com", "googleapis.com", "ggpht.com", "googleusercontent.com", "youtube-nocookie.com", "ytimg.com", "youtu.be", "goo.gl", "forms.gle", "wa.me",
  "akam.net", "akamai.net", "akamaiedge.net", "akamaized.net", "akadns.net", "edgekey.net", "edgesuite.net", "cloudfront.net", "fastly.net", "jsdelivr.net",
  "office.net", "static.microsoft", "msftconnecttest.com", "msftncsi.com", "windowsupdate.com", "sfx.ms", "microsoftonline.com", "lsrelayaccess.com",
  "amazon-adsystem.com", "media-amazon.com", "awswaf.com", "aws.dev", "amazon.dev", "a2z.com", "aliyuncs.com", "aliyuncsslbintl.com", "yandexcloud.net",
  "nflximg.com", "nflxvideo.net", "ttvnw.net", "vkuserphoto.ru", "online-metrix.net", "shopifysvc.com", "mybluehost.me", "name-services.com", "tbcache.com",
  "3gppnetwork.org", "h264.io", "w3.org", "xcal.tv", "imcmdb.net", "gwfb.net", "whatsapp.net", "fbcdn.net", "cdninstagram.com", "twimg.com", "apple-dns.net",
  "icloud-content.com", "aaplimg.com", "mzstatic.com", "cdn-apple.com", "root-servers.net", "in-addr.arpa", "digicert.com", "sectigo.com", "letsencrypt.org",
]);
const PLUMBING_WORDS = /(^|[.-])(cdn|dns|ns\d*|static|img|imgs|assets|ads?|adsystem|adservice|adserver|analytics|metrics?|telemetry|tracking|tag|tags|pixel|beacon|update|updates|ocsp|crl|edge|cache|relay|servers?|nocookie|usercontent|measurement|connecttest|ncsi)([.-]|$)/;

export function isPlumbing(domain: string): boolean {
  const d = domain.toLowerCase();
  if (PLUMBING_EXACT.has(d)) return true;
  if (/^[a-z0-9]{12,}-[a-z]\.com$|^[a-z0-9]{16,}\./.test(d)) return true; // random machine names
  return PLUMBING_WORDS.test(d.split(".").slice(0, -1).join("."));
}

/** A route a person can actually use; "verified" only counts for these. */
export const hasRoute = (e: Pick<DirectoryEntry, "request_route">) => e.request_route !== "none" && e.request_route !== "unknown";
