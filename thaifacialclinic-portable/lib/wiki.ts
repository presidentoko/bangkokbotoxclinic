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

function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

// wiki_summaries/*.json은 ChIJ... place_id로 파일명이 붙어 있는데, clinics.json의
// clinic.id는 0x...:0x... CID 형식 — 두 포맷은 문자열 변환으로 서로 대응이 안 돼서
// id로 바로 파일을 찾으면 0건 매칭. 유일한 공통 키는 클리닉 이름뿐이라 이름 인덱스로 폴백.
let nameIndex: Map<string, WikiSummary> | null = null;

function getNameIndex(): Map<string, WikiSummary> {
  if (nameIndex) return nameIndex;
  nameIndex = new Map();
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return nameIndex;
  }
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(DIR, f), "utf-8");
      const summary = JSON.parse(raw) as WikiSummary;
      if (summary.name) nameIndex.set(normalizeName(summary.name), summary);
    } catch {
      // skip malformed file
    }
  }
  return nameIndex;
}

/** Sync loader — null if no wiki for that clinic yet. Tries id-as-filename first
 *  (works if the two datasets ever share a place_id format), falls back to a
 *  name-based index (see getNameIndex above) for the current CID/ChIJ mismatch. */
export function loadWikiSummary(clinicId: string, clinicName?: string): WikiSummary | null {
  const file = path.join(DIR, `${clinicId}.json`);
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, "utf-8");
      return JSON.parse(raw) as WikiSummary;
    } catch {
      // fall through to name-based lookup
    }
  }
  if (clinicName) {
    return getNameIndex().get(normalizeName(clinicName)) ?? null;
  }
  return null;
}

/** Hair site supports 5 langs — wiki data has only EN+TH. Pick best match. */
export function pickSummary(s: WikiSummary, lang: string = "en"): string {
  if (lang === "th") return s.summary_th || s.summary_en;
  return s.summary_en || s.summary_th;
}
