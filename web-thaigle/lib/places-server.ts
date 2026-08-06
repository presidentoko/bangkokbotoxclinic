// lib/places-server.ts
// Server-only place loader for the [lang]/place/[slug] detail route.
// Reads places-data.json from disk at runtime instead of a static import,
// so a single place's data isn't bundled into every generated page's payload.
// (lib/places.ts keeps the static import — it's also used by the client-side
// HomeSearch component, which needs the dataset in the browser bundle.)

import { promises as fs } from "node:fs";
import path from "node:path";
import type { Place, Lang } from "./places";

let _places: Place[] | null = null;
let _index: Map<string, Place> | null = null;

async function loadPlaces(): Promise<{ places: Place[]; index: Map<string, Place> }> {
  if (_places && _index) return { places: _places, index: _index };
  const raw = await fs.readFile(
    path.join(process.cwd(), "lib", "places-data.json"),
    "utf-8"
  );
  _places = JSON.parse(raw) as Place[];
  _index = new Map(_places.map((p) => [p.slug, p]));
  return { places: _places, index: _index };
}

export async function getAllPlaceSlugsServer(): Promise<{ lang: Lang; slug: string }[]> {
  const { places } = await loadPlaces();
  const langs: Lang[] = ["th", "en", "ko"];
  return places.flatMap((p) => langs.map((lang) => ({ lang, slug: p.slug })));
}

/**
 * All places, for the /en/place index. Server-side so the index page doesn't
 * pull the whole dataset into a client bundle the way lib/places.ts does.
 */
export async function getAllPlacesServer(): Promise<Place[]> {
  const { places } = await loadPlaces();
  return [...places].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlaceServer(slug: string, lang: Lang): Promise<Place | null> {
  const { index } = await loadPlaces();
  const place = index.get(slug);
  if (!place) return null;
  const i18nData = place.i18n[lang];
  return {
    ...place,
    name: i18nData?.name ?? place.name,
    receipt: i18nData?.receipt ?? place.receipt,
  };
}
