# Project index

Every project on [aman-agarwal6.github.io](https://aman-agarwal6.github.io/), with the fastest way to check each one. For a one-page overview, see the [recruiter summary](https://aman-agarwal6.github.io/overview.html).

## AccessOps

Automated employee offboarding that proves the person's access is really gone, across Microsoft Entra ID (test tenant), Keycloak and an Active Directory-compatible directory.

- **2.6 s** from the HR event to the person signed out and their tokens blocked
- **6 gaps** found by live testing, from a surviving group membership to Kerberos tickets valid for 10 hours, each fixed or documented
- **20 s** for Entra to confirm the change; **32 s** to catch a sign-in after someone has left

[Case study](https://aman-agarwal6.github.io/projects/accessops.html) · [Live demo](https://aman-agarwal6.github.io/AccessOps/) · [Source](https://github.com/aman-agarwal6/AccessOps) · [Verification ledger](https://github.com/aman-agarwal6/AccessOps/blob/main/docs/verification.md)

## SignalBridge

A detection lab that catches access that should have ended, tested against real Keycloak, Wazuh, OWASP ZAP and Shuffle.

- Found and fixed a race that let a removed user make **4 writes**
- **5 detection rules** written as Sigma, SPL and KQL and run in Splunk and a Kusto emulator
- Opens a critical case when an account offboarded by AccessOps is used again

[Case study](https://aman-agarwal6.github.io/projects/signalbridge.html) · [Source](https://github.com/aman-agarwal6/signalbridge) · [Evidence guide](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/EVIDENCE.md) · [Authorization fix and scanner triage](../proof/ai-security/signalbridge.md)

## BetTail

A live web app where private groups share sports picks and track results.

- Every request runs as the signed-in user under **row-level security**; no admin database key in the app
- My security review found and fixed **6 issues**, including a NULL that skipped a guard and a CSV export open to formula injection

[Case study](https://aman-agarwal6.github.io/projects/bettail.html) · [Export security](../proof/engineering/bettail-export-security.md) · [AI report publishing](../proof/ai-security/downfield-bettail.md)

## Netted

A personal-finance app for trade profit, shared funds and budgeting.

- **MFA enforced inside the database**, so the API can't skip it
- Security assessment for non-technical decision makers and a **7-item risk register** with owners and due dates
- All **506 journal records** restored from an encrypted backup, hash-matched

[Case study](https://aman-agarwal6.github.io/projects/netted.html) · [Controls and tests](../proof/ai-security/netted.md) · [Risk register](../proof/ai-security/netted-risk-register.md) · [Recovery drill](../proof/engineering/netted-recovery.md)

## Downfield

A local AI research agent that writes structured NFL reports for BetTail.

- **2 allowed tools** and no app secrets in its environment; web pages treated as untrusted
- Code checks every report's schema and arithmetic before it's published through a **report-only credential**

[Case study](https://aman-agarwal6.github.io/projects/downfield.html) · [Agent controls](../proof/ai-security/downfield-bettail.md) · [Forecast integrity](../proof/engineering/downfield-forecast-integrity.md)

## Also built

[Sailday](https://aman-agarwal6.github.io/projects/sailday.html), a trip planner with scheduled price checks, push alerts and offline sync ([code excerpts](../proof/sailday/README.md)).

## Where to start, by role

- **Identity and access management:** AccessOps' six gaps, then the live demo and the verification ledger.
- **Security operations:** HNI experience in the recruiter summary, then SignalBridge's detection rules, lab runs and the AccessOps leaver events it turns into cases.
- **Security engineering:** SignalBridge's write-race fix, BetTail's database controls, then Netted's risk register and recovery drill.
- **AI security:** Downfield's tool and environment limits and how its reports are checked and published.

## Reading the results

Every result has a date and says what it covers: a lab run with synthetic users, a live deployment or a partial restore. Open work stays listed on each case study.

AccessOps and SignalBridge are fully public. The other projects are private; excerpts here name their original files, and the standalone examples include tests that run without any accounts.
