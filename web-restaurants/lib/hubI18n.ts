import type { Locale } from "./locale";
import { CUISINE_LABELS } from "./types";

const CUISINE_LABELS_I18N: Record<string, Partial<Record<Locale, string>>> = {
  thai:        { ko: "태국 음식",     th: "อาหารไทย" },
  street_food: { ko: "길거리 음식",   th: "อาหารข้างทาง" },
  japanese:    { ko: "일식",          th: "อาหารญี่ปุ่น" },
  korean:      { ko: "한식",          th: "อาหารเกาหลี" },
  chinese:     { ko: "중식",          th: "อาหารจีน" },
  italian:     { ko: "이탈리안",      th: "อาหารอิตาเลียน" },
  indian:      { ko: "인도 음식",     th: "อาหารอินเดีย" },
  vietnamese:  { ko: "베트남 음식",   th: "อาหารเวียดนาม" },
  seafood:     { ko: "해산물",        th: "อาหารทะเล" },
  buffet:      { ko: "뷔페",          th: "บุฟเฟต์" },
  cafe:        { ko: "카페",          th: "คาเฟ่" },
  bakery:      { ko: "베이커리",      th: "เบเกอรี่" },
  bar_pub:     { ko: "바 / 펍",       th: "บาร์ / ผับ" },
  fine_dining: { ko: "파인다이닝",    th: "ไฟน์ไดนิ่ง" },
  vegetarian:  { ko: "채식",          th: "มังสวิรัติ" },
  halal:       { ko: "할랄",          th: "ฮาลาล" },
  dessert:     { ko: "디저트",        th: "ของหวาน" },
  western:     { ko: "양식",          th: "อาหารตะวันตก" },
  fusion:      { ko: "퓨전",          th: "ฟิวชัน" },
  breakfast:   { ko: "브런치 / 조식", th: "อาหารเช้า / บรันช์" },
};

export function cuisineLabel(cuisine: string, locale: Locale): string {
  if (locale === "en") return CUISINE_LABELS[cuisine] ?? cuisine;
  return CUISINE_LABELS_I18N[cuisine]?.[locale] ?? CUISINE_LABELS[cuisine] ?? cuisine;
}

type CuisineCopy = {
  home: string;
  heading: (label: string) => string;
  intro: (count: number) => string;
  byDistrict: (label: string) => string;
  districtPill: (label: string, district: string) => string;
  top: (n: number) => string;
  more: (n: number) => string;
};

type DistrictCopy = {
  home: string;
  heading: (district: string) => string;
  intro: (count: number, district: string) => string;
  showingTop: (count: number) => string;
};

type CityCopy = {
  home: string;
  heading: (display: string) => string;
  intro: (count: number, display: string) => string;
  byCuisine: string;
  byDistrict: string;
  top: (n: number) => string;
};

export const CUISINE_HUB_COPY: Record<"th" | "ko", CuisineCopy> = {
  th: {
    home: "หน้าหลัก",
    heading: (label) => `ร้าน${label}`,
    intro: (count) => `ร้าน${count.toLocaleString()} แห่งในกรุงเทพฯ และพัทยา จัดอันดับด้วย Trust Score จากรีวิว Google จริง`,
    byDistrict: (label) => `${label} แยกตามเขต`,
    districtPill: (label, district) => `${label} ย่าน ${district}`,
    top: (n) => `อันดับ ${n} อันดับแรก`,
    more: (n) => `อีก ${n.toLocaleString()} ร้าน — ดูตามเขตเพื่อดูเพิ่มเติม`,
  },
  ko: {
    home: "홈",
    heading: (label) => `${label} 맛집`,
    intro: (count) => `방콕·파타야 ${count.toLocaleString()}곳, 실제 구글 리뷰 기반 Trust Score로 랭킹.`,
    byDistrict: (label) => `지역별 ${label}`,
    districtPill: (label, district) => `${district}의 ${label}`,
    top: (n) => `상위 ${n}곳`,
    more: (n) => `${n.toLocaleString()}곳 더 있어요 — 지역 페이지에서 확인하세요.`,
  },
};

export const DISTRICT_HUB_COPY: Record<"th" | "ko", DistrictCopy> = {
  th: {
    home: "หน้าหลัก",
    heading: (district) => `ร้านอาหารย่าน ${district}`,
    intro: (count, district) => `ร้านอาหาร ${count.toLocaleString()} แห่งทุกประเภทในย่าน ${district}`,
    showingTop: (count) => `แสดง 200 อันดับแรกจากทั้งหมด ${count.toLocaleString()} ร้าน ใช้ตัวกรองประเภทอาหารเพื่อจำกัดผลลัพธ์`,
  },
  ko: {
    home: "홈",
    heading: (district) => `${district} 맛집`,
    intro: (count, district) => `${district} 지역 전체 요리 ${count.toLocaleString()}곳.`,
    showingTop: (count) => `총 ${count.toLocaleString()}곳 중 상위 200곳 표시. 요리 종류 필터로 좁혀보세요.`,
  },
};

export const CITY_HUB_COPY: Record<"th" | "ko", CityCopy> = {
  th: {
    home: "หน้าหลัก",
    heading: (display) => `ร้านอาหาร${display}`,
    intro: (count, display) => `ร้านอาหาร ${count.toLocaleString()} แห่งใน${display} จัดอันดับด้วย Trust Score`,
    byCuisine: "ตามประเภทอาหาร",
    byDistrict: "ตามเขต",
    top: (n) => `อันดับ ${n} อันดับแรก`,
  },
  ko: {
    home: "홈",
    heading: (display) => `${display} 맛집`,
    intro: (count, display) => `${display} ${count.toLocaleString()}곳, Trust Score 기준 랭킹.`,
    byCuisine: "요리별 보기",
    byDistrict: "지역별 보기",
    top: (n) => `상위 ${n}곳`,
  },
};
