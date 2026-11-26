# Erased

**Your inbox already knows every company that holds your data. Erased reads it on your device, shows you who has
your data and who was breached after you joined, asks them to delete it under the law where you live, and then
proves whether they did, by watching what they send you next.**

Built with [Firebase AI Logic](https://firebase.google.com/docs/ai-logic) hybrid inference on four platforms: a
Chrome extension and a website (Gemini Nano), an Android app (Gemini Nano) and an iPhone app (Apple's on-device
model), with Gemini in the cloud only for public pages, or for one email when you allow it.

## What happened when we used it

On 20 Nov 2026 we sent 30 real deletion requests from a public demo inbox. Erased read every reply on the device:

- **27 of 30 companies replied**, the median one within a minute.
- **19 of them asked for one more step before deleting anything**: sign in and delete it yourself (9), use our
  form (4), click a check-it's-you link (3), prove the request comes from you (3), reply YES (2), say what to
  delete (1). Miss the step and the request quietly stalls. Reply Coach names the step, quotes the sentence that
  asks for it, and writes the answer, with the legal line where the law backs you.
- **3 companies kept sending marketing after the request**: Grammarly, Zapier and Codecademy. Erased caught each
  one and wrote the "stop now" email with the law that requires it (GDPR and UK GDPR Art 21(3), NDPA s.36).

Every company, reply and quote is on the [live run](https://forget-me-hybrid.web.app/run.html), with who made
deletion hard.

## Judges: 90 seconds, no install

1. Open **[forget-me-hybrid.web.app/judge.html](https://forget-me-hybrid.web.app/judge.html)** in desktop Chrome.
2. Press **Read all 10**. Ten real company replies are read in your own browser, by Gemini Nano if your Chrome has
   it, otherwise by Gemini in the cloud (a checkbox). Each shows what the model said and the sentence it pointed
   at, what the known phrases said, the decision, whether it matches our hand label, what Nano said on our Mac,
   and the reply Erased writes for you.
3. Paste any reply of your own at the bottom.

The full extension on your own Gmail, the Android APK and the iPhone app are under [Run it](#run-it).

## Why hybrid

| What | Where it runs | Why |
|---|---|---|
| Reading your emails (is this a real account? what did the company reply? what does it ask you to do? is this marketing?) | **On your device only** (`InferenceMode.ONLY_ON_DEVICE`) | The list of companies you use is private. It never leaves your computer or phone. |
| One reply on a phone with no on-device model | **Cloud, only if you switch it on** (`PREFER_ON_DEVICE`) | Your choice, for that one email. The answer card says where it was read. |
| Reading companies' public privacy pages to find how to ask for deletion | **Cloud** (`InferenceMode.ONLY_IN_CLOUD`, URL context) | The pages are public and long; the device can't fetch the web. Built once, shared with everyone. |
| Deadlines, request states, verdicts, every answer's wording | **Plain code** | The model only picks what was asked and points at the sentence. Rules decide. A model's quote counts only if it appears word for word in the email. |

## Four apps, one Coach

| | Model on the device | Cloud fallback | App Check |
|---|---|---|---|
| Chrome extension (`src/`) | Gemini Nano, `ONLY_ON_DEVICE` for mail | public pages only | reCAPTCHA Enterprise, via the website |
| Website `/judge` (`src/site/`) | Gemini Nano | Gemini, `PREFER_ON_DEVICE` (practice emails are public) | reCAPTCHA Enterprise |
| Android (`android/`) | Gemini Nano through ML Kit, `ONLY_ON_DEVICE` | Gemini, `PREFER_ON_DEVICE`, if you allow it | reCAPTCHA Enterprise, via the website |
| iPhone (`ios/`) | Apple Foundation Models (`SystemLanguageModel`) | Gemini through `HybridModel`, if you allow it | reCAPTCHA Enterprise, via the website |

The phrase rules, the on-device prompt, every answer and the sample replies are exported once from
`src/core/coach.ts` (`npm run android:coach`) and shipped to both phones; CI on each platform checks the phone
against all 66 hand labels. The extension and the phones are not installed from a store, so Play Integrity and App
Attest cannot vouch for them: each takes its App Check token from the website's reCAPTCHA Enterprise check
(`/appcheck.html`, opened in a hidden frame or web view). No code is loaded from the web; only the token comes back.

## What's in it

**Extension (side panel, three tabs).**
- **Trail.** A timeline of every company by the year you joined (red: breached after you joined) above the list.
  Pages through the account-type mail in Gmail (welcome, verify, password reset, sign-in alerts,
  receipts) in your own browser and builds your data trail live: every company, when you joined, when they last
  wrote, a running count and a safety score.
- **Breach flags.** Every company is matched against the public [Have I Been Pwned](https://haveibeenpwned.com/)
  catalogue (1,052 breaches, bundled, matched locally); breaches that happened **after you joined** are marked red,
  and companies silent for 3+ years are marked unused.
- **Clean up.** Breached and unused companies are pre-selected. Choose *Delete me* or *Stop marketing* (keeps the
  account). The request is a fixed legal letter under GDPR, UK GDPR, CCPA, Canada's PIPEDA or Nigeria's NDPA with the legal deadline; Gmail opens
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

**Site** (`site/`, Firebase Hosting): `/judge` (Reply Coach on ten real replies in your own Chrome), the live
run, the directory, the anonymous "who actually deletes" board and the evidence page.

**Firebase.** AI Logic (hybrid: on-device for mail, cloud for public pages), App Check (reCAPTCHA Enterprise on
the website; the extension and phones take their token from it; no remote code), Firestore (directory; board counts with rules that allow one count per anonymous
user, company and outcome), Remote Config (cloud model list, proof timings, directory location, prompt version),
anonymous Auth for board counts.

## Accuracy

`evals/replies.json` holds 66 real replies from 30 companies to deletion requests sent from the public demo inbox,
labelled by hand with the next step each one asks for (staff names removed). `eval.html` in the extension scores
them on the device; `scripts/ci/nano-eval.sh` runs the same check unattended in Chrome on a Linux machine with
Gemini Nano and records the screen.

| Check (Apple M1, Chrome 158, `ONLY_ON_DEVICE`, unless the row says otherwise) | Right next step |
|---|---|
| Held out: 29 replies that arrived after the phrase rules were written (21 Nov 2026) | Nano alone 20/29 · rules alone 17/29 · rules + Nano 21/29 |
| All 66, Nano alone | 52/66 (quote found in the email 65/66) |
| All 66, as shipped (rules updated after reading these, so in-sample) | 66/66 |
| Where it ran | 66/66 on the device, median 3.1 s per email |

| Android, Firebase Test Lab (no Gemini Nano on that phone, so `PREFER_ON_DEVICE` went to the cloud) | Gemini alone 58/66 · rules + Gemini 64/66 · 66/66 read in the cloud |

Known phrases decide first because they are exact; Nano decides when no known phrase matches, and only with a
sentence that is really in the email. Results: `evals/results-mac.json`.

## Android

`android/` is a phone app for the replies: share a company's answer to your deletion request from Gmail (or paste
it), and Erased reads it and shows the quickest lawful next step, with a ready reply when one is needed.

- **Same Coach as the extension.** `npm run android:coach` exports the phrase rules, the on-device prompt and every
  answer from `src/core/coach.ts` into `android/app/src/main/assets/coach.json`; CI fails if it is stale, and a
  JVM test checks the phone against all 66 hand labels in `evals/replies.json`.
- **Firebase AI Logic hybrid on Android** (`firebase-ai` + `firebase-ai-ondevice`): `ONLY_ON_DEVICE` with Gemini
  Nano through ML Kit by default; structured output through a KSP-generated schema (`@Generable`). The model answers
  with a sentence number, the app copies that sentence as the quote. On a phone without Gemini Nano you can switch
  on "let Gemini in the cloud read this one email" (`PREFER_ON_DEVICE`); otherwise only the known phrases are used.
  The result shows where it was read.
- **Try a real reply**: one tap loads a real company reply from the eval set.
- **App Check** with a reCAPTCHA Enterprise token from the website (`WebAppCheck.kt`): the APK is not installed
  from the Play Store, so Play Integrity cannot vouch for it.
- Built and tested by `.github/workflows/android.yml`; the APK is in the run's artifacts. An on-device check
  (`NanoOnDeviceTest`) runs in Firebase Test Lab: it reads every labelled reply and records where each was read.

## iPhone

`ios/` is the same reply reader for iPhone (SwiftUI, iOS 26).

- **Apple's on-device model through Firebase AI Logic.** Your reply is read by `FirebaseAI.SystemLanguageModel`
  only, unless you allow the cloud: then `HybridModel(primary: SystemLanguageModel, secondary: Gemini)` uses Apple's
  model first and Gemini only when this iPhone has no Apple Intelligence. Structured output with `@Generable`; the
  answer card shows which model read it (`rawResponse.modelVersion`). Firebase iOS SDK 12.19.3.
- Same `coach.json`, same answers, same one-tap real replies; `CoachParityTests` checks all 66 hand labels.
- **App Check** with a reCAPTCHA Enterprise token from the website (`WebAppCheck.swift`), tested on the simulator in
  CI (`AppCheckBridgeTests`).
- Built, tested and screenshotted by `.github/workflows/ios.yml`. Install: `brew install xcodegen && cd ios &&
  xcodegen`, open `Erased.xcodeproj` in Xcode 26, choose your Apple ID as the team and run it on your iPhone.

## Run it

Requirements: Chrome 139+ on desktop with the on-device model (Windows 10/11, macOS 13+, Linux or Chromebook
Plus; a GPU with more than 4 GB VRAM, or 16 GB RAM and 4 CPU cores; 22 GB free disk).

```bash
npm ci
npm run build        # bundles the extension into dist/
npm test             # rules, deadlines, templates, breach matching, quote checks
npm run verify       # re-checks this README's claims against the repo, offline, in a few seconds
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
