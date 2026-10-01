> Public historical copy of the September 11, 2026 action register. The original **Acceptance evidence** column states required closure criteria, not completed receipts. Roles are proposed, and the statuses below have not been represented as closed. [Context and current validation](netted.md).

# Netted security action register

11 September 2026 | Executive report v2.0 | Proposed responsibilities, not assigned staff

All seven items remain open or unverified in the assessment evidence. A missing proof is not a claim that a control is disabled. Day 1 starts when management assigns owners. No paid service or external engagement is authorized by this register.

| ID | Priority | Proposed owner | Concrete deliverable | Acceptance evidence | Proposed due | Status |
| --- | --- | --- | --- | --- | --- | --- |
| G1 | High release condition | Platform owner | Privileged access inventory, MFA evidence, role/token review and emergency recovery procedure | 3/3 platforms reviewed; 100% of inventoried privileged human accounts have MFA; 0 unexplained privileged identities; tested emergency recovery | Day 7 | Open - evidence needed |
| G2 | High release condition | Operations owner | Encrypted off-service backup and isolated complete restore log | 1 successful full restore; 100% record-count and cent-total reconciliation; 0 unauthorized cross-user reads/writes; prove proposed maximum 24-hour data loss and 8-hour recovery | Day 14 | Open - no full restore evidenced |
| G3 | High release condition | Executive sponsor | Eligible hosting/use decision and capacity/cost owner | 1 documented eligible operating arrangement with no unauthorized cost; preserve free-only constraint | Before commercial operation | Open - decision needed |
| G4 | High release condition | Independent reviewer | Independent security review and remediation/retest log | 1 review completed; 0 unresolved critical/high findings within agreed scope; 2 test accounts verify isolation in both directions | Day 30, before broad reliance | Open - no independent review evidenced |
| M1 | Medium operating condition | Product/privacy owner | Retention/deletion, complete export and identity-checked authenticator recovery procedures | Exercise 1 export, 1 deletion and 1 lost-authenticator request; reconcile in-scope data and backup expiry; no cross-user exposure | Before promising service timelines | Open - procedures/tests needed |
| M2 | Medium operating condition | Engineering/operations | Private remote, update notifications, sanitized incident alerts, named responder and patch process | 1 update notification and 1 simulated incident alert delivered; measure response; proposed acknowledgment within 1 hour during defined staffed hours | Before promising monitored operation | Open - detection not demonstrated |
| M3 | Medium operating condition | Platform owner | Current Google branding and public-login status record | 1 current console status plus 1 fresh Google/authenticator journey | Before public readiness claims | Unverified - historical status not rechecked |

## Completion record required for each item

- Accountable owner and assignment date.
- Evidence location and date of the test or review (never include secret values).
- Actual denominator, measured result and deviations from the acceptance criteria.
- Reviewer and completion date; unresolved residual risks and executive decision.
- Date of next review and the changes that trigger an earlier review.

## Recovery exercise acceptance details

The scope must cover financial records, allocations and reversals, required authentication/ownership mappings, schema and permissions, configuration recovery and secret recovery procedures. Restore in an isolated environment; do not overwrite production. Reconcile row counts and per-entity ledger totals exactly in cents. Test login, authenticator enforcement and cross-user denial after restoration. Verify the latest usable backup is within the proposed 24-hour window and measure end-to-end recovery time against the proposed 8-hour objective. Document export coverage and any omitted objects; a database dump is not automatically a complete service backup. No target is achieved until evidence demonstrates it.

## Incident and patch records

Record first observation, alert delivery, acknowledgment, access restriction, scope assessment, recovery, reconciliation and reopening times. Use sanitized evidence. Review dependencies weekly and triage a new critical/high advisory within one working day; record the affected version, exposure, owner, remediation due date and verification. These are proposed procedures, not installed automation or a 24/7 commitment.
