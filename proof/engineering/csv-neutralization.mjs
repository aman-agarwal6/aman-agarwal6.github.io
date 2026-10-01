/*
 * Public, standalone adaptation of BetTail src/lib/csv.ts.
 * Only TypeScript annotations were removed; export logic is unchanged.
 * Last source review: September 30, 2026. Synthetic examples only.
 * Spreadsheet import behavior can differ; this is a bounded mitigation.
 */
export function csv(rows) {
  if (!rows.length) return "No wagers\r\n";
  const keys = Object.keys(rows[0]);
  const cell = (v) => {
    const s = String(v ?? "");
    return (
      '"' +
      (/^[\s\u0000-\u001f]*[=+\-@]|^[\t\r\n]/.test(s) ? "'" : "") +
      s.replaceAll('"', '""') +
      '"'
    );
  };
  return [
    keys.map(cell).join(","),
    ...rows.map((r) => keys.map((k) => cell(r[k])).join(",")),
  ].join("\r\n");
}
