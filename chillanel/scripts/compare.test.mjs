import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getCompareIds, isInCompare, toggleCompare, clearCompare, MAX_COMPARE } from "../lib/compare.ts";

function installMockStorage() {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
}

beforeEach(() => {
  installMockStorage();
});

test("MAX_COMPARE is 3", () => {
  assert.equal(MAX_COMPARE, 3);
});

test("toggleCompare: adding a new id returns added:true and persists it", () => {
  const result = toggleCompare("p1");
  assert.equal(result.added, true);
  assert.equal(result.atLimit, false);
  assert.deepEqual(result.ids, ["p1"]);
  assert.deepEqual(getCompareIds(), ["p1"]);
});

test("toggleCompare: toggling an already-selected id removes it", () => {
  toggleCompare("p1");
  const result = toggleCompare("p1");
  assert.equal(result.added, false);
  assert.deepEqual(result.ids, []);
});

test("toggleCompare: refuses a 4th id, leaves the existing 3 untouched", () => {
  toggleCompare("p1");
  toggleCompare("p2");
  toggleCompare("p3");
  const result = toggleCompare("p4");
  assert.equal(result.added, false);
  assert.equal(result.atLimit, true);
  assert.deepEqual(result.ids, ["p1", "p2", "p3"]);
  assert.deepEqual(getCompareIds(), ["p1", "p2", "p3"]);
});

test("isInCompare: reflects current selection", () => {
  assert.equal(isInCompare("p1"), false);
  toggleCompare("p1");
  assert.equal(isInCompare("p1"), true);
});

test("clearCompare: empties the selection", () => {
  toggleCompare("p1");
  toggleCompare("p2");
  clearCompare();
  assert.deepEqual(getCompareIds(), []);
});
