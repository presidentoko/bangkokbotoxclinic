import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ClinicsBundle, Clinic } from "./types";

let cache: ClinicsBundle | null = null;

export function loadClinics(): ClinicsBundle {
  if (cache) return cache;
  const p = path.join(process.cwd(), "public", "data", "clinics.json");
  if (!fs.existsSync(p)) {
    cache = { generated_at: new Date().toISOString(), total: 0, avg_trust: 0, clinics: [] };
    return cache;
  }
  const raw = fs.readFileSync(p, "utf-8");
  cache = JSON.parse(raw) as ClinicsBundle;
  return cache;
}

export function getClinicBySlug(slug: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.slug === slug);
}

export function getClinicById(id: string): Clinic | undefined {
  return loadClinics().clinics.find((c) => c.id === id);
}
