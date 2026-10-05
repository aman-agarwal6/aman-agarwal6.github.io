# SignalBridge: scanners and revoked-access regression

[All claims](README.md) · [September selected verification](verification.json)

The full implementation and tests are public. Historical September links below are pinned to commit `60158010c3c6a3bff2f82017d632534c85c7ba57` so the evidence remains reviewable if the default branch changes.

## October enterprise milestone update

The milestone remains in progress. New evidence does not retroactively expand the September receipts below.

- [Public GitHub CI](https://github.com/aman-agarwal6/signalbridge/actions/runs/36956650682): both core and native PostgreSQL jobs passed at `c958c59`. The [publication receipt](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/evidence/20261001-github-ci-publication.json) preserves two preceding failures and their corrections. Repeating the same native methods is not additional distinct coverage.

- [Native PostgreSQL receipt](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/evidence/20261001-postgresql-in-network-1d8fd148036e43b0915fbbe86606d013.json): nine methods passed against PostgreSQL 17.11, including concurrent signed ingestion, two workers, stale case edits, duplicate/conflicting review tasks and recovery after an actual child-process kill. Both shutdown checks passed. This is isolated component testing, not enterprise TLS, high availability or production capacity.
- [Frozen 48-scenario evaluation](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/evidence/20261001-enterprise-detection-evaluation-format2.json): TP15, FP6, FN8, TN12 across 41 scored scenarios, plus seven inconclusives. Precision 15/21, recall 15/23 and false-positive rate 6/18. The rule-aware builder selected the scenarios; difficult cases were retained. R3–R5 add resource-scoped revocation, bounded slower probing and same-resource multi-account coverage.
- [Current local verification](https://github.com/aman-agarwal6/signalbridge/blob/main/docs/evidence/20261001-enterprise-offline-6f968bfab93a4ffd8738b9d515a68767.json): 1,177 Python and 62 distinct Node methods passed. Native PostgreSQL methods are separate; regression counts are not detection accuracy.
- [Case workflow](https://github.com/aman-agarwal6/signalbridge/blob/main/bridge/case_workflow.py) and [machine interfaces](https://github.com/aman-agarwal6/signalbridge/blob/main/bridge/service_api.py): app-scoped assignment, acknowledgement, deadlines, typed notes and version-bound idempotent review tasks. A resolved case or review task is not a verified fix.
- [Consolidated handoff](https://aman-agarwal6.github.io/signalbridge/output/pdf/SignalBridge_Enterprise_Handoff.pdf): architecture, retained results and failures, interview explanations and unfinished mandatory gates. Keycloak, operational dashboards, expanded native integrations, working restore and the 24-hour run are unfinished.

AI coding agents implemented substantial portions under my direction. These are builder-operated checks, not independent certification.

## S1: Scanner integration, findings and retest evidence

The claim says **integrated** the scanners and imports. Source and tests demonstrate those integrations. This wording does not imply a fresh live dependency audit or a production penetration test.

| Evidence | What it supports |
| --- | --- |
| [Ruff security-rule runner](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/bridge/management/commands/scan_local.py) and [runner tests](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/tests/test_local_scanner_command.py) | Fixed local source/rule scope, bounded execution and failed-run handling |
| [pip-audit dependency runner](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/bridge/management/commands/scan_dependencies.py) and [runner tests](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/tests/test_dependency_runner.py) | Pinned dependency input, explicit network opt-in, parser and execution handling |
| [Scanner report parser](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/bridge/scanner_reports.py) and [parser tests](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/tests/test_scanner_reports.py) | Structured Ruff, pip-audit and ZAP report ingestion |
| [Finding history](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/bridge/findings.py) and [evidence/triage tests](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/tests/test_scanner_audit.py) | Findings, observation history, review state and evidence binding |
| [Historical scanner triage record](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/docs/evidence/20260924-scanner-triage-final.json) | Dated findings and rationale, including unresolved issues |
| [Historical ZAP synthetic pilot](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/docs/evidence/20260924-zap-synthetic-pilot.json) | Passive scan observations against an isolated synthetic target |
| [Historical unavailable-target result](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/docs/evidence/20260925-zap-repeat-failure.json) | Failed/incomplete scans remain distinguishable from clean scans |

Fresh result: **98/98** selected scanner, dependency-runner, console and evidence tests passed. External scanner processes are mocked in runner tests. Ruff, pip-audit advisory fetching, and ZAP containers were **not** rerun for this evidence check. Historical receipts above retain their own dates and limitations; a passive synthetic scan does not establish production application coverage.

## S2: Access-control race and 13 regression tests

- [Original before/after receipt](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/docs/evidence/20260925-authorization-refresh.json): describes stale authorization, four reproduced denial failures, the correction, and all 13 added regression cases.
- [All 13 regression tests](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/tests/test_authorization_refresh.py): revoked membership, disabled account, cross-workspace moves, transaction guard, and authorized positive controls.
- [Authorization and write services](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/bridge/services.py) and [design explanation](https://github.com/aman-agarwal6/signalbridge/blob/60158010c3c6a3bff2f82017d632534c85c7ba57/docs/DESIGN.md#console-access-control): current permissions are checked inside the write transaction.

Fresh result: **13/13** tests passed using disposable in-memory SQLite and synthetic identities. Tests deterministically inject state changes at the relevant boundary; they are not a measured timing exploit or proof of PostgreSQL concurrency behavior. The original receipt records earlier failed runs as well as passing verification.

## Reproduction

Use the pinned public checkout and its documented dependency setup. The exact commands used in this review are recorded in [verification.json](verification.json). Authorization tests use the standalone simulation settings and an ephemeral test secret. Scanner/console tests use the ordinary application settings in a **fresh isolated checkout**, a clean environment and an in-memory test database. A first scanner run under simulation settings lacked templates and the login route; that harness error and corrected rerun are retained in the receipt.

These are builder-operated checks on an AI-assisted project, not an independent security audit.
