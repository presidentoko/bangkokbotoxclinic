// Wiki summary loader — wiki_generator/summary_generator.py 가 생성한 양국어 요약.
// 데이터: thaifacialclinic-portable/public/data/wiki_summaries/<clinic_id>.json
// 매칭: name-based (web's 0x-id wikis remapped to hair's ChIJ-id during port).

import "server-only";
import fs from "node:fs";
import path from "node:path";

export type WikiSummary = {
  clinic_id: string;
  name: string;
  summary_th: string;
  summary_en: string;
  model: string;
  generated_at: string;
};

const DIR = path.join(process.cwd(), "public", "data", "wiki_summaries");

/** Sync loader — null if no wiki for that clinic yet. */
export function loadWikiSummary(clinicId: string): WikiSummary | null {
  const file = path.join(DIR, `${clinicId}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw) as WikiSummary;
  } catch {
    return null;
  }
}

/** Hair site supports 5 langs — wiki data has only EN+TH. Pick best match. */
export function pickSummary(s: WikiSummary, lang: string = "en"): string {
  if (lang === "th") return s.summary_th || s.summary_en;
  return s.summary_en || s.summary_th;
}
