// One-off dev tool: captures PNG screenshots of key pages at desktop and
// mobile viewports so they can be reviewed via the Read tool — this repo's
// agent sessions have no browser/screenshot capability of their own.
//
// Usage (run against an already-running server, this script does not start one):
//   cd chillanel && npx next start -p 3500 &
//   node scripts/screenshot.mjs --base-url http://localhost:3500
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const BASE_URL = argValue("--base-url", "http://localhost:3000");
const OUT_DIR = argValue("--out-dir", path.join(import.meta.dirname, "..", "screenshots"));

function samplePlaceId() {
  const file = path.join(import.meta.dirname, "..", "data", "clinics.bangkok.json");
  if (!fs.existsSync(file)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

const placeId = samplePlaceId();
const ROUTES = [
  { name: "home", path: "/en" },
  { name: "city", path: "/en/city/bangkok" },
  ...(placeId ? [{ name: "place", path: `/en/place/${placeId}` }] : []),
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle" });
        const outFile = path.join(OUT_DIR, `${route.name}-${viewport.name}.png`);
        await page.screenshot({ path: outFile, fullPage: true });
        console.log(`[screenshot] wrote ${outFile}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main();
