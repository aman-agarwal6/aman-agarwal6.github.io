# Downfield and BetTail: LLM application security

[Index](README.md) · [Verification results](verification.json) · [Source provenance](provenance.json)

Reviewed September 30, 2026. The full applications are private; these are selected source and test excerpts. The public environment example is independently runnable; the other tests were run against the original local projects.

## D1: Restrict tools and inherited credentials

The bridge supplies a fixed tool list and builds each child environment from an allowlist. The CLI still signs in through its own credential store. An event guard also stops the run if an unexpected tool appears.

The two complete environment functions and their original tests are published in [environment.mjs](environment.mjs) and [environment.test.mjs](environment.test.mjs). With Node 24+, run from this folder:

```text
node --test environment.test.mjs
```

No packages, sign-in, network calls, or real credentials are needed. Only imports and the module layout were adapted; the function and test bodies are unchanged.

### Claude tool allowlist flags

Source: `downfield/server/analyst.mjs`, lines 255–259. Exact excerpt; surrounding dependencies are omitted.

```javascript
export function claudeArgs({ tools }) {
  return ['-p', '--output-format', 'stream-json', '--verbose', '--model', ANALYST_MODEL, '--effort', 'high',
    '--no-session-persistence', '--safe-mode', '--strict-mcp-config', '--disable-slash-commands',
    '--permission-mode', 'dontAsk', '--tools', tools.join(','), ...(tools.length ? ['--allowed-tools', tools.join(',')] : [])];
}
```

### Unexpected exposed tools and credentials stop the session

Source: `downfield/server/analyst.mjs`, lines 272–285. Exact excerpt; surrounding dependencies are omitted.

```javascript
function createClaudeEventReader({ allowedTools, now }) {
  const pending = new Map();
  const state = { finalText: '', completed: false, failureText: '', successfulWebSearches: 0, openedUrls: new Map(), started: false };
  function read(event) {
    const out = { toolStarted: null, toolFinished: null };
    if (event?.type === 'system' && event.subtype === 'init') {
      // Fail closed if the session exposes any tool beyond the fixed set, is
      // not the fixed model, or authenticates with an API key.
      const tools = Array.isArray(event.tools) ? event.tools : [];
      if (tools.some(name => !allowedTools.includes(name))) throw new AnalystError('unexpected_tool', 'Research stopped because the analysis session exposed an unexpected tool. No report was saved.');
      if (typeof event.model === 'string' && !event.model.startsWith(ANALYST_MODEL)) throw new AnalystError('research_failed', 'The analysis session did not start with the required model. No report was saved.');
      if (event.apiKeySource && event.apiKeySource !== 'none') throw new AnalystError('subscription_required', 'Downfield only runs research on a Claude subscription sign-in; API-key access is disabled.');
      state.started = true;
    }
```

### Forbidden-tool regression

Source: `downfield/tests/analyst.test.mjs`, lines 376–387. Exact excerpt; surrounding dependencies are omitted.

```javascript
test('a forbidden command, file, MCP or exposed tool stops the run', async t => {
  for (const name of ['Bash', 'PowerShell', 'Write', 'Edit', 'Read', 'mcp__server__tool', 'Task']) {
    const bridge = await fakeBridge(t, { eventError: { type: 'assistant', message: { content: [{ type: 'tool_use', id: 'x', name, input: {} }] } } });
    await assert.rejects(bridge.generateReport({ game }), { code: 'unexpected_tool' });
  }
  const exposed = await fakeBridge(t, { eventError: { ...init, tools: ['WebSearch', 'WebFetch', 'Bash'] } });
  await assert.rejects(exposed.generateReport({ game }), { code: 'unexpected_tool' });
  const apiKey = await fakeBridge(t, { eventError: { ...init, apiKeySource: 'ANTHROPIC_API_KEY' } });
  await assert.rejects(apiKey.generateReport({ game }), { code: 'subscription_required' });
  const otherModel = await fakeBridge(t, { eventError: { ...init, model: 'claude-haiku-4-5' } });
  await assert.rejects(otherModel.generateReport({ game }), { code: 'research_failed' });
});
```

## D2: Validate outputs and source citations

The application parses a structured schema, rejects unknown citation IDs, and distinguishes supplied snapshots, observed page opens, and unverified model links. These checks establish structure and recorded provenance; they do not prove every statement in a model answer is true.

### Schema and citation identity checks

Source: `downfield/shared/contracts.mjs`, lines 94–110. Exact excerpt; surrounding dependencies are omitted.

```javascript
export function validateReport(value, quotes=[]) {
  const report=reportSchema.parse(value);
  validateTeamVolume(report);
  const sourceIds=new Set(report.sources.map(s=>s.id));
  if(sourceIds.size!==report.sources.length) throw Error('Duplicate report source IDs');
  for(const review of report.postgameLearning?.reviews||[])for(const observation of review.observations){
    if(observation.sourceIds.some(id=>!report.sources.some(source=>source.id===id&&source.verification!=='model_reported')))throw Error('Postgame observations require captured source receipts');
  }
  if(report.finalReview){
    const ids=[...report.finalReview.teams.map(team=>team.sourceId),report.finalReview.conditions.sourceId].filter(Boolean);
    if(ids.some(id=>!sourceIds.has(id)))throw Error('Unknown final-review citation');
  }
  const ids=new Set(quotes.map(q=>q.id));
  const evaluationIds=new Set();
  for(const item of [...report.facts,...report.edges,...report.players,...report.excludedPlayers,...report.gameBreakdown,...report.parlays,...report.evaluations,...report.targetBets,...(report.gamePrediction?[report.gamePrediction]:[]),...(report.bettingOutlook?[report.bettingOutlook]:[])]) {
    if(item.sourceIds.some(id=>!sourceIds.has(id))) throw Error('Unknown report citation');
  }
```

### Application-assigned source provenance

Source: `downfield/server/analyst.mjs`, lines 993–1006. Exact excerpt; surrounding dependencies are omitted.

```javascript
export function reconcileSourceProvenance(value, { contextSources = [], openedUrls = new Map(), completedAt = new Date().toISOString() } = {}) {
  const provided = new Map(contextSources.filter(source => sourceKey(source.url)).map(source => [sourceKey(source.url), source]));
  if (Array.isArray(value.sources)) value.sources = value.sources.map(source => {
    const key = sourceKey(source.url);
    const supplied = provided.get(key);
    // Publication metadata for an actual supplied snapshot belongs to the
    // source, even when the model cites it under a different local ID.
    if(supplied)source={...source,title:supplied.title,url:supplied.url,publishedAt:supplied.publishedAt??null};
    if (openedUrls.has(key)) return { ...source, accessedAt: openedUrls.get(key) || completedAt, verification: 'observed_web' };
    if (supplied && Number.isFinite(Date.parse(supplied.accessedAt))) return { ...source, accessedAt: supplied.accessedAt, verification: 'provided_snapshot' };
    return { ...source, accessedAt: null, verification: 'model_reported' };
  });
  return value;
}
```

### Unknown citations are rejected

Source: `downfield/tests/analyst.test.mjs`, lines 309–314. Exact excerpt; surrounding dependencies are omitted.

```javascript
test('rejects broken citations and missing saved-quote evaluations', async t => {
  for (const value of [report({ facts: [{ claim: 'Unknown', sourceIds: ['unlisted'] }] }), report()]) {
    const bridge = await fakeBridge(t, { value });
    await assert.rejects(bridge.generateReport({ game, quotes: [quote] }), { code: 'invalid_report' });
  }
});
```

### Malformed output is rejected

Source: `downfield/tests/analyst.test.mjs`, lines 396–399. Exact excerpt; surrounding dependencies are omitted.

```javascript
test('malformed model output is never returned as a report', async t => {
  const bridge = await fakeBridge(t, { value: 'not valid JSON private-test-value' });
  await assert.rejects(bridge.generateReport({ game }), error => error.code === 'invalid_report' && !error.message.includes('private-test-value'));
});
```

## D3: Data sharing and a scoped publisher

The AI input is the selected game context, research question and selected quote data. Research input reaches the chosen model provider through its signed-in CLI. Application login credentials and database credentials are not part of that prompt. The environment allowlists above reduce inherited credential exposure; they do not remove the provider CLI's own authentication needs.

Publication is a separate boundary. An explicit serializer selects report fields and refuses reports containing private price evaluations. The publisher sends to a fixed HTTPS endpoint, refuses redirects, and omits cookies. It uses a dedicated publishing capability, which is itself a secret; it does not use the user's BetTail login or a database service credential. The receiving database verifies the capability hash, expiry, and enrolled owner. Token values and connection files are excluded from this public pack.

### Selected model input

Source: `downfield/server/analyst.mjs`, lines 1412–1428. Exact excerpt; surrounding dependencies are omitted.

```javascript
  async function generateReport({ game, context = {}, quotes = [], question = '', onProgress = () => {}, signal } = {}) {
    const progress = text => { try { onProgress(text); } catch {} };
    if (signal?.aborted) throw new AnalystError('cancelled', 'Research was cancelled.');
    let parsedQuotes, prompt;
    const asOf = now().toISOString();
    try {
      // Storage metadata is not sports evidence and must not reach the model.
      parsedQuotes = z.array(quoteSchema).max(30).parse(Array.isArray(quotes) ? quotes.map(({ createdAt, origin, ...quote }) => quote) : quotes);
      if (!game || typeof game !== 'object' || Array.isArray(game) || !/^\d{1,12}$/.test(game.id)) throw new Error('Missing game');
      if (parsedQuotes.some(q => !q.id || q.gameId !== String(game.id) || q.book !== 'DraftKings') || new Set(parsedQuotes.map(q => q.id)).size !== parsedQuotes.length) throw new Error('Invalid quotes');
      if (typeof question !== 'string' || question.length > 3000) throw new Error('Invalid question');
      const compactContext = compactResearchContext(context);
      prompt = researchPrompt({ game, context: compactContext, quotes: parsedQuotes, question, asOf });
      if (Buffer.byteLength(prompt) > MAX_RESEARCH_INPUT_BYTES) throw new AnalystError('input_limit','This game’s evidence exceeds the current research size limit. No players or sources were silently removed, and no analysis was started.');
    } catch (error) { if(error instanceof AnalystError)throw error;throw new AnalystError('invalid_request', 'Select a game and valid saved DraftKings prices before requesting research.'); }
    progress('Checking subscription access');
    const status = await analystStatus();
```

### Explicit publication boundary

Source: `downfield/shared/bettail-report.mjs`, lines 17–35. Exact excerpt; surrounding dependencies are omitted.

```javascript
export function footballPublication(entry,{reports}={}){
  if(entry.analysisVersion!==2||entry.quoteSnapshots?.length||entry.report?.evaluations?.length)throw Error('Only football reports without private price evaluations can be shared.');
  if(entry.finalReviewPolicy!==undefined&&entry.finalReviewPolicy!==FINAL_REVIEW_POLICY)throw Error('Unknown final-review policy.');
  // Re-authenticate the final receipt against retained raw evidence at this
  // boundary; an envelope's saved status cannot authorize an actionable pick.
  const authenticated=applyFinalReviewHold(entry),r=authenticated.report,g=entry.game;
  if(!g.home||!g.away)throw Error('Report game identity is incomplete.');
  validateTeamVolume(r,{teams:[g.home.abbreviation,g.away.abbreviation]});
  if(r.targetBets.some(b=>spreadSignConflict(b,b.reason)))throw Error('Spread selection conflicts with its explanation.');
  if(r.parlays.some(p=>p.legs.some(leg=>spreadSignConflict(leg,p.reason))))throw Error('Parlay spread conflicts with its explanation.');
  return {
    version:1,id:entry.id,asOf:entry.asOf,mode:entry.mode,
    ...(entry.finalReviewPolicy===FINAL_REVIEW_POLICY?{finalReviewPolicy:FINAL_REVIEW_POLICY,finalCheck:authenticated.finalCheck}:{}),
    game:{id:g.id,kickoff:g.kickoff,status:g.status,home:g.home.name,away:g.away.name,homeAbbr:canonicalTeam(g.home.abbreviation),awayAbbr:canonicalTeam(g.away.abbreviation),homeScore:g.home.score??null,awayScore:g.away.score??null,week:g.week??null},
    headline:r.headline,keyPoints:r.keyPoints,
    outlook:r.bettingOutlook?{...pick(r.bettingOutlook,['verdict','summary','sourceIds']),factors:r.bettingOutlook.factors.map(f=>pick(f,['label','detail']))}:null,
    prediction:r.gamePrediction?{...pick(r.gamePrediction,['homePoints','awayPoints','totalLow','totalHigh','reasoning','adverseCase','sourceIds']),...(r.gamePrediction.teamVolume!==undefined?{teamVolume:r.gamePrediction.teamVolume}:{})}:null,
    bets:r.targetBets.map(b=>({selection:selection(b),...pick(b,['reason','adverseCase','invalidation','sourceIds']),...selectionConfidence(b),...(b.tier!==undefined?{tier:b.tier}:{}),...(b.reachConditions!==undefined?{reachConditions:[...b.reachConditions]}:{}),...(b.stake?{stake:stakeGuidanceSchema.parse(b.stake)}:{})})),
    players:r.players.map(p=>({...pick(p,['name','playerId','team','position','roleStatus','roleNote','outlook','opportunity','matchup','sourceIds']),projections:p.projections.map(v=>pick(v,['metric','baseline','point','low','high','sampleGames','adjustment','reasoning','basis']))})),
```

### Fixed destination without redirects or cookies

Source: `downfield/server/bettail.mjs`, lines 51–54. Exact excerpt; surrounding dependencies are omitted.

```javascript
        // Fixed HTTPS target, no redirects and no cookies. The capability grants
        // publication only; it is never an AI credential or BetTail login.
        const response=await fetcher(BETTAIL_ORIGIN+'/api/nfl-research/publish',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.token},body,redirect:'error',credentials:'omit',signal:AbortSignal.timeout(15000)});
        await response.body?.cancel();
```

### Receiver verifies capability and active owner

Source: `bettail/supabase/migrations/202609270071_nfl_final_review_receipts.sql`, lines 6–15. Exact excerpt; surrounding dependencies are omitted.

```sql
create or replace function public.bt_nfl_publish(token text, document jsonb) returns jsonb
language plpgsql security definer set search_path=pg_catalog,public,pg_temp as $$
declare connection public.nfl_research_connections; game text; v_mode text; stamp timestamptz; report uuid; final_receipt jsonb; receipt_field text; receipt_value jsonb; checked timestamptz; evidence_stamp timestamptz; kickoff_stamp timestamptz;
begin
  if token is null or token !~ '^[a-f0-9]{64}$' then raise exception 'Invalid connection.' using errcode='42501'; end if;
  select c.* into connection from public.nfl_research_connections c
    join public.site_owners p on p.user_id=c.user_id
    join public.profiles u on u.id=p.user_id and u.deleted_at is null and u.profile_completed_at is not null
    where c.token_hash=encode(sha256(convert_to(token,'UTF8')),'hex') and c.expires_at>now() for update of c;
  if not found then raise exception 'Invalid connection.' using errcode='42501'; end if;
```

### Publisher transport boundary

Source: `downfield/tests/bettail.test.mjs`, lines 86–98. Exact excerpt; surrounding dependencies are omitted.

```javascript
test('publisher sends football only to fixed HTTPS target, retains capability locally and skips acknowledged revisions',async t=>{
  const dir=await directory(t),calls=[],source=entry();
  const publisher=createBetTailPublisher({directory:dir,store:{read:async()=>({reports:[source]})},setTimer:()=>({unref(){}}),clearTimer:()=>{},fetcher:async(url,options)=>{calls.push({url,options});return new Response('{}');}});
  const token='a'.repeat(64);await publisher.connect({token});
  while(publisher.status().running)await new Promise(r=>setTimeout(r,5));
  assert.equal(calls.length,1);assert.equal(calls[0].url,BETTAIL_ORIGIN+'/api/nfl-research/publish');
  assert.equal(calls[0].options.redirect,'error');assert.equal(calls[0].options.credentials,'omit');
  assert.equal(calls[0].options.headers.Authorization,'Bearer '+token);
  assert.ok(!calls[0].options.body.includes('PRIVATE'));assert.ok(!JSON.stringify(publisher.status()).includes(token));
  assert.equal(JSON.parse(await readFile(join(dir,'bettail-connection.json'),'utf8')).token,token);
  await publisher.sync();assert.equal(calls.length,1);
  await publisher.disconnect();await publisher.sync();assert.equal(calls.length,1);
});
```

### Expired and revoked capabilities are rejected

Source: `bettail/tests/nfl-database.test.ts`, lines 92–112. Exact excerpt; surrounding dependencies are omitted.

```typescript
it("denies missing, wrong, expired and revoked credentials without touching saved reports", async () => {
  const doc = JSON.stringify(sampleNflReport());
  for (const bad of [null, "bad", "f".repeat(64)])
    await expect(
      as(null, "select bt_nfl_publish($1,$2::jsonb)", [bad, doc]),
    ).rejects.toThrow(/Invalid connection/);
  await db.exec(
    "update nfl_research_connections set expires_at=now()-interval '1 second'",
  );
  await expect(
    as(null, "select bt_nfl_publish($1,$2::jsonb)", [token, doc]),
  ).rejects.toThrow(/Invalid connection/);
  await as(owner, "select bt_nfl_connection('connect',$1)", [hash]);
  await as(owner, "select bt_nfl_connection('revoke',null)");
  await expect(
    as(null, "select bt_nfl_publish($1,$2::jsonb)", [token, doc]),
  ).rejects.toThrow(/Invalid connection/);
  expect(
    (await as(friend, "select bt_nfl_read('123456789') result")).rows[0],
  ).toHaveProperty("result.headline");
});
```

## Verification and limits

- Downfield: **119/119** selected tests passed using mocked CLI responses and synthetic inputs.
- BetTail: **32/32** publishing API/database tests passed using mocks and disposable PGlite databases, including the later final-review migration.
- These runs did not invoke a live model or publish a report to the production service.
- Full private suites cannot be reproduced from these excerpts alone. The public two-test example is the reproducible subset, and is identified separately in the receipt.
