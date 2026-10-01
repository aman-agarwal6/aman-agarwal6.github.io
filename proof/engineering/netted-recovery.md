# Netted: a reconciled journal recovery

Last reviewed September 30, 2026 · Assessment dated September 13, 2026 · [Case study](https://aman-agarwal6.github.io/projects/netted.html#recovery) · [Security assessment and risk proof](../ai-security/netted.md)

## Recorded result

The September 13 assessment records a consistent, read-only financial snapshot, encrypted before storage, then decrypted in memory into an isolated local PostgreSQL-compatible database. The drill did not restore over production records.

| Check in the dated assessment | Recorded outcome |
| --- | --- |
| Original journal | 506 of 506 records restored; complete journal hash matched. |
| Correction history | 8 of 8 correction rows included. |
| Active records | 280 of 280 matched exactly as JSON. |
| Function bodies | 24 of 24 matched the tested schema. |
| Access controls | Owner separation checked; 3 of 3 anonymous or missing-MFA denial checks passed in the isolated copy. |

Counts and hash reconciliation support a specific recovery claim: the tested copy reconstructed the journal, its corrections and the compared active records. No financial rows, amounts, owner identities or key material are included in this public summary.

## What remains outside that result

- The copy was a one-time snapshot. Changes after its timestamp are absent; recurring independent backups were not running in the dated assessment.
- Decryption depended on the originating Windows account. Portable key recovery and a second-location restore were not established.
- The drill did not reconstruct OAuth configuration, hosting configuration, MFA secrets, sessions or provider-managed authentication. Reconnecting records to real users requires verified identity recovery.
- The local database reconstruction was not a full hosted-service disaster-recovery exercise, continuous uptime measurement, load test or production recovery-time commitment.

The assessment therefore leaves full hosted/authentication recovery, independent backups and measured recovery targets open. It does not establish zero data loss or 99.99% application availability.

## Provenance and review boundary

Source: `docs/reliability-review-2026-09-13.md` in the private Netted repository. This is a sanitized summary of the historical report, not a newly executed restore. The assessment was reviewed on September 30; no recovery files, private financial data, operator scripts, keys or production services were opened or run for this page.

The [existing risk register](../ai-security/netted-risk-register.md) retains the distinction between proposed acceptance criteria and completed evidence.
