import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ClinicsBundle, Clinic } from "./types";

// Categories that indicate non-medical hair businesses (barbers, wig shops, retail)
const BLOCKED_CATEGORIES = new Set([
  "wig shop",
  "health and beauty shop",
  "barber shop",
  "hair salon",
  "beauty supply store",
]);

// Name patterns for non-medical hair businesses
const BLOCKED_NAME_PATTERNS = [
  /barber/i,
  /wig\s/i,
  /hair\s+system/i,
];

function isHairClinicLike(c: Clinic): boolean {
  const cat = (c.category ?? "").toLowerCase();
  if (BLOCKED_CATEGORIES.has(cat)) return false;
  const name = (c.name ?? "").toLowerCase();
  if (BLOCKED_NAME_PATTERNS.some((p) => p.test(name))) return false;
  return true;
}

let cache: ClinicsBundle | null = null;

export function loadClinics(): ClinicsBundle {
  if (cache) return cache;
  const p = path.join(process.cwd(), "public", "data", "clinics.json");
  if (!fs.existsSync(p)) {
    cache = { generated_at: new Date().toISOString(), total: 0, avg_trust: 0, clinics: [] };
    return cache;
  }
  const raw = fs.readFileSync(p, "utf-8");
  const raw_bundle = JSON.parse(raw) as ClinicsBundle;
  const filtered = raw_bundle.clinics.filter(isHairClinicLike);
  cache = {
    ...raw_bundle,
    clinics: filtered,
    total: filtered.length,
    avg_trust: filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + (c.trust_score ?? 0), 0) / filtered.length)
      : 0,
  };
  return cache;
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.slug === slug);
}

export function getClinicById(id: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.id === id);
}
