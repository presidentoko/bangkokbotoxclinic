import { CATEGORY_LABELS } from "./types";

// Single source of truth for which category/city slugs actually get a /th/ page built.
// Used both by the /th/* pages themselves (generateStaticParams) and by the EN pages'
// generateMetadata (to avoid emitting a th-TH hreflang alternate that 404s).

// 예전에는 손으로 고른 7개뿐이라 /th/c/plastic 같은 12개 업종이 404 였고, 태국어
// 스위처는 그 페이지들에서 /th 홈으로 떨어졌다. 업종 라벨은 태국어가 전부 있다.
export const TH_CATEGORY_VALID = new Set(Object.keys(CATEGORY_LABELS));

// Regenerated from master_db.json on every build (scripts/build_db_stats.mts):
// every province with 30+ suppliers, plus Si Racha and Map Ta Phut. It used to be
// a hand-written list of 11 that never grew with the dataset, so Thai-language
// demand landed on 404s — Search Console recorded 63 impressions for
// คลังสินค้า ขอนแก่น while /th/city/khon_kaen did not exist.
import thCities from "./thCities.json";

export const TH_CITY_VALID = new Set<string>(thCities);
