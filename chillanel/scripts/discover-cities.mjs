// Shared by build-all-cities.mjs (prebuild/vercel-build, git-triggered
// deploys) and refresh-and-deploy.mjs (chillanel_refresher watchdog
// service, polling-triggered deploys) so both paths agree on which cities
// have real data. A city only counts once its scraper has produced
// spa_output/{city}/clinics.csv — most cities besides bangkok are wired
// into watchdog.py but stay .disabled until their VPN slot opens up, so
// this list grows over time with no code change needed here.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "..");
const SPA_OUTPUT_DIR = path.join(ROOT, "spa_output");

export function discoverCities() {
  if (!fs.existsSync(SPA_OUTPUT_DIR)) return [];
  return fs
    .readdirSync(SPA_OUTPUT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((city) => fs.existsSync(path.join(SPA_OUTPUT_DIR, city, "clinics.csv")))
    .sort();
}
