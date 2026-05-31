import assert from "node:assert";
import { addItem, removeItem, hasItem, formatSuppliersLine, MAX_SHORTLIST, type ShortlistItem } from "../lib/shortlist.ts";

const a: ShortlistItem = { id: "a", name: "Acme", cityLabel: "Chon Buri" };
const b: ShortlistItem = { id: "b", name: "Beta", cityLabel: "Rayong" };

// add: newest first.
let list = addItem(addItem([], a), b);
assert.deepEqual(list.map((x) => x.id), ["b", "a"], "newest first");

// add: dedupe by id (re-adding moves nothing / no dup).
list = addItem(list, a);
assert.equal(list.filter((x) => x.id === "a").length, 1, "no duplicate id");
assert.equal(list.length, 2, "dedupe keeps length");

// has.
assert.ok(hasItem(list, "a"), "has a");
assert.ok(!hasItem(list, "z"), "no z");

// remove.
list = removeItem(list, "a");
assert.deepEqual(list.map((x) => x.id), ["b"], "removed a");

// cap: adding > MAX drops the oldest, keeps newest MAX.
let big: ShortlistItem[] = [];
for (let i = 0; i < MAX_SHORTLIST + 10; i++) {
  big = addItem(big, { id: `s${i}`, name: `S${i}`, cityLabel: "X" });
}
assert.equal(big.length, MAX_SHORTLIST, "cap honored");
assert.equal(big[0].id, `s${MAX_SHORTLIST + 9}`, "newest kept at front");
assert.ok(!hasItem(big, "s0"), "oldest dropped");

// formatSuppliersLine shape.
const line = formatSuppliersLine([a, b]);
assert.equal(line, "Acme (Chon Buri) [a], Beta (Rayong) [b]", "format line");
assert.equal(formatSuppliersLine([]), "", "empty format");

console.log("test_shortlist: OK");
