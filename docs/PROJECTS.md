# Project index

Every project on [aman-agarwal6.github.io](https://aman-agarwal6.github.io/), with the fastest way to check each one. For a one-page overview, see the [recruiter summary](https://aman-agarwal6.github.io/overview.html).

## Projects

| Project | What it does | Check it |
| --- | --- | --- |
| AccessOps | Automated employee offboarding that proves the person's access is really gone. An HR event shuts off access in Microsoft Entra ID (test tenant), Keycloak and an Active Directory-compatible directory, and each system is checked to confirm the change. Signed out and tokens blocked 2.6 s after the HR event; 6 gaps found by live testing, each fixed or documented; a sign-in after departure caught in 32 s. | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [source](https://github.com/aman-agarwal6/AccessOps), [verification ledger](https://github.com/aman-agarwal6/AccessOps/blob/main/docs/verification.md) |
| SignalBridge | A detection lab that catches access that should have ended. Five detection rules, also written as Sigma, SPL and KQL, run against signed app events and real Keycloak, Wazuh, OWASP ZAP and Shuffle. It receives AccessOps' leaver events and opens a critical case when a departed account is used. | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [source](https://github.com/aman-agarwal6/signalbridge), [evidence guide](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/EVIDENCE.md), [authorization fix and scanner triage](../proof/ai-security/signalbridge.md) |
| BetTail | A live web app for private sports-pick groups. Every request runs as the signed-in user under row-level security, and the app has no admin database key. My security review found and fixed 6 issues. | [Case study](https://aman-agarwal6.github.io/projects/bettail.html), [export security](../proof/engineering/bettail-export-security.md), [AI report publishing](../proof/ai-security/downfield-bettail.md) |
| Netted | A personal-finance app with MFA enforced in the database, a security assessment for non-technical readers, a 7-item risk register and a recovery drill. | [Case study](https://aman-agarwal6.github.io/projects/netted.html), [controls and tests](../proof/ai-security/netted.md), [risk register](../proof/ai-security/netted-risk-register.md), [recovery drill](../proof/engineering/netted-recovery.md) |
| Downfield | A local AI research agent with two allowed tools, no app secrets in its environment, untrusted-web handling and code checks on every report. | [Case study](https://aman-agarwal6.github.io/projects/downfield.html), [agent controls](../proof/ai-security/downfield-bettail.md), [forecast integrity](../proof/engineering/downfield-forecast-integrity.md) |

Also built: [Sailday](https://aman-agarwal6.github.io/projects/sailday.html), a trip planner with scheduled price checks, push alerts and offline sync ([code excerpts](../proof/sailday/README.md)).

## Where to start, by role

- **Identity and access management:** AccessOps' six gaps, then the live demo and the verification ledger.
- **Security operations:** HNI experience in the recruiter summary, then SignalBridge's detection rules, lab runs and the AccessOps leaver events it turns into cases.
- **Security engineering:** SignalBridge's write-race fix, BetTail's database controls, then Netted's risk register and recovery drill.
- **AI security:** Downfield's tool and environment limits and how its reports are checked and published.

## Reading the results

Every result has a date and says what it covers: a lab run with synthetic users, a live deployment or a partial restore. Open work stays listed on each case study.

AccessOps and SignalBridge are fully public. The other projects are private; excerpts here name their original files, and the standalone examples include tests that run without any accounts.
