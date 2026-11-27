# Held-out check 2: written before the replies it scores

**Frozen at 2026-11-26T22:38:26Z.** From this moment the phrase rules and the on-device prompt are not changed until this check
is scored.

| File | SHA-256 (first 16) |
|---|---|
| `src/core/coach.ts` (phrase rules, answers) | `c3654b20c23f1f68` |
| `src/ai/models.ts` (on-device prompt and schema) | `4207aef3b09e05ef` |

## What is scored

Every company reply that reaches the public demo inbox (erased.demo.inbox@gmail.com) **after the freeze and before
30 Nov 2026 18:00 UTC**, about the 30 deletion requests on [the live run](https://forget-me-hybrid.web.app/run.html).
Automatic copies of our own messages and marketing are not replies and are left out.

## How

1. Each reply is labelled by hand with the one step it asks for (the same ten labels as `evals/replies.json`),
   before any model reads it. Labels are committed first.
2. Then four readers run on the same replies:
   - **Rules alone** (the frozen phrase rules)
   - **Gemini Nano alone**, on the device (`ONLY_ON_DEVICE`, Chrome on an Apple M1)
   - **Gemini in the cloud alone** (`gemini-3.5-flash-lite`, same prompt and schema)
   - **As shipped**: rules first, Nano when no phrase matches, only with a sentence found in the email
3. Results are published here and on the [evidence page](https://forget-me-hybrid.web.app/evidence.html), whatever
   they are.

## Collection closed early (added 2026-11-27, before any model read these replies)

The test machine (the Apple M1 that runs Gemini Nano) was released on 27 Nov 2026, so collection closed at
**2026-11-27 14:30 UTC** instead of 30 Nov 18:00 UTC. Every company message about the 30 requests that arrived
after the freeze and before that time is in `replies.json` (3 replies: monday.com, Zapier, Vimeo; one marketing
email from Skillshare left out as the plan says). They were labelled by hand and committed before any reader ran.
Rules and prompt are unchanged since the freeze: `coach.ts` `c3654b20c23f1f68`, `models.ts` `4207aef3b09e05ef`.
