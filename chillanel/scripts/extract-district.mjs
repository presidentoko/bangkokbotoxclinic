// Assigns each place to the nearest of a fixed set of per-city area
// centroids — nearest-centroid clustering at city scale, not precise
// boundary polygons or a real geocoder. Coordinates are approximate; do not
// present this as survey-grade in any UI copy that consumes it.
//
// One table per scraped city (see build-data.mjs's --city). Was Bangkok-only
// for a long time: Pattaya/Phuket places always fell back to the Bangkok
// centroids, which sit >100km away, so every place in those two cities
// scored past MAX_DIST_SQ and got district=null -- no area-browsing loop at
// all for 2 of the site's 3 cities. City must now be passed explicitly
// rather than defaulting to Bangkok's table, so a future 4th city without
// its own entry here fails loud (returns null for everyone, same as
// Pattaya/Phuket did) instead of silently getting mis-clustered into
// Bangkok's neighborhoods.
const DISTRICTS_BY_CITY = {
  bangkok: [
    { name: "Sukhumvit", lat: 13.7398, lng: 100.5645 },
    { name: "Silom & Sathorn", lat: 13.7248, lng: 100.5296 },
    { name: "Siam & Pathumwan", lat: 13.7466, lng: 100.5347 },
    { name: "Thonglor & Ekkamai", lat: 13.7307, lng: 100.5827 },
    { name: "Khao San & Old Town", lat: 13.759, lng: 100.4977 },
    { name: "Chinatown", lat: 13.7398, lng: 100.5088 },
    { name: "Chatuchak", lat: 13.8018, lng: 100.5537 },
    { name: "Ari", lat: 13.7797, lng: 100.5448 },
  ],
  pattaya: [
    { name: "Central Pattaya", lat: 12.9351, lng: 100.8871 },
    { name: "Walking Street & South Pattaya", lat: 12.9236, lng: 100.8783 },
    { name: "Jomtien", lat: 12.8956, lng: 100.8756 },
    { name: "North Pattaya & Naklua", lat: 12.9622, lng: 100.8877 },
    { name: "Pratumnak Hill", lat: 12.9137, lng: 100.8712 },
  ],
  phuket: [
    { name: "Patong", lat: 7.8965, lng: 98.2966 },
    { name: "Karon", lat: 7.8467, lng: 98.2941 },
    { name: "Kata", lat: 7.8202, lng: 98.2966 },
    { name: "Phuket Town", lat: 7.8804, lng: 98.3923 },
    { name: "Rawai", lat: 7.7783, lng: 98.3181 },
    { name: "Kamala", lat: 7.9539, lng: 98.2825 },
    { name: "Bang Tao", lat: 7.9925, lng: 98.2933 },
    { name: "Chalong", lat: 7.8419, lng: 98.3381 },
  ],
};

// Places farther than this from every centroid aren't confidently in any
// named district (e.g. outer suburbs) — left unassigned rather than forced
// into whichever centroid happens to be nearest.
const MAX_DIST_SQ = 0.04; // ~0.2 degrees, generous outer bound for greater Bangkok/Pattaya/Phuket

/**
 * @param {number | null} lat
 * @param {number | null} lng
 * @param {string} city
 * @returns {string | null}
 */
export function nearestDistrict(lat, lng, city) {
  if (lat == null || lng == null) return null;
  const districts = DISTRICTS_BY_CITY[city];
  if (!districts) return null;
  let best = null;
  let bestDistSq = Infinity;
  for (const d of districts) {
    const distSq = (d.lat - lat) ** 2 + (d.lng - lng) ** 2;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = d.name;
    }
  }
  return bestDistSq <= MAX_DIST_SQ ? best : null;
}
