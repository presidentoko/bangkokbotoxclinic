// Cold outreach 템플릿 — admin Compose modal 에서 사용.
// 5개 template × 3개 언어. {placeholder} 는 ClinicInfo 필드로 치환.
//
// T1: first contact (가장 일반적)
// T2: alt phrasing (소프트, 친근)
// T3: urgent (부정 리뷰 많은 클리닉 — crisis pitch)
// T4: follow-up (3-7일 뒤, 답장 없는 경우)
// T5: closing (마지막 push, "이번주까지" 류)

export type TemplateId = "T1" | "T2" | "T3" | "T4" | "T5";
export type Lang = "en" | "ko" | "th";

export type ClinicInfo = {
  clinic_id: string;
  name: string;
  district: string;
  city: string;
  trust_score: number;
  rating: number;
  total_reviews: number;
  rank_district: number;
  district_total: number;
  unanswered_neg_reviews: number;
  primary_review_lang: string;
  has_korean_reviewers: boolean;
  has_japanese_reviewers: boolean;
  dashboard_url: string;
  public_url: string;
};

export type TemplateMeta = {
  id: TemplateId;
  label: string;
  hint: string;
};

export const TEMPLATE_METADATA: Record<TemplateId, TemplateMeta> = {
  T1: { id: "T1", label: "T1 — First contact", hint: "Default cold open. Use for most prospects." },
  T2: { id: "T2", label: "T2 — Alt phrasing", hint: "Softer, more conversational. A/B test vs T1." },
  T3: { id: "T3", label: "T3 — Crisis (unanswered negs)", hint: "Use when clinic has 3+ unanswered negative reviews. Higher urgency." },
  T4: { id: "T4", label: "T4 — Follow-up", hint: "3-7 days after T1/T2 with no reply. Light touch." },
  T5: { id: "T5", label: "T5 — Closing push", hint: "Final attempt. Adds gentle scarcity (e.g. limited pilot slots)." },
};

// ─────────────────────────────────────────────────────────────────────────────
// English templates
// ─────────────────────────────────────────────────────────────────────────────

const EN: Record<TemplateId, (c: ClinicInfo, staff: string) => string> = {
  T1: (c, staff) => `Subject: Free reputation report for ${c.name}

Hi ${c.name} team,

We pulled together a free reputation analysis for your clinic using public Google data.

Open it here (no signup): ${c.dashboard_url}

You'll see:
- ${c.unanswered_neg_reviews > 0 ? `${c.unanswered_neg_reviews} unanswered negative reviews with AI-drafted replies — ready to copy-paste` : `Trust Score ${c.trust_score}/100 breakdown with specific levers to improve`}
- Where you rank vs nearby clinics in ${c.district || c.city} (currently #${c.rank_district} of ${c.district_total})
- A 3-step quick-win checklist tailored to your specific data

It took us 0 effort to make. Should save you a couple of hours of manual work.

If you want us to handle review replies, lead routing, or Korean-language SEO automatically, we offer that as a paid service — but the free report is yours to keep regardless.

Best,
${staff || "[Your name]"}`,

  T2: (c, staff) => `Hi ${c.name},

Quick one — we built a free reputation dashboard for your clinic from your public Google data. Thought you might find it useful.

${c.dashboard_url}

It shows your Trust Score (${c.trust_score}/100), district ranking (#${c.rank_district} in ${c.district || c.city}), and pre-drafted AI replies for any unanswered negative reviews.

No signup, no commitment. Just open the link. If it's helpful, let me know — we offer paid services to automate the work, but the report is yours either way.

— ${staff || "[Your name]"}`,

  T3: (c, staff) => `Subject: ${c.unanswered_neg_reviews} unanswered negative reviews on ${c.name}'s Google page

Hi ${c.name} team,

Saw that ${c.name} has ${c.unanswered_neg_reviews} negative reviews on Google still without owner replies. Unanswered negatives are one of the biggest Trust Score drags — they tell new patients you're not engaged.

We made you a free reputation report with AI-drafted reply suggestions for each one — copy, paste, post. Takes maybe 10 minutes total:

${c.dashboard_url}

If you want us to handle reply posting automatically (so this doesn't pile up again), that's our paid service. But the drafts are yours to use either way.

— ${staff || "[Your name]"}`,

  T4: (c, staff) => `Hi ${c.name},

Following up on the free reputation report I sent earlier for your clinic — did you get a chance to look at it?

${c.dashboard_url}

No pressure if not for you. If it'd help to walk through it on a quick call (15 min), happy to.

— ${staff || "[Your name]"}`,

  T5: (c, staff) => `Hi ${c.name},

Last message on my end — I want to make sure you saw the free reputation report we made for ${c.name}:

${c.dashboard_url}

We're closing this month's free-tier pilot slots soon (limited capacity). If the dashboard looks useful and you want one of the paid services (auto-reply posting, lead routing, Korean SEO), let me know this week and I can lock in the pilot rate.

If not, no worries — the report stays yours regardless.

— ${staff || "[Your name]"}`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Korean templates
// ─────────────────────────────────────────────────────────────────────────────

const KO: Record<TemplateId, (c: ClinicInfo, staff: string) => string> = {
  T1: (c, staff) => `${c.name} 매니저님께,

${c.name}의 공개 Google 평가 데이터를 분석해 무료 평판 리포트를 만들었습니다.

리포트 열기 (가입 불필요): ${c.dashboard_url}

리포트 내용:
- ${c.unanswered_neg_reviews > 0 ? `미답글 부정 리뷰 ${c.unanswered_neg_reviews}건 + AI 답글 초안 (복사-붙여넣기 가능)` : `Trust Score ${c.trust_score}/100 분석 + 개선 방안`}
- 같은 지역(${c.district || c.city}) 클리닉 중 현재 #${c.rank_district}/${c.district_total}위
- 클리닉 데이터 기반 quick-win 3가지

저희 노력은 0, 클리닉은 몇 시간의 수작업 절약.

답글 자동 게시, 리드 라우팅, 한국어 SEO 같은 유료 서비스도 있지만, 무료 리포트는 그대로 가져가셔도 됩니다.

감사합니다,
${staff || "[이름]"}`,

  T2: (c, staff) => `안녕하세요 ${c.name} 팀,

${c.name}의 공개 Google 데이터로 무료 평판 대시보드를 만들었어요. 도움 될 것 같아 공유 드립니다.

${c.dashboard_url}

Trust Score(${c.trust_score}/100), ${c.district || c.city} 내 순위(#${c.rank_district}), 미답글 부정 리뷰에 대한 AI 답글 초안이 들어있어요.

가입·약정 없습니다. 링크만 열어보시면 됩니다. 유용하시면 알려주세요 — 작업을 자동화하는 유료 옵션도 있긴 한데, 리포트 자체는 무료로 그냥 쓰셔도 됩니다.

— ${staff || "[이름]"}`,

  T3: (c, staff) => `${c.name} 매니저님,

${c.name}의 Google 페이지에 답글이 안 달린 부정 리뷰가 ${c.unanswered_neg_reviews}건 있는 거 확인했어요. 미답글 부정 리뷰는 Trust Score를 가장 크게 떨어뜨리는 요인입니다 — 새 환자들에게 "관리 안 하는 곳"이라는 신호를 줍니다.

각 리뷰에 대한 AI 답글 초안을 만들어둔 무료 리포트가 여기 있어요. 복사해서 붙여넣기만 하면 됩니다. 총 10분 정도면 끝납니다:

${c.dashboard_url}

다음에 또 쌓이지 않게 답글 자동 게시 서비스도 유료로 제공하는데, 초안은 무료로 가져가셔도 됩니다.

— ${staff || "[이름]"}`,

  T4: (c, staff) => `안녕하세요 ${c.name} 팀,

며칠 전 보내드린 무료 평판 리포트 관련해서 follow-up입니다:

${c.dashboard_url}

부담 없이 봐주시면 됩니다. 짧은 통화(15분) 로 같이 보면 더 좋으시면 편하실 때 알려주세요.

— ${staff || "[이름]"}`,

  T5: (c, staff) => `안녕하세요 ${c.name} 팀,

이번 메시지가 마지막이라 ${c.name}의 무료 평판 리포트 한 번 더 보내드립니다:

${c.dashboard_url}

이번 달 무료 pilot 슬롯이 곧 마감됩니다 (수용 한도 있음). 대시보드 보시고 유료 서비스 (답글 자동 게시, 리드 라우팅, 한국어 SEO) 관심 있으시면 이번 주 안에 알려주시면 pilot 가격으로 락걸어 드릴 수 있어요.

관심 없으시면 괜찮아요 — 리포트는 그대로 가져가셔도 됩니다.

— ${staff || "[이름]"}`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Thai templates
// ─────────────────────────────────────────────────────────────────────────────

const TH: Record<TemplateId, (c: ClinicInfo, staff: string) => string> = {
  T1: (c, staff) => `เรื่อง: รายงานชื่อเสียงฟรีสำหรับ ${c.name}

สวัสดีค่ะทีมงาน ${c.name},

เราได้สร้างรายงานการวิเคราะห์ชื่อเสียงคลินิกของท่านฟรี โดยใช้ข้อมูล Google สาธารณะ

ดูรายงาน (ไม่ต้องสมัครสมาชิก): ${c.dashboard_url}

ในรายงานจะพบ:
- ${c.unanswered_neg_reviews > 0 ? `รีวิวเชิงลบที่ยังไม่ตอบ ${c.unanswered_neg_reviews} รายการ พร้อมข้อความตอบกลับที่ AI ร่างไว้แล้ว` : `Trust Score ${c.trust_score}/100 พร้อมแนวทางปรับปรุง`}
- อันดับของท่านในเขต ${c.district || c.city} (ปัจจุบัน #${c.rank_district}/${c.district_total})
- เช็คลิสต์ 3 ขั้นตอนที่ปรับปรุงได้ทันที

เราใช้ความพยายามเป็น 0 แต่จะช่วยประหยัดเวลาท่านได้หลายชั่วโมง

หากต้องการบริการตอบรีวิวอัตโนมัติ, ส่งลีดเข้า LINE, หรือ SEO ภาษาเกาหลี เราให้บริการแบบเสียค่าใช้จ่าย — แต่รายงานฟรีนี้เป็นของท่าน

ขอบคุณค่ะ,
${staff || "[ชื่อ]"}`,

  T2: (c, staff) => `สวัสดีค่ะ ${c.name},

ขอแชร์เร็วๆ ค่ะ — เราสร้างแดชบอร์ดชื่อเสียงฟรีสำหรับคลินิกของท่าน จากข้อมูล Google สาธารณะ คิดว่าน่าจะเป็นประโยชน์

${c.dashboard_url}

ในนั้นมี Trust Score (${c.trust_score}/100), อันดับในเขต ${c.district || c.city} (#${c.rank_district}), และข้อความตอบกลับที่ AI ร่างไว้สำหรับรีวิวเชิงลบที่ยังไม่ตอบ

ไม่ต้องสมัคร ไม่ต้องผูกมัด แค่เปิดลิงก์ค่ะ ถ้ามีประโยชน์บอกได้ — เรามีบริการอัตโนมัติแบบเสียค่าใช้จ่าย แต่รายงานเป็นของท่านอยู่ดี

— ${staff || "[ชื่อ]"}`,

  T3: (c, staff) => `เรียน ${c.name},

สังเกตว่า ${c.name} มีรีวิวเชิงลบ ${c.unanswered_neg_reviews} รายการบน Google ที่ยังไม่มีการตอบกลับจากเจ้าของคลินิก รีวิวเชิงลบที่ไม่ตอบเป็นปัจจัยที่ดึง Trust Score ลงมากที่สุด — ทำให้คนไข้ใหม่รู้สึกว่าคลินิกไม่ดูแล

เราจัดทำรายงานชื่อเสียงฟรีพร้อมข้อความตอบกลับที่ AI ร่างให้แล้วสำหรับแต่ละรีวิว — เพียงคัดลอก วาง โพสต์ ใช้เวลาประมาณ 10 นาทีก็เสร็จ:

${c.dashboard_url}

หากต้องการให้เราดูแลการโพสต์ตอบกลับอัตโนมัติ (เพื่อไม่ให้สะสมแบบนี้อีก) เป็นบริการแบบเสียค่าใช้จ่าย แต่ร่างข้อความเป็นของท่านอยู่แล้ว

— ${staff || "[ชื่อ]"}`,

  T4: (c, staff) => `สวัสดีค่ะ ${c.name},

ติดตามจากรายงานชื่อเสียงฟรีที่ส่งให้ก่อนหน้านี้ — ได้มีโอกาสดูหรือยังคะ?

${c.dashboard_url}

ไม่ได้เร่งนะคะถ้ายังไม่สะดวก ถ้าอยากให้พูดคุยกันสั้นๆ (15 นาที) เพื่ออธิบายเพิ่ม ก็ยินดีค่ะ

— ${staff || "[ชื่อ]"}`,

  T5: (c, staff) => `สวัสดีค่ะ ${c.name},

ข้อความสุดท้ายจากเรา — อยากเช็คให้แน่ใจว่าท่านได้เห็นรายงานชื่อเสียงฟรีที่เราจัดทำให้ ${c.name}:

${c.dashboard_url}

ช่วงนี้กำลังปิดรับ pilot ฟรีของเดือนนี้ (จำนวนจำกัด) ถ้าแดชบอร์ดดูเป็นประโยชน์และสนใจบริการแบบเสียค่าใช้จ่าย (ตอบรีวิวอัตโนมัติ, ส่งลีด, SEO เกาหลี) แจ้งภายในสัปดาห์นี้ได้เลยค่ะ เราจะล็อกเรท pilot ให้

ถ้าไม่สนใจ ก็ไม่เป็นไรค่ะ รายงานเป็นของท่านอยู่แล้ว

— ${staff || "[ชื่อ]"}`,
};

const TEMPLATES_BY_LANG: Record<Lang, Record<TemplateId, (c: ClinicInfo, staff: string) => string>> = {
  en: EN,
  ko: KO,
  th: TH,
};

export function renderTemplate(template: TemplateId, lang: Lang, clinic: ClinicInfo, staff: string): string {
  const fn = TEMPLATES_BY_LANG[lang][template];
  return fn(clinic, staff);
}
