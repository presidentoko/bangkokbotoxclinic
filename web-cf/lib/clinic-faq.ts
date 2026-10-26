// 클리닉별 자동 FAQ 생성 — AEO 핵심.
// Google PAA(People Also Ask) 패턴 + LLM 인용 친화 구조.
// Pantip 토픽 제목을 활용해 "사람들이 실제로 묻는 질문" 으로 변환.
//
// 2026-10-15: lang 추가. /th 페이지의 FAQ(가시 섹션 + FAQPage 스키마)가 전부
// 영어였다 — 태국어 검색어("คลินิกทำฟันใกล้ฉัน")로 들어오는 사람이 남은 트래픽의
// 거의 전부인데. 같은 날 "임플란트 하나요?"에 치과 언급 5건만 있으면 "Yes"라고
// 답하던 것도 고쳤다 — 임플란트 언급이 실제로 있을 때만 그렇게 말한다.
import type { Clinic } from "./types";
import { CATEGORY_LABELS, CATEGORY_LABELS_TH, TOPIC_LABELS, TOPIC_LABELS_TH } from "./types";

export type Faq = { q: string; a: string };
export type FaqLang = "en" | "th";

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

function categoryWords(cats: string[], lang: FaqLang): string {
  const labels = lang === "th" ? CATEGORY_LABELS_TH : CATEGORY_LABELS;
  if (!cats.length) return lang === "th" ? "การรักษาทั่วไป" : "general care";
  return cats.map((c) => labels[c] ?? c).slice(0, 3).join(", ");
}

function topicWords(topics: { topic: string }[] | undefined, lang: FaqLang): string {
  const labels = lang === "th" ? TOPIC_LABELS_TH : TOPIC_LABELS;
  return (topics ?? []).slice(0, 3).map((t) => labels[t.topic] ?? t.topic).join(", ");
}

/** 클리닉별 FAQ 자동 생성. 데이터에 따라 4-8개 Q&A. */
/**
 * @param topicsOverride 이 로케일에서 "환자들이 가장 자주 언급하는 것" 에 쓸 토픽.
 *   /th 는 태국어 리뷰 원문에서 뽑은 토픽을 넘긴다(data/clinic-thai.json).
 *   넘기지 않으면 master_db 의 전체 코퍼스 토픽을 쓴다.
 *
 *   2026-10-26: TopicCluster 만 태국어 토픽으로 갈아끼웠더니 **이 문장이 남아서**
 *   한 문장 안에 "ราคาสูง, ราคาไม่แพง"(비싸다, 안 비싸다)를 나란히 찍고 있었다.
 *   같은 가드를 두 번째 입구에 안 걸면 그 입구로 그대로 들어온다.
 *
 *   Q "한국어 가능?" 은 일부러 안 바꾼다 — 그건 한국어·영어 리뷰에서 나오는
 *   신호이고 태국어 코퍼스에는 애초에 없다. 거기까지 덮으면 있는 사실을 지운다.
 */
export function buildClinicFaqs(
  clinic: ClinicWithPantip,
  lang: FaqLang = "en",
  topicsOverride?: { topic: string; count: number }[],
): Faq[] {
  const th = lang === "th";
  const faqs: Faq[] = [];
  const name = clinic.name;
  const city = clinic.city_label || (th ? "กรุงเทพฯ" : "Bangkok");
  const loc = clinic.district ? `${clinic.district}, ${city}` : city;

  // Q1: 위치
  faqs.push(th
    ? {
        q: `${name} อยู่ที่ไหน?`,
        a: clinic.address
          ? `${name} ตั้งอยู่ที่ ${clinic.address} โทร ${clinic.phone || "ดูที่เว็บไซต์คลินิก"}`
          : `${name} อยู่ในย่าน ${loc}`,
      }
    : {
        q: `Where is ${name} located?`,
        a: clinic.address
          ? `${name} is located at ${clinic.address}. Phone: ${clinic.phone || "see clinic website"}.`
          : `${name} is in ${loc}.`,
      });

  // Q2: 시술 카테고리
  if (clinic.categories.length > 0) {
    const topics =
      topicWords(topicsOverride?.length ? topicsOverride : clinic.mentioned_topics, lang) ||
      categoryWords(clinic.categories, lang);
    faqs.push(th
      ? {
          q: `${name} ให้บริการอะไรบ้าง?`,
          a: `${name} ให้บริการด้าน${categoryWords(clinic.categories, lang)} จากการอ่านรีวิว สิ่งที่คนไข้พูดถึงบ่อยที่สุดคือ ${topics}`,
        }
      : {
          q: `What treatments does ${name} offer?`,
          a: `${name} specializes in ${categoryWords(clinic.categories, lang)}. In the reviews we read, patients most often mention: ${topics}.`,
        });
  }

  // Q3: 평점 / 리뷰 수
  const rating = clinic.rating?.toFixed(1) ?? "—";
  const total = clinic.total_reviews?.toLocaleString() ?? "—";
  faqs.push(th
    ? {
        q: `${name} รีวิวดีไหม?`,
        a: `${name} ได้คะแนน ${rating} ดาว จาก ${total} รีวิวบน Google คะแนนความน่าเชื่อถือของเราคือ ${clinic.trust_score ?? "—"}/100 ซึ่งคิดจากจำนวนรีวิว ความน่าเชื่อถือของผู้รีวิว และความสม่ำเสมอของคะแนน`,
      }
    : {
        q: `Is ${name} highly rated?`,
        a: `${name} has a ${rating} star rating across ${total} Google reviews. Our independent trust score is ${clinic.trust_score ?? "—"}/100, factoring in review volume, reviewer authority, and rating stability.`,
      });

  // Q4: 가격
  const priceRange = formatPriceRange((clinic.pricing as { current_price?: number }[] | undefined));
  if (priceRange) {
    faqs.push(th
      ? {
          q: `ทำที่ ${name} ราคาเท่าไหร่?`,
          a: `ราคาแพ็กเกจของ ${name} บน HDmall อยู่ที่ ${priceRange} ราคาจริงขึ้นกับการประเมิน ควรยืนยันกับคลินิกก่อนจอง`,
        }
      : {
          q: `How much do treatments cost at ${name}?`,
          a: `Listed package prices at ${name} range ${priceRange}, sourced from HDmall. Actual cost varies by consultation — confirm with the clinic before booking.`,
        });
  }

  // Q5: 의사
  if (clinic.doctor_stats && clinic.doctor_stats.length > 0) {
    const top = clinic.doctor_stats.slice(0, 3).map((d) => d.name).join(", ");
    faqs.push(th
      ? { q: `${name} มีหมอคนไหนบ้าง?`, a: `หมอที่คนไข้พูดถึงในรีวิวของ ${name} ได้แก่ ${top}` }
      : { q: `Who are the doctors at ${name}?`, a: `Doctors mentioned in reviews of ${name} include ${top}.` });
  }

  // Q6: Pantip 평판
  const p = clinic.pantip;
  if (p && p.mention_count && p.mention_count > 0) {
    const topic = p.top_mentions?.[0]?.title?.slice(0, 100) ?? "";
    const branch = p.branch_specific_count && p.branch_specific_count > 0 ? p.branch_specific_count : 0;
    faqs.push(th
      ? {
          q: `คนในพันทิปพูดถึง ${name} ว่าอย่างไร?`,
          a: `${name} ถูกพูดถึงใน ${p.mention_count} กระทู้บนพันทิป${branch ? ` (${branch} กระทู้พูดถึงสาขานี้โดยตรง)` : ""} กระทู้ที่เด่นที่สุดคือ "${topic}"`,
        }
      : {
          q: `What do Thai users say about ${name} on Pantip?`,
          a: `${name} is mentioned in ${p.mention_count} Pantip threads${branch ? ` (${branch} specifically reference this branch)` : ""}. Top discussions include "${topic}".`,
        });
  }

  // Q7: 외국인 / 영어 서비스
  const lb = clinic.language_breakdown;
  if (lb && lb.en && lb.en > 0) {
    const ratio = lb.th ? (lb.en / (lb.en + lb.th)) : 1;
    if (ratio > 0.2) {
      faqs.push(th
        ? {
            q: `${name} รับคนไข้ต่างชาติไหม?`,
            a: `${name} มีรีวิวภาษาอังกฤษ ${lb.en} รีวิว และภาษาไทย ${lb.th || 0} รีวิว แสดงว่ามีคนไข้ต่างชาติมาใช้บริการ${lb.en > 50 ? "เป็นประจำ" : "อยู่บ้าง"}`,
          }
        : {
            q: `Does ${name} serve international patients?`,
            a: `${name} has ${lb.en} English-language Google reviews vs ${lb.th || 0} Thai-language reviews, suggesting international/expat patient familiarity. English speakers report ${lb.en > 50 ? "frequent" : "occasional"} positive experiences.`,
          });
    }
  }

  // Q: Procedure cost via HDmall packages (if price data available)
  const hdmallPackages = (clinic as Clinic & { hdmall_packages?: { current_price: number }[] }).hdmall_packages;
  const hdmallPriceRange = formatPriceRange(hdmallPackages);
  if (hdmallPriceRange) {
    const cats = categoryWords(clinic.categories, lang);
    faqs.push(th
      ? {
          q: `${cats} ที่ ${name} ราคาเท่าไหร่?`,
          a: `${name} มีแพ็กเกจบน HDmall ราคา ${hdmallPriceRange} ราคาขึ้นกับประเภทการรักษาและจำนวนครั้ง ติดต่อคลินิกเพื่อขอใบเสนอราคา`,
        }
      : {
          q: `How much does ${cats} cost at ${name}?`,
          a: `${name} lists packages from ${hdmallPriceRange} on HDmall. Prices vary by treatment type and session count. Contact the clinic directly for a personalised quote.`,
        });
  }

  // Q: Implant-specific (dental sites)
  if (clinic.categories.includes("dental")) {
    const implantMentions = clinic.service_mentions["implants"] ?? 0;
    faqs.push(th
      ? {
          q: `${name} ทำรากฟันเทียมไหม?`,
          a: implantMentions > 0
            ? `มีคนไข้ ${implantMentions} รีวิวที่พูดถึงรากฟันเทียมที่ ${name} ควรสอบถามราคาและยี่ห้อรากเทียมกับคลินิกโดยตรง`
            : `ในรีวิวที่เราอ่านยังไม่มีใครพูดถึงรากฟันเทียมที่ ${name} ควรโทรถามคลินิกโดยตรงว่าทำหรือไม่`,
        }
      : {
          q: `Does ${name} offer dental implants?`,
          a: implantMentions > 0
            ? `${implantMentions} patient reviews mention implants at ${name}. Ask the clinic directly about the implant brand and price.`
            : `None of the reviews we read mention implants at ${name}. Call the clinic to ask whether they place implants.`,
        });
  }

  // Q: Botox brand (botox/filler sites)
  if (clinic.categories.includes("botox") || clinic.categories.includes("filler")) {
    faqs.push(th
      ? {
          q: `${name} ใช้โบท็อกซ์หรือฟิลเลอร์ยี่ห้ออะไร?`,
          a: `เว็บไซต์นี้ยังไม่ได้ยืนยันยี่ห้อที่ ${name} ใช้ ควรถามคลินิกโดยตรง คลินิกที่ดีจะบอกยี่ห้อและเปิดกล่องใหม่ให้ดูก่อนฉีด`,
        }
      : {
          q: `What Botox or filler brands does ${name} use?`,
          a: `Brand information for ${name} is not confirmed on this site. Ask the clinic directly — reputable clinics are transparent about their brands (Allergan, Dysport, Juvederm, Restylane, etc.) and will show you the sealed product before injection.`,
        });
  }

  // Q: Korean-speaking staff (if Korean reviews or language signals present)
  // 태국어 페이지에는 넣지 않는다 — 한국인 의료관광객 대상 질문이다.
  const hasKoreanReviews =
    (clinic.sample_reviews_ko?.length ?? 0) > 0 ||
    (clinic.language_breakdown?.ko ?? 0) > 0 ||
    clinic.mentioned_topics.some((t) => /korean|한국/i.test(t.topic));
  if (hasKoreanReviews && !th) {
    faqs.push({
      q: `Does ${name} have Korean-speaking staff?`,
      a: `${name} appears in searches by Korean medical tourists and has patient mentions in Korean. Contact the clinic directly to confirm Korean-language consultation availability.`,
    });
  }

  return faqs;
}
