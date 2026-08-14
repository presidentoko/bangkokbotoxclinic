import type { Place } from "./types";

// Module-level cache so RecommendedForYou, SurpriseMeButton, FavoritesClient,
// and CompareClient -- all client components that can render on the same
// page -- share one fetch of places-index.json instead of each downloading
// it separately.
let cached: Place[] | null = null;
let inFlight: Promise<Place[]> | null = null;

export function loadPlacesIndex(): Promise<Place[]> {
  if (cached) return Promise.resolve(cached);
  if (!inFlight) {
    // A rejected fetch (offline, transient 5xx, or a non-JSON error body
    // that res.json() throws on) used to stay cached as `inFlight` forever
    // -- every subsequent caller got the same dead promise and every
    // dependent feature (search, recommendations, surprise-me, favorites,
    // compare) stayed broken until a full page reload. Resetting `inFlight`
    // to null on failure lets the next call retry.
    inFlight = fetch("/places-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`places-index.json: HTTP ${res.status}`);
        return res.json() as Promise<Place[]>;
      })
      .then((all) => {
        cached = all;
        return all;
      })
      .catch((err) => {
        inFlight = null;
        throw err;
      });
  }
  return inFlight;
}
