# Downfield: forecast and observation integrity

Last reviewed September 30, 2026 · [Case study](https://aman-agarwal6.github.io/projects/downfield.html) · [AI security proof](../ai-security/downfield-bettail.md)

## Keep the original pregame expectation

The reviewed local evaluator requires a retrospective entry, a final game and observed statistics. It filters saved reports for the same game, kickoff and teams, a scheduled pregame state, version 2, a save time before kickoff and an evidence time no later than the save. It then chooses the earliest saved eligible forecast, with ID as a deterministic tie-break:

```js
candidates.sort((a,b)=>Date.parse(a.createdAt)-Date.parse(b.createdAt)||a.id.localeCompare(b.id));
```

This prevents a later, more accurate revision from replacing the earlier expectation in this comparison. When no eligible report exists, the result is `no_pregame` with a null forecast. These modules and their tests were local development work at review time; this page does not establish deployment of that work.

## Missing statistics remain missing

Metrics map to explicit box-score fields. Player matching uses team and the observed player ID when present; it does not fall back to a matching name across a conflicting ID. An absent or ambiguous player row produces:

```js
if(rows.length!==1)return {actual:null,missingReason:'no_unique_player_row'};
```

Unsupported metrics use `metric_not_in_boxscore`; malformed or missing numeric fields use `missing_or_invalid_stat`. A strict schema requires a reason exactly when the actual value is null, and rejects extra fields. Missing observations become null rather than invented zeroes.

## Compare saved revisions separately

The revision helper requires the same game and report mode, version 2 or later, valid creation times and an earlier previous report. It reports changed point estimates, ranges and roles, plus added or removed players. Missing projections stay absent. Wording-only changes do not create a numerical change. Its exact removed-metric representation is:

```js
for (const metric of oldMetrics.values()) metrics.push({ metric: metric.metric, before: metric.point, after: null, beforeRange: [metric.low, metric.high], afterRange: null, reasoning: 'This metric no longer has a forecast in the selected report.' });
```

## Verification and provenance

**9 focused original tests passed** locally on Node.js 24.14.1:

```sh
node --test --test-isolation=none tests/forecast-evaluation.test.mjs tests/report-revisions.test.mjs
```

They cover earlier-versus-later selection, conflicting identities, missing/ambiguous/foreign statistics, post-kickoff or future-evidence rejection, strict schema rejection and revision comparisons. They use synthetic fixtures, with no model call or live statistics request.

Reviewed paths in the private Downfield repository: `shared/forecast-evaluation.mjs`, `shared/report-revisions.mjs`, `shared/selection-integrity.mjs`, `tests/forecast-evaluation.test.mjs`, `tests/report-revisions.test.mjs`.

These controls make comparisons inspectable. They do not establish calibrated probabilities, predictive accuracy, a forecasting advantage or reliable interpretation of every source.
