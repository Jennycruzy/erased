// Downloads the public Have I Been Pwned breach catalogue (no key needed) into data/breaches.json.
import { writeFileSync } from "node:fs";
const res = await fetch("https://haveibeenpwned.com/api/v3/breaches", { headers: { "user-agent": "erased-breach-catalogue" } });
if (!res.ok) throw new Error(`HIBP ${res.status}`);
const all = await res.json();
const keep = all.map(({ Name, Title, Domain, BreachDate, PwnCount, DataClasses, IsFabricated, IsSpamList, IsRetired }) =>
  ({ Name, Title, Domain, BreachDate, PwnCount, DataClasses, IsFabricated, IsSpamList, IsRetired }));
writeFileSync("data/breaches.json", JSON.stringify({ fetchedAt: new Date().toISOString(), source: "https://haveibeenpwned.com/api/v3/breaches", breaches: keep }));
console.log(`${keep.length} breaches saved`);
