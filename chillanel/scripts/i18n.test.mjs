import { test } from "node:test";
import assert from "node:assert/strict";

// Import via a tiny require-free trick: since lib/i18n.ts is TypeScript and this
// test runs with plain Node, we assert the compiled JS after `next build` isn't
// available pre-build. Instead, statically read + parse the source with a
// lightweight structural check: every top-level key set must match across langs.
import fs from "node:fs";
import path from "node:path";

test("i18n: en/th/ko define the same set of top-level dictionary keys", () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, "..", "lib", "i18n.ts"), "utf-8");
  const blocks = ["en", "th", "ko"].map((lang) => {
    const m = src.match(new RegExp(`const ${lang}: Dict = \\{([\\s\\S]*?)\\n\\};`));
    assert.ok(m, `could not find ${lang} dict block`);
    return m[1];
  });
  const topKeys = (block) =>
    [...block.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]).sort();
  const [enKeys, thKeys, koKeys] = blocks.map(topKeys);
  assert.deepEqual(thKeys, enKeys, "th top-level keys must match en");
  assert.deepEqual(koKeys, enKeys, "ko top-level keys must match en");
  assert.ok(enKeys.length >= 6, "expected at least 6 top-level sections");
});
