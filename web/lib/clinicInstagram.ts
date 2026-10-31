// 클리닉 인스타 계정 — 서버 전용. scripts/build_clinic_instagram.py 가 만든 표가 먼저,
// 없으면 master_db 의 website_instagram (웹사이트 칸이 인스타 링크인 곳).

import table from "@/data/clinic_instagram.json";
import { igHandle } from "./auctionText";
import type { Clinic } from "./types";

const BY_ID = table as Record<string, string>;

export function clinicInstagram(c: Pick<Clinic, "id" | "website_instagram"> | undefined): string | null {
  if (!c) return null;
  return igHandle(BY_ID[c.id]) ?? igHandle(c.website_instagram);
}
