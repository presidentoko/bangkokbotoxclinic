import assert from "node:assert";
import { readFile } from "node:fs/promises";

const xml = await readFile("out/sitemap.xml", "utf-8");
// No legacy variant slugs.
for (const bad of ["/d/sriracha<", "/d/banglamung<", "/d/panthong<", "/d/%"]) {
  assert.ok(!xml.includes(bad), `sitemap should not contain ${bad}`);
}
console.log("test_sitemap_districts: OK");
