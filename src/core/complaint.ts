import { LAWS } from "./laws";
import { regulatorFor } from "./regulators";
import { status, type RequestEvent } from "./requests";
import type { StoredRequest } from "./store";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const day = (t: number) => new Date(t).toISOString().slice(0, 10);

function describe(e: RequestEvent): string {
  switch (e.type) {
    case "sent": return "Request sent from the account's own email address.";
    case "reply": return `Company replied (${e.reply.replace("_", " ")}): “${e.quote}”`;
    case "extension_notice": return `Company said it needs more time: “${e.quote}”`;
    case "marketing": return `Marketing email received: “${e.subject}”`;
    case "followed_up": return "Follow-up sent after the deadline.";
    case "user_skipped_id": return "Identity check requested; not provided.";
    case "step_done": return "I did what the company's reply asked.";
    case "signin_check": return "After the deletion was confirmed, a password reset was requested on the company's own sign-in page.";
    case "account_alive": return `The company then sent a sign-in email, so the account still exists: “${e.subject}”`;
  }
}

/** A printable complaint pack, built on the device from the request's own record. */
export function complaintHtml(r: StoredRequest, fullName: string, now: number, region = ""): string {
  const law = LAWS[r.law];
  const reg = regulatorFor(r.law, region);
  const s = status(r, now);
  const events = [...r.events].sort((a, b) => a.at - b.at);
  const what = r.kind === "delete" ? `erasure of my personal data (${law.deleteArticle})` : `an end to direct marketing (${law.objectArticle})`;
  const rows = events.map((e) => `<tr><td>${day(e.at)}</td><td>${esc(describe(e))}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Complaint: ${esc(r.company)} [${esc(r.ref)}]</title>
<style>body{font:14px/1.5 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 16px;color:#111}h1{font-size:22px}table{border-collapse:collapse;width:100%}td{border-top:1px solid #ddd;padding:8px;vertical-align:top}td:first-child{white-space:nowrap;width:110px}.box{border:1px solid #ddd;border-radius:8px;padding:12px 14px;margin:16px 0}@media print{button{display:none}}</style></head><body>
<button onclick="print()">Save as PDF</button>
<h1>Complaint about ${esc(r.company)} (${esc(r.domain)})</h1>
<p>To: ${esc(law.complaintTo)}</p>
${reg ? `<div class="box"><b>Send it to ${esc(reg.name)}.</b> Save this page as a PDF, then attach it on their page: <a href="${esc(reg.url)}">${esc(reg.how)}</a>.</div>` : ""}
<div class="box"><b>Summary.</b> On ${day(events.find((e) => e.type === "sent")?.at ?? r.createdAt)} I asked ${esc(r.company)} for ${esc(what)} under ${esc(law.name)}.
${esc(firstPerson(s.reason))} The law required a response within ${esc(law.deadlineText)}.</div>
<p><b>Complainant:</b> ${esc(fullName || "(your name)")}, account email ${esc(r.accountEmail)}. <b>Reference:</b> ${esc(r.ref)}.</p>
<h2>What happened</h2><table>${rows}</table>
<h2>What I ask</h2><p>That ${esc(r.company)} completes the request, confirms it in writing, and that the authority considers the company's handling of it.</p>
<p><b>Evidence.</b> The emails listed above are in my mailbox and can be provided in full. This pack was prepared by Erased on my own device; quotes are copied word for word from the emails.</p>
</body></html>`;
}

/** The panel speaks to you ("after you told them"); the complaint is written by you ("after I told them"). */
export function firstPerson(reason: string): string {
  return reason.replace(/\byou told them\b/g, "I told them").replace(/\byou asked\b/g, "I asked").replace(/\bYou asked\b/g, "I asked");
}
