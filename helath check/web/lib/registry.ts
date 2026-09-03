// Thailand's official hospital register.
//
// Until now the site knew only what Google Maps said about 321 businesses in
// and around Bangkok — a third of them salons, labs and spas — and had no way
// to tell a reader whether any given listing is a licensed hospital at all.
//
// registry.json is the register itself: 1,491 hospitals in all 77 provinces,
// each with its Ministry of Public Health hospital code, its sector, its type,
// and its HA accreditation level with the dates it was granted and lapses.
// Source files and the script that builds it live in ../../registry/ and
// ../../build_registry.py, and every field on this page is attributable to one
// of the two named datasets.
//
// hospital_profiles.json is the derived sidecar: which of our pages matched a
// register row (built by ../../match_registry.py, deliberately conservative —
// a badge on the wrong hospital is worse than no badge), which are not medical
// facilities, and each hospital's nearest neighbours computed from the
// coordinates we already hold.
//
// Both are separate files on purpose. checkup_db.json is regenerated wholesale
// by export_to_json.py, so anything written into it is erased on the next data
// refresh.

import registryRaw from "@/data/registry.json";
import profilesRaw from "@/data/hospital_profiles.json";

export type HaLevel =
  | "standard"
  | "advanced"
  | "step1"
  | "step2"
  | "none"
  | "renewing"
  | "in-progress"
  | "unknown";

export type RegistryHospital = {
  hcode: string | null;
  name_th: string;
  province_th: string;
  province_en: string;
  province_slug: string;
  region: string | null;
  sector: string;
  affiliation_th: string | null;
  type_th: string | null;
  type_en: string | null;
  ha_level: HaLevel;
  ha_level_en: string;
  ha_level_th: string | null;
  ha_accredited_on: string | null;
  ha_expires_on: string | null;
  ha_current: boolean | null;
  beds: number | null;
  tel: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  address_th: string | null;
  district_th: string | null;
};

export type RegistryProvince = {
  slug: string;
  name_en: string;
  name_th: string;
  count: number;
};

export type RegistrySource = {
  name: string;
  name_th: string;
  url: string;
  file: string;
  downloaded: string;
  provides: string;
};

type RegistryFile = {
  generated_at: string;
  sources: RegistrySource[];
  total: number;
  provinces: RegistryProvince[];
  hospitals: RegistryHospital[];
};

export type RegistryMatch = {
  hcode: string | null;
  name_th: string;
  province_slug: string;
  province_en: string;
  sector: string;
  type_en: string | null;
  type_th: string | null;
  ha_level: HaLevel;
  ha_level_en: string;
  ha_accredited_on: string | null;
  ha_expires_on: string | null;
  ha_current: boolean | null;
  beds: number | null;
  match_score: number;
};

export type NearbyHospital = {
  slug: string;
  name: string;
  km: number;
  rating: string | number | null;
  city: string | null;
};

type ProfilesFile = {
  generated_at: string;
  registry_match: Record<string, RegistryMatch>;
  nearby: Record<string, NearbyHospital[]>;
  province: Record<string, string>;
  non_medical: string[];
};

const registry = registryRaw as unknown as RegistryFile;
const profiles = profilesRaw as unknown as ProfilesFile;

const bySlug = new Map(registry.provinces.map((p) => [p.slug, p]));
const byProvince = new Map<string, RegistryHospital[]>();
for (const h of registry.hospitals) {
  const list = byProvince.get(h.province_slug);
  if (list) list.push(h);
  else byProvince.set(h.province_slug, [h]);
}
const nonMedical = new Set(profiles.non_medical);

export function registryGeneratedAt(): string {
  return registry.generated_at;
}

export function registrySources(): RegistrySource[] {
  return registry.sources;
}

export function registryTotal(): number {
  return registry.total;
}

/** Provinces that actually have registered hospitals, most first. */
export function registryProvinces(): RegistryProvince[] {
  return registry.provinces.filter((p) => p.count > 0);
}

export function registryProvince(slug: string): RegistryProvince | null {
  const p = bySlug.get(slug);
  return p && p.count > 0 ? p : null;
}

export function registryHospitals(provinceSlug: string): RegistryHospital[] {
  return byProvince.get(provinceSlug) ?? [];
}

/** The register row this page was matched to, or null when unmatched. */
export function registryMatch(slug: string): RegistryMatch | null {
  return profiles.registry_match[slug] ?? null;
}

export function nearbyHospitals(slug: string): NearbyHospital[] {
  return profiles.nearby[slug] ?? [];
}

/** Province slug resolved from the address, which is more reliable than the
 *  scraped `city` (24 rows say Bangkok over an address in another province). */
export function provinceOf(slug: string): string | null {
  return profiles.province[slug] ?? null;
}

/**
 * Whether a listing is a medical facility at all.
 *
 * Google's category on 56 of our rows is Beauty salon, Spa, Massage, Nail
 * salon or similar. They were being listed, sitemapped and offered as "nearby
 * hospitals" alongside Bumrungrad. They keep their pages — someone searching
 * the name should still find the address — but they are out of the hospital
 * directory and out of the sitemap.
 */
export function isMedicalFacility(slug: string): boolean {
  return !nonMedical.has(slug);
}

export function haBadge(level: HaLevel): { label: string; tone: "green" | "blue" | "amber" | "gray" } {
  switch (level) {
    case "advanced":
      return { label: "Advanced HA accreditation", tone: "green" };
    case "standard":
      return { label: "HA accredited", tone: "green" };
    case "step2":
      return { label: "HA step 2 (developing)", tone: "blue" };
    case "step1":
      return { label: "HA step 1 (developing)", tone: "blue" };
    case "renewing":
      return { label: "HA renewal in progress", tone: "amber" };
    case "in-progress":
      return { label: "HA accreditation in progress", tone: "amber" };
    case "none":
      return { label: "On the register, not accredited", tone: "gray" };
    default:
      return { label: "Status not published", tone: "gray" };
  }
}

export function formatRegistryDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
