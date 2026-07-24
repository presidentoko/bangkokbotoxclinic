// Assigns each place to the nearest of a fixed set of Bangkok district
// centroids — nearest-centroid clustering at city scale, not precise
// boundary polygons or a real geocoder. Coordinates are approximate; do not
// present this as survey-grade in any UI copy that consumes it.
const DISTRICTS = [
  { name: "Sukhumvit", lat: 13.7398, lng: 100.5645 },
  { name: "Silom & Sathorn", lat: 13.7248, lng: 100.5296 },
  { name: "Siam & Pathumwan", lat: 13.7466, lng: 100.5347 },
  { name: "Thonglor & Ekkamai", lat: 13.7307, lng: 100.5827 },
  { name: "Khao San & Old Town", lat: 13.759, lng: 100.4977 },
  { name: "Chinatown", lat: 13.7398, lng: 100.5088 },
  { name: "Chatuchak", lat: 13.8018, lng: 100.5537 },
  { name: "Ari", lat: 13.7797, lng: 100.5448 },
];

// Places farther than this from every centroid aren't confidently in any
// named district (e.g. outer suburbs) — left unassigned rather than forced
// into whichever centroid happens to be nearest.
const MAX_DIST_SQ = 0.04; // ~0.2 degrees, generous outer bound for greater Bangkok

/**
 * @param {number | null} lat
 * @param {number | null} lng
 * @returns {string | null}
 */
export function nearestDistrict(lat, lng) {
  if (lat == null || lng == null) return null;
  let best = null;
  let bestDistSq = Infinity;
  for (const d of DISTRICTS) {
    const distSq = (d.lat - lat) ** 2 + (d.lng - lng) ** 2;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      best = d.name;
    }
  }
  return bestDistSq <= MAX_DIST_SQ ? best : null;
}

export { DISTRICTS };
