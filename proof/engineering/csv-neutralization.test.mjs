/*
 * Synthetic cases adapted from BetTail tests/reliability.test.ts,
 * plus focused checks of headers, missing cells, line endings and mutation.
 * Vitest imports/assertions were adapted to node:test and node:assert/strict.
 * No app, spreadsheet process, network request or private data is used.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { csv } from "./csv-neutralization.mjs";

for (const value of [
  "=1+1",
  "+SUM(1)",
  "-1+2",
  "@SUM(1)",
  " \t=1+1",
  "\n=1+1",
  "\r+1",
  "\u0000=1+1",
  "\uFEFF=1+1",
]) {
  test(`neutralizes formula-like text ${JSON.stringify(value)}`, () => {
    assert.equal(csv([{ title: value }]), `"title"\r\n"'${value.replaceAll('"', '""')}"`);
  });
}

test("preserves ordinary text, embedded quotes, commas and positive values", () => {
  assert.equal(csv([{ title: 'Team "A", over', amount_cents: 500 }]),
    '"title","amount_cents"\r\n"Team ""A"", over","500"');
});

test("preserves embedded CRLF inside quoted ordinary text", () => {
  assert.equal(csv([{ note: 'Line 1\r\nLine "2", complete' }]),
    '"note"\r\n"Line 1\r\nLine ""2"", complete"');
});

test("applies neutralization and escaping to column headers", () => {
  assert.equal(csv([{ '=SUM(1)': 'Synthetic "record"' }]),
    '"\'=SUM(1)"\r\n"Synthetic ""record"""');
});

test("serializes null, undefined and missing cells as empty quoted values", () => {
  assert.equal(csv([{ a: null, b: undefined }, { a: "Synthetic" }]),
    '"a","b"\r\n"",""\r\n"Synthetic",""');
});

test("retains the source helper's empty-export response", () => {
  assert.equal(csv([]), "No wagers\r\n");
});

test("uses the first row's columns and consistent CRLF record separators", () => {
  assert.equal(csv([{ title: "First", cents: 500 }, { cents: 600, title: "Second", extra: "Excluded" }]),
    '"title","cents"\r\n"First","500"\r\n"Second","600"');
});

test("conservatively prefixes negative numeric values after string conversion", () => {
  assert.equal(csv([{ cents: -500 }]), '"cents"\r\n"\'-500"');
});

test("does not alter the input rows", () => {
  const rows = [{ title: "=1+1", cents: 500 }, { title: 'Synthetic "text"', cents: null }];
  const before = structuredClone(rows);
  csv(rows);
  assert.deepEqual(rows, before);
});
