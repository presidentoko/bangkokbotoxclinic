// 클리닉별 자동 FAQ 생성 — AEO 핵심.
// Google PAA(People Also Ask) 패턴 + LLM 인용 친화 구조.
// Pantip 토픽 제목을 활용해 "사람들이 실제로 묻는 질문" 으로 변환.
import type { Clinic } from "./types";
import { CATEGORY_LABELS } from "./types";

export type Faq = { q: string; a: string };

type PantipMention = {
  title: string;
  url: string;
  score: number;
};

type ClinicWithPantip = Clinic & {
  pantip?: {
    mention_count?: number;
    branch_specific_count?: number;
    top_mentions?: PantipMention[];
  };
};

/** 가격 범위 텍스트 (예: "฿1,500–฿8,900"). */
function formatPriceRange(prices?: { current_price?: number }[]): string | null {
  if (!prices || prices.length === 0) return null;
  const nums = prices
    .map((p) => p.current_price)
    .filter((n): n is number => typeof n === "number" && n > 0);
  if (nums.length === 0) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (min === max) return `฿${min.toLocaleString()}`;
  return `฿${min.toLocaleString()}–฿${max.toLocaleString()}`;
}

/** 카테고리 한글/영문 라벨 (사람이 읽기 좋게). */
function categoryWords(cats: string[]): string {
  if (!cats.length) return "general care";
  return cats.map((c) => CATEGORY_LABELS[c] ?? c).slice(0, 3).join(", ");
}

/** 클리닉별 FAQ 자동 생성. 데이터에 따라 4-8개 Q&A. */
export function buildClinicFaqs(clinic: ClinicWithPantip): Faq[] {
  const faqs: Faq[] = [];
  const name = clinic.name;
  const loc = clinic.district
    ? `${clinic.district}, ${clinic.city_label || "Bangkok"}`
    : (clinic.city_label || "Bangkok");

  // Q1: 위치
  faqs.push({
    q: `Where is ${name} located?`,
    a: clinic.address
      ? `${name} is located at ${clinic.address}. Phone: ${clinic.phone || "see clinic website"}.`
      : `${name} is in ${loc}.`,
  });

  // Q2: 시술 카테고리
  if (clinic.categories.length > 0) {
    faqs.push({
      q: `What treatments does ${name} offer?`,
      a: `${name} specializes in ${categoryWords(clinic.categories)}. Based on review analysis, services most discussed include ${
        (clinic.mentioned_topics?.slice(0, 3).map((t) => t.topic).join(", ")) || categoryWords(clinic.categories)
      }.`,
    });
  }

  // Q3: 평점 / 리뷰 수
  faqs.push({
    q: `Is ${name} highly rated?`,
    a: `${name} has a ${clinic.rating?.toFixed(1) ?? "—"} star rating across ${clinic.total_reviews?.toLocaleString() ?? "—"} Google reviews. Our independent trust score is ${clinic.trust_score ?? "—"}/100, factoring in review volume, reviewer authority, and rating stability.`,
  });

  // Q4: 가격
  const priceRange = formatPriceRange((clinic.pricing as { current_price?: number }[] | undefined));
  if (priceRange) {
    faqs.push({
      q: `How much do treatments cost at ${name}?`,
      a: `Listed package prices at ${name} range ${priceRange}, sourced from HDmall. Actual cost varies by consultation — confirm with the clinic before booking.`,
    });
  }

  // Q5: 의사
  if (clinic.doctor_stats && clinic.doctor_stats.length > 0) {
    const top = clinic.doctor_stats.slice(0, 3).map((d) => d.name).join(", ");
    faqs.push({
      q: `Who are the doctors at ${name}?`,
      a: `Doctors mentioned in reviews of ${name} include ${top}.`,
    });
  }

  // Q6: Pantip 평판
  const p = clinic.pantip;
  if (p && p.mention_count && p.mention_count > 0) {
    const branchNote = p.branch_specific_count && p.branch_specific_count > 0
      ? ` (${p.branch_specific_count} specifically reference this branch)`
      : "";
    faqs.push({
      q: `What do Thai users say about ${name} on Pantip?`,
      a: `${name} is mentioned in ${p.mention_count} Pantip threads${branchNote}. Top discussions include "${
        p.top_mentions?.[0]?.title?.slice(0, 100) ?? ""
      }".`,
    });
  }

  // Q7: 외국인 / 영어 서비스
  const lb = clinic.language_breakdown;
  if (lb && lb.en && lb.en > 0) {
    const ratio = lb.th ? (lb.en / (lb.en + lb.th)) : 1;
    if (ratio > 0.2) {
      faqs.push({
        q: `Does ${name} serve international patients?`,
        a: `${name} has ${lb.en} English-language Google reviews vs ${lb.th || 0} Thai-language reviews, suggesting international/expat patient familiarity. English speakers report ${lb.en > 50 ? "frequent" : "occasional"} positive experiences.`,
      });
    }
  }

  // Q: Procedure cost via HDmall packages (if price data available)
  const hdmallPackages = (clinic as Clinic & { hdmall_packages?: { current_price: number }[] }).hdmall_packages;
  const hdmallPriceRange = formatPriceRange(hdmallPackages);
  if (hdmallPriceRange) {
    faqs.push({
      q: `How much does ${categoryWords(clinic.categories)} cost at ${name}?`,
      a: `${name} lists packages from ${hdmallPriceRange} on HDmall. Prices vary by treatment type and session count. Contact the clinic directly for a personalised quote.`,
    });
  }

  // Q: Implant-specific (dental sites)
  if (clinic.categories.includes("dental")) {
    const dentalMentions = clinic.service_mentions["dental"] ?? 0;
    const implantMentions = clinic.service_mentions["implants"] ?? 0;
    faqs.push({
      q: `Does ${name} offer dental implants?`,
      a: dentalMentions >= 5
        ? `Yes — ${name} has ${dentalMentions} patient reviews mentioning dental procedures${implantMentions ? `, including ${implantMentions} mentions of implants` : ""}. Book a free consultation to discuss your case.`
        : `${name} is a dental clinic in ${loc}. Contact them directly to ask about implant availability and pricing.`,
    });
  }

  // Q: Botox brand (botox/filler sites)
  if (clinic.categories.includes("botox") || clinic.categories.includes("filler")) {
    faqs.push({
      q: `What Botox or filler brands does ${name} use?`,
      a: `Brand information for ${name} is not confirmed on this site. Ask the clinic directly — reputable clinics are transparent about their brands (Allergan, Dysport, Juvederm, Restylane, etc.) and will show you the sealed product before injection.`,
    });
  }

  // Q: Korean-speaking staff (if Korean reviews or language signals present)
  const hasKoreanReviews =
    (clinic.sample_reviews_ko?.length ?? 0) > 0 ||
    (clinic.language_breakdown?.ko ?? 0) > 0 ||
    clinic.mentioned_topics.some((t) => /korean|한국/i.test(t.topic));
  if (hasKoreanReviews) {
    faqs.push({
      q: `Does ${name} have Korean-speaking staff?`,
      a: `${name} appears in searches by Korean medical tourists and has patient mentions in Korean. Contact the clinic directly to confirm Korean-language consultation availability.`,
    });
  }

  return faqs;
}
