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

- **Inbox scan (side panel).** Pages through the account-type mail in Gmail (welcome, verify, password reset,
  sign-in alerts, receipts) in your own browser and builds your data trail live: every company, when you joined,
  when they last wrote, with a running count and a safety score.
- **Breach flags.** Matches each company against the public [Have I Been Pwned](https://haveibeenpwned.com/)
  breach catalogue (1,052 breaches, bundled with the extension, matched locally) and marks breaches that
  happened **after you joined**, plus companies you haven't heard from in 3+ years.
- **On-device reading.** Private reads use `ONLY_ON_DEVICE` with a JSON schema: is this a real account, what did
  the company reply, is this email marketing. Each answer must carry a quote found word for word in the email.
- **Legal requests.** Fixed templates for erasure, or "stop marketing, keep my account", under GDPR, UK GDPR or
  CCPA, with the legal deadline (including extensions) and a Gmail compose link so you send it yourself.
- **Proof rules.** Every request moves through clear states: sent → acknowledged → confirmed → **proven**
  (30 quiet days) or **broken** (marketing arrives after they said your data was deleted), and a complaint is
  ready when a company refuses, stays silent past the deadline, or breaks its word.

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
src/core     rules: domains, subject rules, laws and deadlines, request states, templates, quote checks, trail
src/ai       Firebase setup (App Check) and the hybrid models: private on-device reads, public cloud reads
src/gmail    reads the Gmail page in your browser (content script)
src/panel    the side panel
data         the public breach catalogue (npm run breaches to refresh)
test         unit tests
```

## License

Apache-2.0
