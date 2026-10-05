# BetTail: export safety and cookie settings

Last reviewed September 30, 2026 · [Case study](https://aman-agarwal6.github.io/projects/bettail.html) · [Agent controls](../ai-security/downfield-bettail.md)

## CSV formula neutralization

Spreadsheet programs can interpret user-controlled labels as formulas. BetTail's export helper converts each cell to text, prefixes an apostrophe when the value begins with a formula marker after whitespace or control characters, doubles embedded quotes and quotes every cell. Headers pass through the same helper. The exact source condition is:

```js
(/^[\s\u0000-\u001f]*[=+\-@]|^[\t\r\n]/.test(s) ? "'" : "")
```

The [standalone module](csv-neutralization.mjs) retains the source logic with TypeScript annotations removed. The [tests](csv-neutralization.test.mjs) adapt the original synthetic formula cases to Node's built-in runner and add checks for headers, quoted CRLF, missing values, column order and input preservation.

This helper also prefixes negative numeric values after converting them to strings. It is separate from BetTail's metrics exporter. Import settings and spreadsheet programs can differ; passing serialization tests does not establish safe behavior in every spreadsheet program, or authorize access to the exported records.

## Production session-cookie configuration

Exact excerpt from the shared Supabase configuration:

```ts
export const authCookieOptions = {
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
```

The browser client uses these options directly. The server client and proxy use `serverOptions`, which includes the same `cookieOptions`. No Domain option is configured, consistent with host-only cookies. The production condition enables Secure; the excerpt does not set HttpOnly. The September 9 review records that the browser-session architecture requires JavaScript-readable cookies.

The existing proxy-auth tests check endpoint authentication delegation and retained private-cache/security headers. They do not directly assert these cookie flags. Cookie configuration was source-inspected in this review; no live authentication or production cookie test was performed.

## Verification and provenance

The public CSV test command is in the [index](README.md#reproduce-the-public-example). Results: **17 tests passed** on Node.js 24.14.1; synthetic values only. No application suite or production endpoint was run for this example.

Reviewed paths in the private BetTail repository:

- `src/lib/csv.ts`
- `tests/reliability.test.ts`
- `src/lib/supabase/options.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- `src/proxy.ts`, `tests/proxy-auth.test.ts`
- `docs/security-review-2026-09-09.md`
