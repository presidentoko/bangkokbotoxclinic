// Runs build-data.mjs once per city with real data (see discover-cities.mjs).
// prebuild/vercel-build used to call build-data.mjs directly with no --city
// flag, which only ever regenerates data/clinics.bangkok.json — harmless for
// the chillanel_refresher watchdog path (it calls build-data.mjs itself, per
// city, before deploying) but silently dropped every other city on a plain
// git-push-triggered Vercel build, since data/*.json is gitignored and would
// only ever come from this build step. Falls back to bangkok alone if
// spa_output isn't present at all, matching build-data.mjs's own default.
import { execFileSync } from "node:child_process";
import { discoverCities } from "./discover-cities.mjs";

const cities = discoverCities();
for (const city of cities.length > 0 ? cities : ["bangkok"]) {
  execFileSync(process.execPath, ["scripts/build-data.mjs", "--city", city], {
    cwd: import.meta.dirname + "/..",
    stdio: "inherit",
  });
}
