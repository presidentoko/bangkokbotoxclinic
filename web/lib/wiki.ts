// Wiki summary loader — wiki_generator/summary_generator.py 가 생성한
// web/data/wiki_summaries/<clinic_id>.json 을 server-side 로드.
import { promises as fs } from "node:fs";
import path from "node:path";

export type WikiSummary = {
  clinic_id: string;
  name: string;
  summary_th: string;
  summary_en: string;
  model: string;
  generated_at: string;
};

const DIR = path.join(process.cwd(), "data", "wiki_summaries");

/** 단일 클리닉의 wiki 요약 로드. 파일 없으면 null. */
export async function loadWikiSummary(clinicId: string): Promise<WikiSummary | null> {
  const file = path.join(DIR, `${clinicId}.json`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as WikiSummary;
  } catch {
    return null;
  }
}

/** locale-aware 요약 선택. lang === "th" → TH, 그 외 → EN. */
export function pickSummary(s: WikiSummary, lang: string = "en"): string {
  if (lang === "th") return s.summary_th || s.summary_en;
  return s.summary_en || s.summary_th;
}
