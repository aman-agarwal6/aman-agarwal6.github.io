# Netted: assessment and access controls

[All resume claims](README.md) · [Verification results](verification.json) · [Source provenance](provenance.json)

Reviewed September 30, 2026 (America/Chicago). Original application source is private; selected code and tests are public below. No financial records, identity-provider records, account balances, or production credentials are included.

## N1: Assessment and seven-item risk register

The [dated seven-item action register](netted-risk-register.md) names priorities, proposed owners, required deliverables, acceptance criteria and recorded status. Its four high-priority release conditions and three medium-priority operating conditions are proposals. None of the seven is presented as closed by this pack.

The resume uses **acceptance criteria**, not completed acceptance evidence. The register's original column heading describes evidence required for closure. Its September 11 statuses are historical and do not claim current production readiness.

The following original assessment excerpt demonstrates scope and the distinction between selected controls and operational readiness. The confidential full assessment remains private.

### Assessment scope and conclusion

Source: `netted/docs/security-report.md`, lines 18–22. Exact excerpt; surrounding dependencies are omitted.

```text
## Security, in business terms

Netted records trades, shared-fund allocations, budgets and card rewards. This report translates its protections into observable results, business consequences and evidence required before broader reliance.

**Assessment: protections verified; operational readiness unproven** The checks support continued evaluation with limited reliance. Broad financial or commercial reliance is not recommended until the four high-priority release conditions on page 5 are closed.
```

## N2: MFA, row-level security, CSRF and ownership enforcement

These excerpts show database-enforced MFA and record ownership, direct table privilege revocation, and browser-origin checks. PGlite tests execute the actual migrations against synthetic identities. They do not exercise live Supabase authentication or establish production two-account isolation.

### Row-level security and owner policy

Source: `netted/supabase/migrations/202609110001_netted.sql`, lines 12–15. Exact excerpt; surrounding dependencies are omitted.

```sql
alter table public.netted_records enable row level security;
revoke all on public.netted_records from public,anon,authenticated;
grant select(id,kind,data,created_at) on public.netted_records to authenticated;
create policy netted_private_reads on public.netted_records for select to authenticated using(owner_id=(select auth.uid()));
```

### Database session and MFA check

Source: `netted/supabase/migrations/202609110002_security.sql`, lines 30–45. Exact excerpt; surrounding dependencies are omitted.

```sql
create function netted_private.check_session(p_mfa boolean default true) returns uuid
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); sid uuid; started timestamptz; ended timestamptz; seen timestamptz; blocked boolean;
begin
 if u is null or coalesce(auth.jwt()->'app_metadata'->>'provider','')<>'google' then raise exception 'NETTED_SESSION'; end if;
 begin sid:=(auth.jwt()->>'session_id')::uuid; exception when others then raise exception 'NETTED_SESSION'; end;
 select created_at,not_after into started,ended from auth.sessions where id=sid and user_id=u;
 if not found or started is null or started<=clock_timestamp()-interval '12 hours' or ended<=clock_timestamp() then raise exception 'NETTED_SESSION'; end if;
 if not exists(select 1 from auth.users where id=u and email_confirmed_at is not null) then raise exception 'NETTED_SESSION'; end if;
 insert into netted_private.sessions(session_id,owner_id,last_seen) values(sid,u,started) on conflict do nothing;
 select last_seen,revoked into seen,blocked from netted_private.sessions where session_id=sid and owner_id=u for update;
 if not found or blocked or seen<=clock_timestamp()-interval '30 minutes' then raise exception 'NETTED_SESSION'; end if;
 if p_mfa and (coalesce(auth.jwt()->>'aal','')<>'aal2' or not exists(select 1 from auth.mfa_factors where user_id=u and status='verified' and factor_type='totp')) then raise exception 'NETTED_MFA'; end if;
 update netted_private.sessions set last_seen=clock_timestamp() where session_id=sid;
 return u;
end $$;
```

### Later migration removes direct table reads as well as writes

Source: `netted/supabase/migrations/202609110002_security.sql`, lines 82–83. Exact excerpt; surrounding dependencies are omitted.

```sql
revoke all on public.netted_records from public,anon,authenticated;
revoke select(id,kind,data,created_at) on public.netted_records from authenticated;
```

### Same-origin mutation check

Source: `netted/src/lib/security.ts`, lines 29–36. Exact excerpt; surrounding dependencies are omitted.

```typescript
export function sameOrigin(request: Request): boolean {
  return (
    request.headers.get("origin") === appOrigin(request) &&
    !["cross-site", "same-site"].includes(
      request.headers.get("sec-fetch-site") ?? "",
    )
  );
}
```

### MFA at the database boundary

Source: `netted/tests/security.test.ts`, lines 60–67. Exact excerpt; surrounding dependencies are omitted.

```typescript
it("requires aal2 and an existing verified TOTP factor even for direct RPC calls", async () => {
  const user = await identity(db);
  await expect(asUser(db, user, snapshot, [], { aal: "aal1" })).rejects.toThrow(
    "NETTED_MFA",
  );
  await db.query("delete from auth.mfa_factors where user_id=$1", [user]);
  await expect(asUser(db, user, snapshot)).rejects.toThrow("NETTED_MFA");
});
```

### Cross-user references and direct writes are denied

Source: `netted/tests/accounting.test.ts`, lines 331–360. Exact excerpt; surrounding dependencies are omitted.

```typescript
it("protects records from other users and direct writes", async () => {
  const w = await workspace(),
    other = await workspace();
  await expect(
    other.apply("entity", { fundId: w.fund, name: "Intruder" }),
  ).rejects.toThrow(/one of your funds/);
  await expect(
    as(other.user, "select id from public.netted_records where id=$1", [
      w.fund,
    ]),
  ).rejects.toThrow(/permission denied/);
  const result = await as(other.user, "select public.netted_snapshot() result");
  expect(
    (result.rows[0] as { result: Snapshot }).result.records.some(
      (r) => r.id === w.fund,
    ),
  ).toBe(false);
  await expect(
    as(
      w.user,
      "insert into public.netted_records(id,owner_id,kind,input,data) values(gen_random_uuid(),auth.uid(),'fund','{}','{}')",
    ),
  ).rejects.toThrow(/permission denied/);
  await expect(
    as(w.user, "select netted_private.netted_retained($1,$2)", [
      other.user,
      other.a,
    ]),
  ).rejects.toThrow(/permission denied/);
});
```

### Forged browser origins are denied

Source: `netted/tests/security.test.ts`, lines 211–232. Exact excerpt; surrounding dependencies are omitted.

```typescript
it("rejects forged, missing, sibling-origin and scheme-changing browser mutations", () => {
  for (const origin of [
    "https://evil.example",
    "http://netted-blush.vercel.app",
    "https://preview.netted-blush.vercel.app",
    "null",
    "",
  ])
    expect(
      sameOrigin(
        request("{}", {
          origin,
          host: "evil.example",
          "x-forwarded-host": "evil.example",
        }),
      ),
    ).toBe(false);
  expect(sameOrigin(request("{}", { "sec-fetch-site": "cross-site" }))).toBe(
    false,
  );
  expect(sameOrigin(request("{}"))).toBe(true);
});
```

## Verification and limits

**36/36** security tests passed. A separate focused run passed the one accounting test that directly checks cross-user references, snapshot isolation, direct reads/writes, and private-helper denial; the other **31** accounting tests were skipped by the name filter. This pack does not claim that the full accounting suite was rerun.

The risk assessment was prepared within the implementation workflow, with AI assistance. It is not an independent audit or a certification. Test evidence is limited to the named controls, fixtures and versions.
