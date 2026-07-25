// lib/favorites.ts checks `typeof localStorage !== "undefined"` at call
// time (not import time), so stubbing globalThis.localStorage with an
// in-memory Map-backed mock before each test is enough — no jsdom needed.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getFavoriteIds, isFavorite, toggleFavorite } from "../lib/favorites.ts";

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

test("getFavoriteIds: returns [] when nothing stored", () => {
  assert.deepEqual(getFavoriteIds(), []);
});

test("toggleFavorite: adding a new id returns true and persists it", () => {
  const result = toggleFavorite("p1");
  assert.equal(result, true);
  assert.deepEqual(getFavoriteIds(), ["p1"]);
});

test("toggleFavorite: toggling an already-favorited id returns false and removes it", () => {
  toggleFavorite("p1");
  const result = toggleFavorite("p1");
  assert.equal(result, false);
  assert.deepEqual(getFavoriteIds(), []);
});

test("isFavorite: reflects current storage state", () => {
  assert.equal(isFavorite("p1"), false);
  toggleFavorite("p1");
  assert.equal(isFavorite("p1"), true);
});

test("getFavoriteIds: recovers gracefully from corrupted JSON", () => {
  globalThis.localStorage.setItem("chillanel:favorites", "{not valid json");
  assert.deepEqual(getFavoriteIds(), []);
});

test("getFavoriteIds: ignores non-string entries from a tampered/malformed value", () => {
  globalThis.localStorage.setItem("chillanel:favorites", JSON.stringify(["p1", 42, null, "p2"]));
  assert.deepEqual(getFavoriteIds(), ["p1", "p2"]);
});

test("multiple ids accumulate independently", () => {
  toggleFavorite("p1");
  toggleFavorite("p2");
  toggleFavorite("p3");
  assert.deepEqual(getFavoriteIds(), ["p1", "p2", "p3"]);
});
