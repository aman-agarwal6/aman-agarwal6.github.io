# Project documentation and evidence

Aman Agarwal’s portfolio includes a security workbench, an identity offboarding system, AI-assisted web applications and applied-AI research. The product purpose and additional security work are described separately. Start with the [portfolio](https://aman-agarwal6.github.io/) or [recruiter summary](https://aman-agarwal6.github.io/overview.html), then inspect a particular project below.

## Selected projects

| Project | Product purpose and supporting work | Documentation and evidence |
| --- | --- | --- |
| SignalBridge | Access-assurance and detection lab: signed telemetry, five versioned rules and an analyst console, with live runs against Keycloak, Wazuh, OWASP ZAP, Shuffle and PostgreSQL, signed leaver events from AccessOps and a frozen 48-scenario evaluation | [Case study](https://aman-agarwal6.github.io/projects/signalbridge.html), [public source](https://github.com/aman-agarwal6/signalbridge), [evidence guide](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/EVIDENCE.md), [authorization and scanner proof](../proof/ai-security/signalbridge.md) |
| AccessOps | Employee and contractor offboarding: departure cases with owners, deadlines and per-system evidence, verified in a local lab against real Keycloak and a Samba directory, with signed HR intake, session revocation, post-departure sign-in checks sent to SignalBridge as signed events, and a signed release | [Case study](https://aman-agarwal6.github.io/projects/accessops.html), [live demo](https://aman-agarwal6.github.io/AccessOps/), [public source](https://github.com/aman-agarwal6/AccessOps), [verification ledger](https://github.com/aman-agarwal6/AccessOps/blob/main/docs/verification.md) |
| BetTail | AI-assisted full-stack app for private groups to share picks, track tickets and review statistics. Additional security work covers authorization, safe exports and limited AI publishing. | [Case study](https://aman-agarwal6.github.io/projects/bettail.html), [AI publishing](../proof/ai-security/downfield-bettail.md), [engineering evidence](../proof/engineering/bettail-export-security.md) |
| Netted | Personal-finance app for realized profit, pooled funds and budgeting. Additional security and reliability work covers MFA, access-denial tests, a risk assessment and journal recovery. | [Case study](https://aman-agarwal6.github.io/projects/netted.html), [control evidence](../proof/ai-security/netted.md), [risk register](../proof/ai-security/netted-risk-register.md), [recovery evidence](../proof/engineering/netted-recovery.md) |
| Downfield | NFL research app with structured AI reports and versioned forecasts; supporting controls cover restricted tools, validation, provenance and deterministic evaluation. | [Case study](https://aman-agarwal6.github.io/projects/downfield.html), [LLM controls](../proof/ai-security/downfield-bettail.md), [forecast evaluation](../proof/engineering/downfield-forecast-integrity.md) |

## Supporting engineering work

[Sailday](https://aman-agarwal6.github.io/projects/sailday.html) combines public-rate price tracking, booking comparisons, historical graphs and optional price-change notifications with offline cruise planning and shared group edits. Its [price-tracker evidence](../proof/sailday/price-tracker.md) explains Royal Caribbean public sources, scheduled PostgreSQL collectors, comparison rules, React/SVG graphs and encrypted Web Push. Automatic collection currently covers one configured sailing. Additional engineering work includes durable writes, field conflicts, permissions and safe updates. Its [selected source evidence](../proof/sailday/README.md) adds data-lifecycle and synchronization context relevant to application security. It is supporting work rather than a primary AI or SOC project.

## Suggested review paths

- **SOC and threat intelligence:** HNI experience in the recruiter summary, then SignalBridge’s live lab results (Keycloak, Wazuh, ZAP, Shuffle), rules, case review and evaluation.
- **Identity security across both projects:** AccessOps’ signed leaver events and SignalBridge’s receiver, which opens a case when a departed account is used.
- **Identity and access management:** AccessOps’ live demo, then its verification ledger: Keycloak and Samba directory read-back, the group membership that survived account disable, the before-and-after session table, and the signed release.
- **Security engineering:** SignalBridge’s write-race regression, BetTail’s database controls and export handling, then Netted’s access-denial tests and risk register.
- **AI security:** Downfield’s tool and environment restrictions, application-assigned provenance, deterministic checks and separate publishing capability.
- **Applied AI engineering:** Downfield’s structured workflow, retained versions, pregame evaluation selection and missing-outcome handling.

## How to read the evidence

Full SignalBridge and AccessOps source is public. Other project source remains private; selected excerpts identify their original files and implementation context. Standalone examples identify adaptation and include synthetic tests that run without application accounts.

Recorded results carry dates and scope. Local tests, simulated identities, a partial journal restore and a published landing page each establish different things. Case studies retain relevant open work. AI coding agents wrote substantial implementation under Aman’s direction; requirements, implementation direction and review are described explicitly.

This portfolio repository holds case studies and evidence together. Additional repositories are appropriate for independently usable software, rather than duplicate documentation.
