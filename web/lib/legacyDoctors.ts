import data from "../data/legacy-doctors.json";

/**
 * Doctor URLs whose doctor is gone from the data.
 *
 * `/doctor/<name>-at-<clinic name>` was the shape until 2026-07-31. For a
 * doctor still in master_db, legacyDoctorSlugMap() in lib/data.ts redirects the
 * old URL to the current one. This file covers the rest: a doctor whose name
 * stopped appearing in the clinic's reviews leaves `doctor_stats` entirely, and
 * nothing in the live data can name their URL again.
 *
 * A pattern rule cannot reach them either — both halves of the slug contain
 * hyphens, so a wildcard cannot tell where the name ends and the clinic begins.
 * Naming the clinic literally would mean one rule per clinic, 1,868 of them,
 * in a route table that has already hit Vercel's 2,048 cap once.
 *
 * So the slugs are enumerated instead, out of git history, which still holds
 * every pre-change revision of master_db:
 * scripts/build_legacy_doctor_map.py. 905 URLs, each mapped to the clinic it
 * named — the page a visitor following a two-month-old link actually wants.
 */

interface LegacyDoctorFile {
  generated: string;
  revisions: number;
  note: string;
  /** legacy slug → clinic id */
  doctors: Record<string, string>;
}

const file = data as LegacyDoctorFile;

/** Slugs carry Thai (clinic names are not all Latin) and arrive percent-encoded. */
function normalize(slug: string): string {
  let s = slug;
  try { s = decodeURIComponent(s); } catch { /* malformed — compare the raw form */ }
  return s.normalize("NFC").toLowerCase().replace(/\/+$/, "");
}

const index = new Map<string, string>();
for (const [slug, clinicId] of Object.entries(file.doctors)) {
  index.set(normalize(slug), clinicId);
}

/** The clinic a vanished doctor's URL belonged to, or null. */
export function legacyDoctorClinicId(slug: string): string | null {
  return index.get(normalize(slug)) ?? null;
}

export const LEGACY_DOCTOR_COUNT = index.size;
