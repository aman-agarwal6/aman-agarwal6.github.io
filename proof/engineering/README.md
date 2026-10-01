# Engineering evidence

Aman Agarwal · Last reviewed September 30, 2026

Selected implementation and recovery evidence for the portfolio's application-security, applied-AI and reliability work. The complete BetTail, Downfield and Netted applications remain private. These pages publish only bounded source excerpts, synthetic tests and a sanitized summary of a dated assessment.

| Project | Evidence to inspect |
| --- | --- |
| [BetTail](https://aman-agarwal6.github.io/projects/bettail.html) | [CSV formula neutralization and production cookie settings](bettail-export-security.md), with a standalone export helper and regression tests. |
| [Downfield](https://aman-agarwal6.github.io/projects/downfield.html) | [Earliest saved pregame forecasts, missing observations and revision comparisons](downfield-forecast-integrity.md). |
| [Netted](https://aman-agarwal6.github.io/projects/netted.html) | [September 13 journal recovery and the limits of that drill](netted-recovery.md). |

The existing [AI security proof pack](../ai-security/README.md) documents restricted tools, environment filtering, structured-output validation, scoped publishing, access-control tests and risk work. This folder adds focused evidence without replacing that record.

## Reproduce the public example

From this folder, with Node.js 24:

```sh
node --test --test-isolation=none csv-neutralization.test.mjs
```

[Implementation](csv-neutralization.mjs) · [Synthetic regression tests](csv-neutralization.test.mjs)

The example removes TypeScript annotations and adapts the original test imports to Node's built-in runner. It retains BetTail's export logic and uses no application credentials, user records, network access or dependencies. Test results are recorded on the BetTail evidence page. Downfield's focused private-source tests were also run locally; the recovery assessment was reviewed rather than rerun.

AI coding agents wrote substantial portions of these projects under my direction. I set requirements and directed review. This is builder-led evidence; it does not establish an independent audit, calibrated forecasting performance or a complete production recovery.
