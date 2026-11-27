# Held-out check 2: results

Scored on 27 Nov 2026 on an Apple M1 (Chrome 158), after the labels were committed (`7c180be`, `7a57408`).
Rules and prompt unchanged since the freeze (`coach.ts` `c3654b20c23f1f68`, `models.ts` `4207aef3b09e05ef`).

| Reply | Hand label | Gemini Nano alone | Gemini cloud alone | Rules alone | As shipped |
|---|---|---|---|---|---|
| monday.com, 26 Nov 22:55 | sign in and delete it | ✓ sign in and delete it | wait | confirm it's you | confirm it's you |
| Zapier, 27 Nov 00:06 | sign in and delete it | ✓ | ✓ | ✓ | ✓ |
| Vimeo, 27 Nov 13:02 | wait | ✓ | ✓ | ✓ | ✓ |
| **Right** | | **3/3** (3/3 on the device, median 4.1 s) | 2/3 | 2/3 | 2/3 |

Raw runs: `results-nano.json` (`ONLY_ON_DEVICE`), `results-cloud.json` (`ONLY_IN_CLOUD`, `gemini-3.5-flash-lite`, same
prompt and schema). Run with the extension's `eval.html?set=heldout2` and `eval.html?set=heldout2&mode=cloud`.
