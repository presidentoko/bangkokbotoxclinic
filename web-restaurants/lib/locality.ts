// Best-effort locality label for restaurants whose `district` field is blank
// (1,232 of 2,013 restaurants — 61%). The scraped `address` string usually
// still contains a real, searchable administrative area (e.g. "Bang Lamung
// District", "Amphoe Sattahip") that our curated 30-district taxonomy just
// doesn't have a hub page for. Surfacing it as plain text (title/meta/header)
// closes an exact-match relevance gap for district-qualified searches — e.g.
// "mama garden bang lamung district" — without a routing risk, since this is
// never used to build a `/d/...` link (only the curated `r.district` is).
//
// DISTRICT is the ~30-value curated taxonomy `/d/[district]` hub pages exist
// for; a locality string from this file is NEVER a valid slug for that route.

const DISTRICT_SUFFIX = /([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)\sDistrict\b/;
const AMPHOE_PREFIX = /\bAmphoe\s([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+)*)/;

export function deriveLocalityFromAddress(address: string): string | null {
  const districtMatch = address.match(DISTRICT_SUFFIX);
  if (districtMatch) return `${districtMatch[1]} District`;

  const amphoeMatch = address.match(AMPHOE_PREFIX);
  if (amphoeMatch) return `${amphoeMatch[1]} District`;

  if (/Pattaya City/.test(address)) return "Pattaya City";

  return null;
}
