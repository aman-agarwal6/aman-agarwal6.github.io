# Sailday price-tracker implementation

[Case study](https://aman-agarwal6.github.io/projects/sailday.html#prices) · [Engineering evidence](README.md) · [Product site](https://sailday.vercel.app)

Source reviewed September 30, 2026, including the manual-refresh release documented on that date. The application source is private. This page publishes selected implementation details without booking amounts, travel records, account identifiers, subscription endpoints, credentials or deployment configuration. It documents software behavior rather than offering cruise-price or purchase advice.

## What the tracker does

Sailday brings current public rates, recorded price changes and a booking or purchase baseline into one dashboard. Its configured automatic feeds cover interior cabins, ocean-view balconies, the Deluxe Beverage Package and VOOM internet for one sailing. Other watched items can use reviewed manual quotes and price-history JSON imports; ordinary screenshots and account pages are not automatically parsed.

The tracker distinguishes advertised starting rates from confirmed comparable quotes. It does not purchase, rebook, sign into Royal Caribbean or promise that a public rate is available to a particular traveler.

## Collection and refresh

- **Sources:** Royal Caribbean's public sailing-price endpoint for rooms and its unauthenticated Cruise Planner catalog for beverage and internet products. No paid data provider or model inference is used for collection.
- **Scheduling:** PostgreSQL HTTP collectors run through Supabase `pg_cron`, with three hourly jobs: rooms, beverage and internet. Disabled feeds, the departure cutoff and an attempt cap bound collection.
- **Manual action:** An authorized `sd_check_prices_now()` call requests the same fixed feeds. Row locking and a shared 15-minute guard prevent scheduled and manual checks from repeatedly requesting a source.
- **Ordinary refresh:** React reads stored observations on timers and return-to-page events. Those reads do not collect new Royal prices. Failed collection retains the last successful prices and records source status; delayed older responses cannot replace newer confirmed observations.

Source: `supabase/migrations/003_market_prices.sql`, `005_market_schedule.sql`, `006_price_graphs_selected_rooms.sql`, `014_resilient_room_identity.sql` and `015_check_prices_now.sql`; client behavior in `app/MarketConnection.jsx`, `app/market-sync.js` and `app/market-prices.js`. Migration filenames identify private source for review; they are not public download links.

## Comparisons preserve the billing basis

Room matching rejects guarantee, Royal-assigned and unknown-assignment products. Room comparisons use the contracted fare plus taxes for the supported guest count. A deposit is a payment toward that booking, not the booking's comparison price. Protection and gratuities remain separate.

Source: `app/prices.js`. Exact function excerpt; `round` is the module's cent-rounding helper. This is an excerpt, not a standalone program.

```javascript
export function bookingTotals(b){const comparison=b.fare===null?null:round(b.fare+b.taxes);const total=comparison===null?null:round(comparison+b.gratuities+b.protection);return {comparison,total,balance:total===null?null:round(total-b.paid)}}
```

For beverage purchases, the receipt subtotal, gratuities and total stay intact. The paid daily baseline divides the receipt total by guests and days. The displayed public daily estimate adds 18% once; the full-order estimate multiplies the unrounded rate by guests and days before rounding. These are the reviewed implementation's calculations. Account offers and Royal's final checkout rounding can differ.

Source: `app/beverage-prices.js` and `app/PriceTrends.jsx`.

## History and graphs

PostgreSQL retains timestamped checks, including unchanged successful observations. The client keeps a bounded local copy of price changes for offline use and loads cloud history when authorized and connected. React draws custom SVG graphs with exact-check selection, high/low values and a booking or purchase reference line. Missing quotes and changed billing units become gaps; a missing quote does not establish that a product is sold out.

Source: `app/price-trends.js`. This exact excerpt breaks graph lines on missing values or a gap longer than two hours rather than joining unrelated observations.

```javascript
export function chartSegments(points,x,y,maxGap=2*3600000){
 const paths=[];let current=[];let previous=null;
 for(const point of points){
  if(point.value==null||previous&&point.time-previous.time>maxGap){if(current.length)paths.push(current);current=[];}
  if(point.value!=null)current.push([x(point.time),y(point.value)]);
  previous=point;
 }
 if(current.length)paths.push(current);
 return paths;
}
```

Source for rendering and refresh: `app/PriceTrends.jsx`, `app/MarketConnection.jsx`, `app/market-prices.js` and `app/market-sync.js`.

## Optional price-change notifications

The booking owner opts in each device and chooses feeds, change direction and a minimum dollar change. The threshold compares raw collected feed amounts; it does not add the beverage card's 18% display estimate. The database queues qualifying changes after successful observations. First observations, unchanged prices, missing quotes and failed collections do not trigger a new-price alert. Other group members are not subscribed automatically.

Supabase `pg_net` wakes the Vercel delivery endpoint. The `web-push` library sends encrypted standard Web Push through bounded job claims. Retry scheduling, queue expiry and expired-subscription handling limit failed deliveries. No service-role key is required by the delivery endpoint. Provider acceptance does not prove the phone displayed the notification; permission, connectivity and operating-system behavior still matter.

Source: `supabase/migrations/013_price_push.sql`, `api/price-push.js`, `app/PushNotifications.jsx`, the service worker and `docs/price-notifications.md`.

## Verification scope

This documentation change reviewed the source and dated release record; it did not rerun the application suite, collect live prices, send a push notification or access private bookings.

Retained test coverage includes:

- `tests/market-prices.test.mjs`: cabin eligibility, public/personal separation, late observations and bounded history.
- `tests/price-trends.test.mjs` and `tests/beverage-prices.test.mjs`: fare-versus-deposit comparisons, billing units, gaps, receipt calculations and rounding.
- `tests/manual-market-db.test.mjs`: actual SQL collectors with stubbed HTTP; authorized checks, denied callers, shared cooldowns, disabled/capped collectors and preservation after source failure.
- `tests/manual-market-browser.test.mjs`: actual price components with synthetic transport; manual busy state, graph updates, offline disabling and narrow layouts.
- `tests/push-delivery.test.mjs` and `tests/push-worker.test.mjs`: job and endpoint checks, delivery outcomes, worker behavior and encryption with disposable test keys without sending a live message.

The September 30 release record reports deployed manual checks and retained hourly collection. That dated evidence does not establish uninterrupted future collection, private-offer equivalence or notification display on every device. Public endpoints can change or block requests, and hosting quotas or interruptions can delay checks. The tracker exposes freshness and failure status instead of representing sampled prices as continuous live quotes.
