# Erased

**Your inbox already knows every company that holds your data. Erased reads it on your device, shows you who has
your data and who was breached after you joined, asks them to delete it under the law where you live, and then
proves whether they did, by watching what they send you next.**

Built for Chrome with [Firebase AI Logic](https://firebase.google.com/docs/ai-logic) hybrid inference: Gemini Nano
on your device for your mail, Gemini in the cloud only for public pages.

## Why hybrid

| What | Where it runs | Why |
|---|---|---|
| Reading your emails (is this a real account? what did the company reply?) | **On your device only** (`InferenceMode.ONLY_ON_DEVICE`) | The list of companies you use is private. It never leaves your computer. |
| Reading companies' public privacy pages to find how to ask for deletion | **Cloud** (`InferenceMode.ONLY_IN_CLOUD`, URL context) | The pages are public and long; the device can't fetch the web. |
| Deadlines, request states, verdicts | **Plain code** | The model only extracts quoted facts. Rules decide. A model's quote counts only if it appears word for word in the email. |

## What's in it

**Extension (side panel, three tabs).**
- **Trail.** Pages through the account-type mail in Gmail (welcome, verify, password reset, sign-in alerts,
  receipts) in your own browser and builds your data trail live: every company, when you joined, when they last
  wrote, a running count and a safety score.
- **Breach flags.** Every company is matched against the public [Have I Been Pwned](https://haveibeenpwned.com/)
  catalogue (1,052 breaches, bundled, matched locally); breaches that happened **after you joined** are marked red,
  and companies silent for 3+ years are marked unused.
- **Clean up.** Breached and unused companies are pre-selected. Choose *Delete me* or *Stop marketing* (keeps the
  account). The request is a fixed legal letter under GDPR, UK GDPR or CCPA with the legal deadline; Gmail opens
  with it addressed to the company's privacy team and you press Send. Companies that use a form get the letter
  copied and the form opened. For a company the directory doesn't know, *Find how to remove* sends only that
  company's name to cloud Gemini, which reads its public privacy page.
- **Watch.** Each request shows its deadline ring and state. *Check for replies* finds your sent copy and the
  company's replies by the request's reference, reads them with the on-device model, and watches for marketing
  after a confirmed deletion. Verdicts: **ERASED** (confirmed, then 30 quiet days) or **NOT ERASED** (marketing
  more than 3 days after "deleted"). Overdue requests get a follow-up letter; refusals, silence after the
  follow-up and broken promises get a printable **complaint pack**, built on the device with dated quotes.
- **Morning badge.** Once a day the icon shows how many requests need you.

**Public deletion directory.** `scripts/directory` builds it from public privacy pages: finds each company's
policy (a real headless browser for sites that block plain downloads), sends only the rights and contact
sections to cloud Gemini through Firebase AI Logic (`ONLY_IN_CLOUD`), and keeps a route or email only when the
sentence proving it is on the page word for word. Seeded from the Tranco top sites and every company in the
breach catalogue. Published as `directory.json` (the extension downloads it whole and matches on the device, so
not even your list of companies is sent) and to Firestore.

**Site** (`site/`, Firebase Hosting): the directory, the anonymous "who actually deletes" board, evidence and a
try-it guide.

**Firebase.** AI Logic (hybrid: on-device for mail, cloud for public pages), App Check (debug token in the
extension; no remote code), Firestore (directory; board counts with rules that allow one count per anonymous
user, company and outcome), Remote Config (cloud model list, proof timings, directory location, prompt version),
anonymous Auth for board counts.

## Run it

Requirements: Chrome 139+ on desktop with the on-device model (Windows 10/11, macOS 13+, Linux or Chromebook
Plus; a GPU with more than 4 GB VRAM, or 16 GB RAM and 4 CPU cores; 22 GB free disk).

```bash
npm ci
npm run build        # bundles the extension into dist/
npm test             # rules, deadlines, templates, breach matching, quote checks
```

Then open `chrome://extensions`, switch on Developer mode, choose **Load unpacked** and pick `dist/`. Open Gmail,
click the Erased icon, press **Get on-device AI ready** once (the first run downloads the model), then
**Scan my inbox**.

## Privacy

- The extension asks for `sidePanel`, `storage` and `alarms`, and runs only on `mail.google.com`.
- Email text is read in your browser and sent only to the on-device model. Every model call is logged with where
  it ran (`inferenceSource`), so you can check that private reads stayed on the device.
- Requests are sent from your own Gmail by you. Erased never sends email on its own.
- No remote code: everything ships in the extension package.

## Project layout

```
src/core           rules: domains, subject rules, laws and deadlines, request states, watcher, templates,
                   complaint pack, morning card, quote checks, trail, storage
src/ai             Firebase setup (App Check), hybrid models, company lookup, board counts
src/gmail          reads the Gmail page in your browser (content script)
src/panel          the side panel and the complaint page
scripts/directory  builds and publishes the public deletion directory
site               the public site (Firebase Hosting)
firestore.rules    who may read and write what
data               breach catalogue and directory build output
test               unit tests
```

## License

Apache-2.0
