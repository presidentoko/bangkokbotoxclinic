// 순위 페이지(/[lang]/city/[city]/best/[topic]) 문구. 페이지 파일은 Next 가 허용하는
// export 만 둘 수 있어서 여기로 분리했다 — 도시 페이지·가게 카드의 링크도 이걸 쓴다.
import type { Lang } from "./site";
import type { RankEntry, RankingTopic } from "./rankings";

export type TopicCopy = { title: string; h1: string; intro: string; metric: (e: RankEntry, loc: string) => string; faqQ: string; faqA: string };

export const RANKING_COPY: Record<Lang, { topics: Record<RankingTopic, TopicCopy>; method: string; more: string; faqTitle: string; allIn: string }> = {
  en: {
    topics: {
      "korean-favorites": {
        title: "Massage & spas Korean travellers review most in {city}",
        h1: "Where Korean travellers get massages in {city}",
        intro: "Ranked by how many reviews are written in Korean — a signal no star rating shows. Only places rated 4★ or higher.",
        metric: (e) => `${e.koReviews} Korean reviews`,
        faqQ: "Which massage shop in {city} do Korean tourists go to most?",
        faqA: "{name} has the most Korean-language reviews among the places we track in {city} ({metric}).",
      },
      cleanest: {
        title: "Cleanest massage & spas in {city}, by review analysis",
        h1: "Cleanest massage places in {city}",
        intro: "Ranked by the share of reviews that praise cleanliness versus complain about it, across every review we collected.",
        metric: (e) => `${e.pct}% positive · ${e.mentions} mentions`,
        faqQ: "What is the cleanest massage place in {city}?",
        faqA: "By our count of review mentions, {name} ranks first for cleanliness in {city} ({metric}).",
      },
      "best-value": {
        title: "Best-value massage in {city}, by review analysis",
        h1: "Best value-for-money massage in {city}",
        intro: "Ranked by how often reviewers call the price fair versus overpriced.",
        metric: (e) => `${e.pct}% positive · ${e.mentions} mentions`,
        faqQ: "Where is the best value massage in {city}?",
        faqA: "{name} ranks first for value in {city} by our review analysis ({metric}).",
      },
      "most-skilled": {
        title: "Most skilled massage therapists in {city}, by review analysis",
        h1: "Where reviewers praise the therapists' skill in {city}",
        intro: "Ranked by mentions of skilled, professional therapists versus lazy or careless ones.",
        metric: (e) => `${e.pct}% positive · ${e.mentions} mentions`,
        faqQ: "Where can I find a skilled massage therapist in {city}?",
        faqA: "{name} ranks first for therapist skill in {city} by our review analysis ({metric}).",
      },
      friendliest: {
        title: "Friendliest massage & spa staff in {city}, by review analysis",
        h1: "Friendliest massage staff in {city}",
        intro: "Ranked by mentions of friendly, welcoming staff versus rude or unfriendly service.",
        metric: (e) => `${e.pct}% positive · ${e.mentions} mentions`,
        faqQ: "Which massage place in {city} has the friendliest staff?",
        faqA: "{name} ranks first for staff attitude in {city} by our review analysis ({metric}).",
      },
      improving: {
        title: "Massage places getting better in {city}",
        h1: "Massage places in {city} that are getting better",
        intro: "Places whose average rating over the last 6 months is clearly above their earlier reviews.",
        metric: (e) => `★${e.recentAvg!.toFixed(1)} recently (${e.recentN} reviews), was ★${e.beforeAvg!.toFixed(1)}`,
        faqQ: "Which massage places in {city} have improved recently?",
        faqA: "{name} shows the biggest recent improvement in {city}: {metric}.",
      },
    },
    method: "chillanel's own count across {n} reviews in {city}. Positive share uses a confidence-adjusted ranking so a place with 3 mentions cannot outrank one with 200; places need 8+ mentions to appear.",
    more: "More rankings in {city}",
    faqTitle: "Quick answers",
    allIn: "All massage & spas in {city}",
  },
  th: {
    topics: {
      "korean-favorites": {
        title: "ร้านนวดที่คนเกาหลีรีวิวมากที่สุดใน{city}",
        h1: "ร้านนวดยอดนิยมของนักท่องเที่ยวเกาหลีใน{city}",
        intro: "เรียงตามจำนวนรีวิวภาษาเกาหลี เฉพาะร้านที่ได้ 4★ ขึ้นไป",
        metric: (e) => `รีวิวภาษาเกาหลี ${e.koReviews} รายการ`,
        faqQ: "คนเกาหลีไปร้านนวดไหนใน{city}มากที่สุด?",
        faqA: "{name} มีรีวิวภาษาเกาหลีมากที่สุดใน{city} ({metric})",
      },
      cleanest: {
        title: "ร้านนวดที่สะอาดที่สุดใน{city} จากการวิเคราะห์รีวิว",
        h1: "ร้านนวดที่สะอาดที่สุดใน{city}",
        intro: "เรียงตามสัดส่วนรีวิวที่ชมความสะอาดเทียบกับที่ตำหนิ จากรีวิวทั้งหมดที่เราเก็บได้",
        metric: (e) => `เชิงบวก ${e.pct}% · กล่าวถึง ${e.mentions} ครั้ง`,
        faqQ: "ร้านนวดไหนสะอาดที่สุดใน{city}?",
        faqA: "จากการนับรีวิว {name} อันดับหนึ่งด้านความสะอาดใน{city} ({metric})",
      },
      "best-value": {
        title: "ร้านนวดคุ้มค่าที่สุดใน{city} จากการวิเคราะห์รีวิว",
        h1: "ร้านนวดคุ้มค่าที่สุดใน{city}",
        intro: "เรียงตามรีวิวที่บอกว่าราคาคุ้มค่าเทียบกับที่บอกว่าแพงเกินไป",
        metric: (e) => `เชิงบวก ${e.pct}% · กล่าวถึง ${e.mentions} ครั้ง`,
        faqQ: "ร้านนวดไหนคุ้มค่าที่สุดใน{city}?",
        faqA: "{name} อันดับหนึ่งด้านความคุ้มค่าใน{city} ({metric})",
      },
      "most-skilled": {
        title: "หมอนวดฝีมือดีที่สุดใน{city} จากการวิเคราะห์รีวิว",
        h1: "ร้านที่รีวิวชมฝีมือหมอนวดมากที่สุดใน{city}",
        intro: "เรียงตามรีวิวที่ชมว่าหมอนวดมีฝีมือ เทียบกับที่ตำหนิว่านวดไม่ตั้งใจ",
        metric: (e) => `เชิงบวก ${e.pct}% · กล่าวถึง ${e.mentions} ครั้ง`,
        faqQ: "หาหมอนวดฝีมือดีใน{city}ได้ที่ไหน?",
        faqA: "{name} อันดับหนึ่งด้านฝีมือหมอนวดใน{city} ({metric})",
      },
      friendliest: {
        title: "ร้านนวดที่พนักงานเป็นมิตรที่สุดใน{city}",
        h1: "ร้านนวดที่พนักงานเป็นมิตรที่สุดใน{city}",
        intro: "เรียงตามรีวิวที่ชมความเป็นมิตรของพนักงาน เทียบกับที่ตำหนิว่าไม่สุภาพ",
        metric: (e) => `เชิงบวก ${e.pct}% · กล่าวถึง ${e.mentions} ครั้ง`,
        faqQ: "ร้านนวดไหนใน{city}พนักงานเป็นมิตรที่สุด?",
        faqA: "{name} อันดับหนึ่งด้านท่าทีพนักงานใน{city} ({metric})",
      },
      improving: {
        title: "ร้านนวดที่ดีขึ้นใน{city}",
        h1: "ร้านนวดใน{city}ที่กำลังดีขึ้น",
        intro: "ร้านที่คะแนนเฉลี่ย 6 เดือนล่าสุดสูงกว่ารีวิวก่อนหน้าอย่างชัดเจน",
        metric: (e) => `ล่าสุด ★${e.recentAvg!.toFixed(1)} (${e.recentN} รีวิว) จากเดิม ★${e.beforeAvg!.toFixed(1)}`,
        faqQ: "ร้านนวดไหนใน{city}ดีขึ้นในช่วงนี้?",
        faqA: "{name} ดีขึ้นมากที่สุดใน{city}: {metric}",
      },
    },
    method: "chillanel นับจากรีวิว {n} รายการใน{city} ใช้การจัดอันดับที่ปรับตามความเชื่อมั่น ร้านต้องถูกกล่าวถึง 8 ครั้งขึ้นไป",
    more: "อันดับอื่นใน{city}",
    faqTitle: "คำตอบสั้น ๆ",
    allIn: "ร้านนวดและสปาทั้งหมดใน{city}",
  },
  ko: {
    topics: {
      "korean-favorites": {
        title: "{city} 한국인이 많이 가는 마사지·스파",
        h1: "{city}에서 한국인이 많이 가는 마사지",
        intro: "한국어로 쓰인 리뷰가 많은 순서입니다 — 별점으로는 알 수 없는 정보입니다. 별점 4점 이상인 곳만 넣었습니다.",
        metric: (e) => `한국어 리뷰 ${e.koReviews}건`,
        faqQ: "{city}에서 한국인이 가장 많이 가는 마사지 가게는 어디인가요?",
        faqA: "chillanel이 추적하는 {city} 가게 중 한국어 리뷰가 가장 많은 곳은 {name}입니다({metric}).",
      },
      cleanest: {
        title: "{city} 청결 만족도 높은 마사지 순위 (리뷰 분석)",
        h1: "{city}에서 가장 깨끗한 마사지 가게",
        intro: "수집한 리뷰 전부에서 청결을 칭찬한 리뷰와 불만을 말한 리뷰의 비율로 순위를 매겼습니다.",
        metric: (e) => `긍정 ${e.pct}% · 언급 ${e.mentions}건`,
        faqQ: "{city}에서 가장 깨끗한 마사지 가게는 어디인가요?",
        faqA: "리뷰 언급을 집계한 결과 {city} 청결 1위는 {name}입니다({metric}).",
      },
      "best-value": {
        title: "{city} 가성비 좋은 마사지 순위 (리뷰 분석)",
        h1: "{city} 가성비 좋은 마사지",
        intro: "가격이 합리적이라는 리뷰와 비싸다·바가지라는 리뷰의 비율로 순위를 매겼습니다.",
        metric: (e) => `긍정 ${e.pct}% · 언급 ${e.mentions}건`,
        faqQ: "{city}에서 가성비 좋은 마사지는 어디인가요?",
        faqA: "리뷰 분석 결과 {city} 가성비 1위는 {name}입니다({metric}).",
      },
      "most-skilled": {
        title: "{city} 마사지사 실력 좋은 곳 순위 (리뷰 분석)",
        h1: "{city}에서 마사지사 실력을 칭찬받는 곳",
        intro: "실력 좋다·시원하다는 리뷰와 대충 한다는 리뷰의 비율로 순위를 매겼습니다.",
        metric: (e) => `긍정 ${e.pct}% · 언급 ${e.mentions}건`,
        faqQ: "{city}에서 마사지 잘하는 곳은 어디인가요?",
        faqA: "리뷰 분석 결과 {city} 마사지사 실력 1위는 {name}입니다({metric}).",
      },
      friendliest: {
        title: "{city} 직원이 친절한 마사지 순위 (리뷰 분석)",
        h1: "{city}에서 직원이 가장 친절한 마사지 가게",
        intro: "친절하다는 리뷰와 불친절·무례하다는 리뷰의 비율로 순위를 매겼습니다.",
        metric: (e) => `긍정 ${e.pct}% · 언급 ${e.mentions}건`,
        faqQ: "{city}에서 직원이 친절한 마사지 가게는 어디인가요?",
        faqA: "리뷰 분석 결과 {city} 직원 친절 1위는 {name}입니다({metric}).",
      },
      improving: {
        title: "{city} 요즘 좋아지는 마사지 가게",
        h1: "{city}에서 요즘 평이 좋아지는 마사지 가게",
        intro: "최근 6개월 평균 별점이 그 이전 리뷰보다 확실히 높아진 곳입니다.",
        metric: (e) => `최근 ★${e.recentAvg!.toFixed(1)} (리뷰 ${e.recentN}건), 이전 ★${e.beforeAvg!.toFixed(1)}`,
        faqQ: "{city}에서 최근 평이 좋아진 마사지 가게는 어디인가요?",
        faqA: "{city}에서 최근 가장 크게 좋아진 곳은 {name}입니다: {metric}.",
      },
    },
    method: "{city} 리뷰 {n}건을 chillanel이 직접 집계했습니다. 언급이 3건뿐인 곳이 200건인 곳을 이기지 않도록 신뢰도를 보정해 순위를 매겼고, 언급이 8건 이상인 곳만 넣었습니다.",
    more: "{city}의 다른 순위",
    faqTitle: "자주 묻는 질문",
    allIn: "{city} 마사지·스파 전체 보기",
  },
};

export const TOPIC_EMOJI: Record<RankingTopic, string> = {
  "korean-favorites": "🇰🇷", cleanest: "🧼", "best-value": "💰", "most-skilled": "💆", friendliest: "😊", improving: "📈",
};

export const fill = (s: string, v: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");
