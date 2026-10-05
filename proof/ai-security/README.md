# AI and application security

Aman Agarwal · Reviewed September 30, 2026

Each control below links to the code, tests or assessment behind it. SignalBridge is fully public. Downfield, BetTail and Netted are private, so this folder publishes selected excerpts. No employer work is included.

| ID | Control | Where to check it |
| --- | --- | --- |
| D1 | Restricted LLM tool access and filtered child-process environments to exclude unrelated credentials and provider overrides. | [Tool settings, event guard, real environment functions and tests](downfield-bettail.md#d1-restrict-tools-and-inherited-credentials) |
| D2 | Validated structured outputs and source citations; added regression tests for malformed responses, forbidden tool calls, and credential exclusion. | [Schema/citation checks and rejection tests](downfield-bettail.md#d2-validate-outputs-and-source-citations) |
| D3 | Documented AI data-sharing boundaries and used a scoped publishing integration that avoids sharing application login or database credentials. | [Data boundary, serializer, fixed publisher and capability checks](downfield-bettail.md#d3-data-sharing-and-a-scoped-publisher) |
| S1 | Integrated Ruff security checks, pip-audit dependency checks, and OWASP ZAP passive-scan imports; tracked findings and retest evidence. | [Public implementation, test sources and historical scan/triage records](signalbridge.md#s1-scanner-integration-findings-and-retest-evidence) |
| S2 | Fixed an access-control race in a Django application; verified revoked-access enforcement with 13 regression tests in a disposable local database. | [Before/after record, 13 public tests and fresh results](signalbridge.md#s2-access-control-race-and-13-regression-tests) |
| N1 | Produced an application security assessment and 7-item risk register with priorities, proposed owners, remediation status, and acceptance criteria. | [Assessment excerpt and original seven-item register](netted.md#n1-assessment-and-seven-item-risk-register) |
| N2 | Implemented MFA, row-level security, and CSRF controls; tested cross-user access denial and blocked direct database writes. | [SQL/TypeScript controls and actual denial tests](netted.md#n2-mfa-row-level-security-csrf-and-ownership-enforcement) |

## Test runs

| Run | Result | Setup |
| --- | --- | --- |
| Downfield selected suites | 119 passed | Mocked AI/CLI responses, synthetic input |
| BetTail publishing suites | 32 passed | Mocked API and disposable database |
| Netted security suites | 36 passed | Synthetic authentication and disposable database |
| Netted focused isolation test | 1 passed; 31 filtered out | Cross-user and direct-write denial |
| SignalBridge authorization regressions | 13 passed | In-memory SQLite, synthetic users |
| SignalBridge scanner/evidence suites | 98 passed | Mocked external scanners; local console and parser checks |

[Machine-readable results, test names and commands](verification.json) · [Excerpt hashes and source locations](provenance.json)

The [environment test example](environment.test.mjs) runs on its own from this folder with `node --test environment.test.mjs`. The other excerpts are for reading, not standalone builds.
