// Golf 어필리에이트 — Golfsavers + Sawasdee Bangkok Golf + Klook 어필리에이트.
// + Travel stack (hotel / flight / rentcar) — golf+stay 패키지 단가 가장 큼.
//
// 작동 방식:
//   1. `*_URL_TEMPLATE` env가 있으면 그걸 사용 (CJ/Awin/Impact 같은 redirect URL).
//      placeholder: {q} (검색쿼리), {city}, {origin}, {dest} (IATA), {target} (raw URL encoded).
//   2. 없으면 partner 사이트 직접 URL + AID query param.
//   3. AID도 없으면 plain search URL (트래킹 없음, 사용자한테는 똑같이 보임).
//
// 가입 방법은 repo 루트의 AFFILIATE_SETUP.md 참고.

// ── AID values (직접 쿼리 파라미터로 박는 partner 용) ────────────
const GOLFSAVERS_ID = process.env.NEXT_PUBLIC_GOLFSAVERS_AID || "";
const SAWASDEE_ID   = process.env.NEXT_PUBLIC_SAWASDEE_AID || "";
const KLOOK_ID      = process.env.NEXT_PUBLIC_KLOOK_AID || "";
const BOOKING_AID     = process.env.NEXT_PUBLIC_BOOKING_AID || "";
const AGODA_AID       = process.env.NEXT_PUBLIC_AGODA_AID || "";
const EXPEDIA_AID     = process.env.NEXT_PUBLIC_EXPEDIA_AID || "";
const TRIPCOM_AID     = process.env.NEXT_PUBLIC_TRIPCOM_AID || "";
const TRIPCOM_SID     = process.env.NEXT_PUBLIC_TRIPCOM_SID || "";   // publisher SID (numeric)
const TRIPCOM_SUB3    = process.env.NEXT_PUBLIC_TRIPCOM_SUB3 || "";  // optional deeplink code (D...)
const SKYSCANNER_AID  = process.env.NEXT_PUBLIC_SKYSCANNER_AID || "";
const RENTALCARS_AID  = process.env.NEXT_PUBLIC_RENTALCARS_AID || "";

// ── URL template overrides (CJ / Awin / Impact 같은 redirect 필요한 partner) ──
const GOLFSAVERS_T  = process.env.NEXT_PUBLIC_GOLFSAVERS_URL_TEMPLATE || "";
const SAWASDEE_T    = process.env.NEXT_PUBLIC_SAWASDEE_URL_TEMPLATE || "";
const KLOOK_T       = process.env.NEXT_PUBLIC_KLOOK_URL_TEMPLATE || "";
const BOOKING_T     = process.env.NEXT_PUBLIC_BOOKING_URL_TEMPLATE || "";
const AGODA_T       = process.env.NEXT_PUBLIC_AGODA_URL_TEMPLATE || "";
const EXPEDIA_T     = process.env.NEXT_PUBLIC_EXPEDIA_URL_TEMPLATE || "";
const TRIPCOM_T     = process.env.NEXT_PUBLIC_TRIPCOM_URL_TEMPLATE || "";
const SKYSCANNER_T  = process.env.NEXT_PUBLIC_SKYSCANNER_URL_TEMPLATE || "";
const RENTALCARS_T  = process.env.NEXT_PUBLIC_RENTALCARS_URL_TEMPLATE || "";

// Substitute placeholders into a partner-supplied URL template.
function fillTemplate(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, encodeURIComponent(v));
    // Also support already-encoded placeholders (e.g. {target_raw} = encoded version)
    out = out.replaceAll(`{${k}_raw}`, v);
  }
  return out;
}

// Wrap any target URL via a redirect template (when partner uses CJ/Awin redirect).
function wrapRedirect(template: string, targetUrl: string, extra: Record<string, string> = {}): string {
  return fillTemplate(template, { target: targetUrl, ...extra });
}


// ── Golf-booking partners ─────────────────────────────────────
export function golfsaversSearch(query: string): string {
  const direct = new URL("https://www.golfsavers.com/search/");
  direct.searchParams.set("q", query);
  if (GOLFSAVERS_ID) direct.searchParams.set("ref", GOLFSAVERS_ID);
  if (GOLFSAVERS_T) return wrapRedirect(GOLFSAVERS_T, direct.toString(), { q: query });
  return direct.toString();
}

/**
 * Returns null unless a real partner URL is configured.
 *
 * The fallback used to be https://www.sawasdeebangkokgolf.com/search/, which
 * does not resolve — the domain has never existed. It was rendered on every
 * city, cuisine and comparison page inside a card headed "Booking partners ·
 * sponsored", above a line promising a commission on bookings made through it.
 * A dead link is bad; a dead link presented as a commercial partnership is a
 * claim about a relationship with a company that is not there.
 *
 * The closest real operator is sawadeegolf.com — different spelling, and it
 * states plainly that it sells no tee times and takes no commission, so it is
 * not a substitute. Rather than delete the slot and lose the wiring, the
 * partner now appears only once NEXT_PUBLIC_SAWASDEE_URL_TEMPLATE (or an
 * affiliate id plus NEXT_PUBLIC_SAWASDEE_BASE) names somewhere real.
 */
export function sawasdeeSearch(query: string): string | null {
  const base = process.env.NEXT_PUBLIC_SAWASDEE_BASE || "";
  if (SAWASDEE_T) {
    const target = base ? `${base.replace(/\/$/, "")}/search/?query=${encodeURIComponent(query)}` : "";
    return wrapRedirect(SAWASDEE_T, target, { q: query });
  }
  if (!base) return null;
  const direct = new URL(`${base.replace(/\/$/, "")}/search/`);
  direct.searchParams.set("query", query);
  if (SAWASDEE_ID) direct.searchParams.set("aff", SAWASDEE_ID);
  return direct.toString();
}

export function klookSearchLink(query: string): string {
  if (KLOOK_T) {
    return fillTemplate(KLOOK_T, { q: `${query} golf`, target: `https://www.klook.com/en-US/search/result/?keyword=${encodeURIComponent(query + " golf")}` });
  }
  const url = new URL("https://www.klook.com/en-US/search/result/");
  url.searchParams.set("keyword", `${query} golf`);
  if (KLOOK_ID) {
    // Klook native query param — verified by their affiliate dashboard
    url.searchParams.set("aid", KLOOK_ID);
    url.searchParams.set("aff_adid", "thailandgolf");
  }
  return url.toString();
}


// ── Hotel (golf+stay 패키지 = commission 가장 큼) ───────────────
export function bookingHotelSearch(city: string): string {
  const url = new URL("https://www.booking.com/searchresults.html");
  url.searchParams.set("ss", `${city}, Thailand`);
  url.searchParams.set("nflt", "ht_id%3D204"); // hotel filter
  if (BOOKING_AID) url.searchParams.set("aid", BOOKING_AID);
  if (BOOKING_T) return wrapRedirect(BOOKING_T, url.toString(), { city });
  return url.toString();
}

export function agodaHotelSearch(city: string): string {
  // Agoda 는 한국인 골프 여행객이 가장 많이 쓰는 채널
  const url = new URL("https://www.agoda.com/search");
  url.searchParams.set("searchTerm", `${city}, Thailand`);
  if (AGODA_AID) url.searchParams.set("cid", AGODA_AID);
  if (AGODA_T) return wrapRedirect(AGODA_T, url.toString(), { city });
  return url.toString();
}

export function expediaHotelSearch(city: string): string {
  const url = new URL("https://www.expedia.com/Hotel-Search");
  url.searchParams.set("destination", `${city}, Thailand`);
  // Expedia 실제 트래킹은 partnerize/Impact redirect를 통해서 들어옴 — clickref만 박으면 안 잡힘.
  // 그러니까 EXPEDIA_T 환경변수를 채워 쓰는 게 정석.
  if (EXPEDIA_AID) url.searchParams.set("clickref", EXPEDIA_AID);
  if (EXPEDIA_T) return wrapRedirect(EXPEDIA_T, url.toString(), { city });
  return url.toString();
}


// ── Flight (한국→방콕/푸켓/치앙마이 등 메인 루트) ───────────────
export function tripcomFlightSearch(destCity: string, originIATA = "ICN"): string {
  const destIATA = AIRPORT_CODE[destCity.toLowerCase()] || "BKK";
  const url = new URL("https://www.trip.com/flights/showfaresearch");
  url.searchParams.set("dcity", originIATA.toLowerCase());
  url.searchParams.set("acity", destIATA.toLowerCase());
  if (TRIPCOM_AID) {
    // Trip.com uses capitalized `Allianceid` + `SID` per their docs (case sensitive in some flows)
    url.searchParams.set("Allianceid", TRIPCOM_AID);
    if (TRIPCOM_SID) url.searchParams.set("SID", TRIPCOM_SID);
    if (TRIPCOM_SUB3) url.searchParams.set("trip_sub3", TRIPCOM_SUB3);
    // sub1/sub2 reserved for per-page tracking — surface destination city
    url.searchParams.set("trip_sub1", `flight-${originIATA}-${destIATA}`);
  }
  if (TRIPCOM_T) return wrapRedirect(TRIPCOM_T, url.toString(), { origin: originIATA, dest: destIATA });
  return url.toString();
}

export function skyscannerFlightSearch(destCity: string, originIATA = "ICN"): string {
  const destIATA = AIRPORT_CODE[destCity.toLowerCase()] || "BKK";
  const url = new URL(
    `https://www.skyscanner.com/transport/flights/${originIATA.toLowerCase()}/${destIATA.toLowerCase()}/`,
  );
  // Skyscanner direct param doesn't track — must use partnerize redirect URL
  if (SKYSCANNER_AID) url.searchParams.set("associateid", SKYSCANNER_AID);
  if (SKYSCANNER_T) return wrapRedirect(SKYSCANNER_T, url.toString(), { origin: originIATA, dest: destIATA });
  return url.toString();
}

// 태국 주요 골프 도시 → 가까운 IATA 공항코드
const AIRPORT_CODE: Record<string, string> = {
  bangkok:               "BKK",
  pathum_thani:          "BKK",
  nonthaburi:            "BKK",
  samut_prakan:          "BKK",
  nakhon_pathom:         "BKK",
  phra_nakhon_si_ayutthaya: "BKK",
  chon_buri:             "BKK", // 파타야 — UTP(우타파오) 있지만 한국 직항 거의 없음
  rayong:                "UTP",
  prachuap_khiri_khan:   "HHQ", // Hua Hin 공항 (한국 직항 없음, 방콕 경유)
  phuket:                "HKT",
  chiang_mai:            "CNX",
  chiang_rai:            "CEI",
  koh_samui:             "USM",
  krabi:                 "KBV",
  surat_thani:           "URT",
  hat_yai:               "HDY",
  udon_thani:            "UTH",
  khon_kaen:             "KKC",
  nakhon_ratchasima:     "NAK", // Korat
};

// 한국 출발이 아닌 다른 origin (일본 NRT, 영국 LHR 등) 옵션
export function tripcomFlightFromOrigin(destCity: string, originIATA: string): string {
  return tripcomFlightSearch(destCity, originIATA);
}


// ── Rental car / transfer ─────────────────────────────────────
export function rentalcarsSearch(city: string): string {
  const url = new URL("https://www.rentalcars.com/SearchResults.do");
  url.searchParams.set("locationName", `${city}, Thailand`);
  // Rentalcars (Booking Holdings) uses `aid` like Booking.com — `affiliateCode` is wrong param
  if (RENTALCARS_AID) url.searchParams.set("aid", RENTALCARS_AID);
  if (RENTALCARS_T) return wrapRedirect(RENTALCARS_T, url.toString(), { city });
  return url.toString();
}

export function klookTransferSearch(city: string): string {
  if (KLOOK_T) {
    return fillTemplate(KLOOK_T, { q: `${city} airport transfer`, target: `https://www.klook.com/en-US/search/result/?keyword=${encodeURIComponent(city + " airport transfer")}` });
  }
  const url = new URL("https://www.klook.com/en-US/search/result/");
  url.searchParams.set("keyword", `${city} airport transfer`);
  if (KLOOK_ID) {
    url.searchParams.set("aid", KLOOK_ID);
    url.searchParams.set("aff_adid", "thailandgolf-transfer");
  }
  return url.toString();
}


// ── Tracking helpers ──────────────────────────────────────────
export function trackingParams(source: string, medium = "internal"): string {
  return `utm_source=${source}&utm_medium=${medium}&utm_campaign=thailandgolf`;
}

// Diagnostic — surface in /about or methodology to confirm config state without leaking IDs
export function affiliateConfigStatus(): { partner: string; mode: "template" | "aid" | "fallback" }[] {
  return [
    { partner: "Golfsavers",  mode: GOLFSAVERS_T ? "template" : GOLFSAVERS_ID ? "aid" : "fallback" },
    { partner: "Sawasdee",    mode: SAWASDEE_T   ? "template" : SAWASDEE_ID   ? "aid" : "fallback" },
    { partner: "Klook",       mode: KLOOK_T      ? "template" : KLOOK_ID      ? "aid" : "fallback" },
    { partner: "Booking.com", mode: BOOKING_T    ? "template" : BOOKING_AID   ? "aid" : "fallback" },
    { partner: "Agoda",       mode: AGODA_T      ? "template" : AGODA_AID     ? "aid" : "fallback" },
    { partner: "Expedia",     mode: EXPEDIA_T    ? "template" : EXPEDIA_AID   ? "aid" : "fallback" },
    { partner: "Trip.com",    mode: TRIPCOM_T    ? "template" : TRIPCOM_AID   ? "aid" : "fallback" },
    { partner: "Skyscanner",  mode: SKYSCANNER_T ? "template" : SKYSCANNER_AID? "aid" : "fallback" },
    { partner: "Rentalcars",  mode: RENTALCARS_T ? "template" : RENTALCARS_AID? "aid" : "fallback" },
  ];
}
