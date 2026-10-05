# Sailday engineering evidence

[Case study](https://aman-agarwal6.github.io/projects/sailday.html) · [Product site](https://sailday.vercel.app)

Reviewed September 30, 2026. Sailday is a deployed personal cruise planner with private source. This page links the price-tracker implementation and publishes selected synchronization and security excerpts, with the scope of retained test coverage. It contains no travel records, account identifiers, invite tokens or deployment configuration.

## Price collection, comparisons, graphs and notifications

The [price-tracker evidence](price-tracker.md) describes public Royal Caribbean feeds, hourly and manual collection, exact booking comparisons, graph history, offline behavior and owner-opt-in encrypted Web Push. It identifies the source files, includes selected calculation and graph excerpts, and separates retained test coverage from checks rerun for this documentation. Automatic collection covers one configured sailing.

## Membership is checked before replaying a receipt

Source: `supabase/migrations/001_sailday.sql`, beginning of `sd_apply`. This exact excerpt omits declarations and the rest of the function; it is evidence for inspection, not a standalone migration.

```sql
begin
 -- Serialize mutations and membership changes for the same group.
 perform 1 from public.sd_groups where id=g for update;
 role=public.sd_role(g);if role is null or role='viewer' then raise exception 'Edit access required' using errcode='42501';end if;
 select r.result into result from public.sd_receipts r where group_id=g and user_id=u and r.op=pending_op;
 if found then return result;end if;
```

The operation locks the group and checks current membership before returning a saved retry receipt. A viewer or removed member cannot rely on an earlier queued request as authority to edit. Membership-management functions use the same group serialization boundary. These source controls still require integration testing with the deployed identity provider to establish end-to-end behavior.

## Conflicting fields require a decision

Source: the same `sd_apply` function. Exact loop excerpt:

```sql
for entry in select * from jsonb_each(patch) loop
 if cur.data->entry.key is distinct from base->entry.key and cur.data->entry.key is distinct from entry.value then return jsonb_build_object('status','conflict','current',to_jsonb(cur)-'group_id');end if;
end loop;
```

The function compares changed fields with the base shown to the editor. Independent changes can merge. If the server and editor changed the same field differently, the client receives a conflict and asks the user to choose. `tests/multiuser.test.mjs` exercises this behavior using separate synthetic user contexts and the actual migrations in an embedded PostgreSQL-compatible database.

## Bounded public itinerary requests

Source: `api/cruise.js`, `allowedURL`. Exact excerpt:

```javascript
const hosts=new Set(['www.royalcaribbean.com','royalcaribbean.com']);
export function allowedURL(raw){const u=new URL(raw);if(u.protocol!=='https:'||!hosts.has(u.hostname)||u.username||u.password||u.port||!/^\/(?:cruises\/itinerary\/|cruise-deals\/cruises\/itinerary\/|itinerary\/)/.test(u.pathname))throw Error('Paste a Royal Caribbean itinerary link. Other cruise lines can use the day-by-day import.');return u}
```

The lookup uses manual redirects and checks every redirected URL with this function. It also bounds time, response size, redirect count and content type. Itinerary dates must match the requested sailing. Public-source availability and content correctness remain separate concerns.

## Verification and data lifecycle

Retained suites cover cold offline reopening, queued retries, once-only message delivery, conflicting edits, membership removal, malformed imports and complete service-worker updates. Browser identities and HTTP/WebSocket transport are simulated in the multiuser suite; database authorization runs against real migrations. This publication did not rerun application suites or a two-phone deployment test.

Downloaded copies remain readable after membership is revoked. Browser storage can be removed by the user or operating system. Plan backups exclude credentials, invitations, chat and files; users need separate copies of important documents. Authentication and API responses are not part of the cached application shell.
