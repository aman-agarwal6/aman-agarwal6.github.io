# Project index and evidence

Every project on [aman-agarwal6.github.io](https://aman-agarwal6.github.io/), with the fastest way to check each claim. For a one-page overview, see the [recruiter summary](https://aman-agarwal6.github.io/overview.html).

## Projects

| Project | What it does | Check it |
| --- | --- | --- |
| AccessOps | Leaver automation that proves access ended. A signed HR event ends a departing employee’s access across Keycloak, Microsoft Entra ID (through Microsoft Graph, in a free test tenant) and a Samba AD-compatible directory, and each system is read back before the case can close on independent review. Live runs found six gaps that disabling an account leaves open, from a surviving group membership to Kerberos tickets valid for 10 hours; each was fixed or is stated on the case. Access contained 2.6 s after the HR event; sign-ins after departure reach SignalBridge as signed events in 32 s. Operator MFA, OPA policy, a leaked-key drill. Signed v0.4.0 release (401 CI cases) | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [public source](https://github.com/aman-agarwal6/AccessOps), [verification ledger](https://github.com/aman-agarwal6/AccessOps/blob/main/docs/verification.md) |
| SignalBridge | Access-assurance and detection lab: signed application telemetry, five versioned detection rules (also written as Sigma) and an analyst console that takes a finding to an independently verified fix. Live runs against Keycloak, Wazuh, OWASP ZAP, Shuffle and PostgreSQL; verifies AccessOps’ signed leaver events; a frozen 48-scenario evaluation keeps its misses | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge), [evidence guide](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/EVIDENCE.md), [authorization and scanner evidence](../proof/ai-security/signalbridge.md) |
| BetTail | Live web app for private groups to share sports picks, follow them with individual tickets and review statistics calculated in the database. Security work covers row-level security, safe exports and a narrow publishing channel for AI reports | [Case study](https://aman-agarwal6.github.io/projects/bettail.html), [AI publishing](../proof/ai-security/downfield-bettail.md), [export security](../proof/engineering/bettail-export-security.md) |
| Netted | Personal-finance beta for realized profit, pooled funds and budgeting. Security and reliability work covers MFA enforced in the database, access-denial tests, a risk assessment and a journal recovery drill | [Case study](https://aman-agarwal6.github.io/projects/netted.html), [control evidence](../proof/ai-security/netted.md), [risk register](../proof/ai-security/netted-risk-register.md), [recovery evidence](../proof/engineering/netted-recovery.md) |
| Downfield | Local LLM research worker that writes structured NFL reports with versioned forecasts; restricted tools and environment, output validation, application-assigned provenance and deterministic evaluation | [Case study](https://aman-agarwal6.github.io/projects/downfield.html), [LLM controls](../proof/ai-security/downfield-bettail.md), [forecast evaluation](../proof/engineering/downfield-forecast-integrity.md) |
| Sailday | Installable cruise planner with hourly public-rate collection, booking comparisons, price history, opt-in Web Push alerts and offline group planning. Automatic collection covers one configured sailing | [Case study](https://aman-agarwal6.github.io/projects/sailday.html), [price-tracker evidence](../proof/sailday/price-tracker.md), [source evidence](../proof/sailday/README.md) |

## Review paths by role

- **Identity and access management:** AccessOps’ case study for the six gaps disabling left open, then the live demo and the verification ledger: Keycloak, Entra and Samba read-back, the before-and-after session table and the signed release.
- **Identity security across both projects:** AccessOps’ signed leaver events and SignalBridge’s receiver, which opens a case when a departed account is used.
- **SOC and threat intelligence:** HNI experience in the recruiter summary, then SignalBridge’s live lab results (Keycloak, Wazuh, ZAP, Shuffle), detection rules, case review and evaluation.
- **Security engineering:** SignalBridge’s write-race regression, BetTail’s database controls and export handling, then Netted’s access-denial tests and risk register.
- **AI security:** Downfield’s tool and environment restrictions, application-assigned provenance, deterministic checks and separate publishing capability.
- **Applied AI engineering:** Downfield’s structured workflow, retained versions, pregame evaluation selection and missing-outcome handling.

## How to read the evidence

Recorded results carry dates and scope. A local test, a simulated identity, a partial restore and a live deployment each prove different things, and the case studies say which is which. Open work stays listed.

Full AccessOps and SignalBridge source is public. The other projects stay private; selected excerpts name their original files, and standalone examples include synthetic tests that run without application accounts.

AI coding agents wrote substantial implementation under Aman’s direction; requirements, implementation direction and review are described explicitly on each case study.
