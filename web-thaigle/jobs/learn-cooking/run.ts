// jobs/learn-cooking/run.ts
// Usage:
//   npx tsx jobs/learn-cooking/run.ts --full      # re-expand seed + collect + receipt
//   npx tsx jobs/learn-cooking/run.ts --refresh   # refresh reviews for known places only
//
// Idempotent: same reviews hash = skip receipt call

import { existsSync, readFileSync, writeFileSync } from "fs";
import { createHash } from "crypto";
import path from "path";
import { SEED_QUERIES, NEGATIVE_NAME_PATTERNS } from "./config";
import { normalizeReviews, hasClassSignal, dedupeByText } from "./normalize";
import type { JobState, SeedPlace, PlaceState } from "./types";
import type { RawPlace } from "./normalize";
import { generateReceipt } from "@/lib/receipt/generate";

const STATE_PATH = path.join(process.cwd(), "jobs/learn-cooking/state.json");
const REVIEW_QUEUE_PATH = path.join(
  process.cwd(),
  "jobs/learn-cooking/review-queue.json"
);
const CONCURRENCY = 5;

function loadState(): JobState {
  if (!existsSync(STATE_PATH)) {
    return { places: {}, otaMatches: {}, reviewQueue: [] };
  }
  return JSON.parse(readFileSync(STATE_PATH, "utf8")) as JobState;
}

function saveState(state: JobState) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function hashReviews(input: ReturnType<typeof normalizeReviews>): string {
  return createHash("sha256")
    .update(
      JSON.stringify(input.reviews.map((r) => ({ id: r.id, text: r.text })))
    )
    .digest("hex")
    .slice(0, 16);
}

function isNegativePlace(name: string, category: string): boolean {
  const combined = `${name} ${category}`;
  return NEGATIVE_NAME_PATTERNS.some((p) => p.test(combined));
}

function toSlug(name: string, area: string): string {
  const base = `${area}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "cooking-class-bangkok";
}

// TODO: wire to Outscraper API
async function fetchGooglePlaces(query: string): Promise<SeedPlace[]> {
  console.log(`  [google] searching: "${query}"`);
  // Stub — replace with real Outscraper call
  // POST https://api.outscraper.com/maps/search-v3?query=...&limit=20
  return [];
}

// TODO: wire to Outscraper reviews API
async function fetchGoogleReviews(
  place_id: string
): Promise<RawPlace["reviews"]> {
  console.log(`  [google-reviews] fetching reviews for ${place_id}`);
  // Stub — replace with real Outscraper call
  // GET https://api.outscraper.com/maps/reviews-v3?query=place_id&limit=200
  return [];
}

// TODO: wire to Klook/GYG/Viator scrapers via Webshare proxy
async function fetchOtaReviews(
  place: SeedPlace,
  otaMatches: JobState["otaMatches"]
): Promise<RawPlace["reviews"]> {
  const match = otaMatches[place.place_id];
  if (!match || match.skipped) return [];
  console.log(
    `  [ota] fetching for ${place.name} (klook: ${match.klookProductId ?? "none"})`
  );
  // Stub — replace with actual scrapers
  return [];
}

async function seed(state: JobState): Promise<SeedPlace[]> {
  console.log(`\n[seed] Expanding ${SEED_QUERIES.length} queries...`);
  const allPlaces = new Map<string, SeedPlace>();

  for (const q of SEED_QUERIES) {
    const raw = await fetchGooglePlaces(q.query);
    for (const p of raw) {
      // Negative filter
      if (isNegativePlace(p.name, p.gmbCategory)) {
        console.log(`  [filter-drop] ${p.name} — matched negative pattern`);
        continue;
      }
      if (!allPlaces.has(p.place_id)) {
        allPlaces.set(p.place_id, { ...p, sourceQueries: [q.query] });
      } else {
        allPlaces.get(p.place_id)!.sourceQueries.push(q.query);
      }
    }
  }

  const unique = Array.from(allPlaces.values());
  console.log(`[seed] ${unique.length} unique places after dedupe`);
  return unique;
}

async function collectAndProcess(
  places: SeedPlace[],
  state: JobState
): Promise<void> {
  let done = 0;
  const total = places.length;

  // Mutate a local queue so concurrent workers can pull from it
  const queue = [...places];

  const slots = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const place = queue.shift();
      if (!place) break;

      console.log(`\n[collect] ${place.name} (${place.area})`);

      // 1. Fetch reviews (Google + OTA)
      const googleReviews = await fetchGoogleReviews(place.place_id);
      const otaReviews = await fetchOtaReviews(place, state.otaMatches);

      const rawPlace: RawPlace = {
        ...place,
        gmbCategory: place.gmbCategory,
        reviews: dedupeByText([...googleReviews, ...otaReviews]),
      };

      // 2. Positive class signal check (ensure it's a real class, not just a restaurant)
      if (googleReviews.length > 0 && !hasClassSignal(rawPlace.reviews)) {
        console.log(
          `  [filter-drop] ${place.name} — no class signal in reviews`
        );
        done++;
        continue;
      }

      // 3. Normalize to ReviewInput
      const input = normalizeReviews(rawPlace);
      const reviewsHash = hashReviews(input);

      // 4. Idempotency check — skip if hash matches
      const existing = state.places[place.place_id];
      if (existing?.reviewsHash === reviewsHash) {
        console.log(`  [skip] ${place.name} — reviews unchanged`);
        done++;
        continue;
      }

      // 5. Generate receipt
      console.log(`  [receipt] generating for ${place.name}...`);
      const result = await generateReceipt(input);

      // 6. Update state
      const placeState: PlaceState = {
        place_id: place.place_id,
        reviewsHash,
        receiptStatus: result.status,
        lastCollectedAt: new Date().toISOString(),
        lastReceiptAt: new Date().toISOString(),
      };
      state.places[place.place_id] = placeState;

      if (result.status === "needs_review") {
        if (!state.reviewQueue.includes(place.place_id)) {
          state.reviewQueue.push(place.place_id);
        }
        writeFileSync(
          REVIEW_QUEUE_PATH,
          JSON.stringify(state.reviewQueue, null, 2)
        );
        console.log(
          `  [queue] ${place.name} → review-queue (status: needs_review)`
        );
      } else {
        console.log(
          `  [done] ${place.name} — localsScore: ${result.output?.localsScore ?? "n/a"}`
        );
      }

      // Save state incrementally
      saveState(state);
      done++;
      console.log(`[progress] ${done}/${total}`);
    }
  });

  await Promise.all(slots);
}

async function main() {
  const args = process.argv.slice(2);
  const isFullRun = args.includes("--full");
  const isRefresh = args.includes("--refresh");

  if (!isFullRun && !isRefresh) {
    console.error("Usage: npx tsx jobs/learn-cooking/run.ts --full | --refresh");
    process.exit(1);
  }

  console.log(
    `[learn-cooking] Starting ${isFullRun ? "--full" : "--refresh"} run`
  );
  const state = loadState();

  let places: SeedPlace[];

  if (isFullRun) {
    places = await seed(state);
    state.lastFullSeedAt = new Date().toISOString();
  } else {
    // Refresh: reconstruct minimal SeedPlace stubs from known place_ids in state
    places = Object.keys(state.places).map((id) => ({
      place_id: id,
      name: id,
      area: "Bangkok",
      lat: 13.75,
      lng: 100.52,
      gmbCategory: "thai cooking class",
      slug: toSlug(id, "bangkok"),
      sourceQueries: [],
    }));
    state.lastRefreshAt = new Date().toISOString();
  }

  await collectAndProcess(places, state);

  console.log("\n[done] Job complete");
  console.log(`  Total known places: ${Object.keys(state.places).length}`);
  console.log(`  Review queue: ${state.reviewQueue.length}`);
  saveState(state);
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
