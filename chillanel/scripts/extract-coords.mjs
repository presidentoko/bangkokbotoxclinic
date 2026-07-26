// The clinics CSV's own latitude/longitude columns are empty for every
// scraped row (0/734 in the live Bangkok dataset — see Phase 0), but the
// scraper still captures a Google Maps share URL per place, and that URL
// embeds the pin's coordinates in a `!3d{lat}!4d{lng}` segment regardless.
// This recovers them with no new scraping — verified 734/734 parseable
// against the live dataset, all within greater-Bangkok bounds.
const COORD_RE = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;

/**
 * @param {string | null | undefined} url
 * @returns {{ lat: number, lng: number } | null}
 */
export function parseCoordsFromMapsUrl(url) {
  if (!url) return null;
  const m = url.match(COORD_RE);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
