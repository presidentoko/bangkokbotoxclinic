// /th/c/[service] — 태국어 시술별 허브 페이지.
//
// 2026-08-06 신설. 이 사이트의 GSC 상위 쿼리는 전부 태국어인데
// (คลินิกทำฟันใกล้ฉัน 302노출, คลินิกทันตกรรมใกล้ฉัน 79노출,
//  คลินิกผิว อนุสาวรีย์ 269노출 …) 정작 태국어 라우트는 /th 홈과
// /th/clinic/[id] 둘뿐이라, 그 검색어들이 착지할 태국어 서비스 페이지가
// 존재하지 않았다. 한국어는 2026-07-13에 /ko/c/[service] 를 이미 만들어둔
// 상태였다 — 트래픽이 더 큰 쪽이 오히려 비어 있었던 셈이다.
// 구조는 /ko/c/[service] 와 동일하게 맞추고 라벨·가격·FAQ만 태국어 실번역.
import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, FaqJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { BookingForm } from "@/components/BookingForm";
import { StatsBar } from "@/components/StatsBar";
import { CategoryIcon } from "@/components/CategoryIcon";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

const VALID = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

const TH_LABELS: Record<string, string> = {
  botox: "โบท็อกซ์",
  filler: "ฟิลเลอร์",
  hifu: "HIFU",
  facial: "ดูแลผิวหน้า",
  laser: "เลเซอร์",
  dental: "ทันตกรรม",
  hair_transplant: "ปลูกผม",
  eye: "เลสิก",
};

// GSC 에서 실제로 클릭을 만들고 있는 "…ใกล้ฉัน"(내 근처) 표현. 제목에 그대로
// 쓰기 위해 별도 테이블로 둔다 — 의역하면 매칭이 약해진다.
const TH_NEAR_ME: Record<string, string> = {
  botox: "คลินิกโบท็อกซ์ใกล้ฉัน",
  filler: "คลินิกฟิลเลอร์ใกล้ฉัน",
  hifu: "คลินิก HIFU ใกล้ฉัน",
  facial: "คลินิกผิวหน้าใกล้ฉัน",
  laser: "คลินิกเลเซอร์ใกล้ฉัน",
  dental: "คลินิกทำฟันใกล้ฉัน",
  hair_transplant: "คลินิกปลูกผมใกล้ฉัน",
  eye: "คลินิกเลสิกใกล้ฉัน",
};

const TH_PRICE_HINTS: Partial<Record<string, string>> = {
  botox: "เริ่มต้น ฿80 ต่อยูนิต · Allergan, Dysport, Botulax",
  dental: "รากฟันเทียมเริ่มต้น ฿35,000 · วีเนียร์เริ่มต้น ฿12,000 ต่อซี่",
  filler: "เริ่มต้น ฿8,000 ต่อ 1 ml · Juvederm, Restylane",
  hifu: "เริ่มต้น ฿8,000 ต่อครั้ง · Ultherapy, Thermage, Ultraformer",
  laser: "พิโคเลเซอร์เริ่มต้น ฿3,000 · CO2 เลเซอร์เริ่มต้น ฿8,000",
  hair_transplant: "FUE 2,000 กราฟท์ เริ่มต้น ฿65,000",
};

// 가격 비교 표 — AI Overviews/답변 엔진이 가장 안정적으로 추출하는 형식인데
// 이 사이트엔 <table>이 한 개도 없었다. 수치는 lib/faq.ts 의 영어 FAQ와 동일.
const TH_PRICE_TABLE: Partial<Record<string, { rows: [string, string][]; note: string }>> = {
  dental: {
    rows: [
      ["รากฟันเทียม Straumann / Nobel Biocare", "฿55,000–80,000 ต่อซี่"],
      ["รากฟันเทียม Osstem / Astra", "฿35,000–55,000 ต่อซี่"],
      ["All-on-4 ทั้งขากรรไกร", "฿250,000–500,000"],
      ["วีเนียร์", "฿12,000–30,000 ต่อซี่"],
      ["ครอบฟันเซรามิก / E.max", "฿10,000–20,000"],
      ["ครอบฟันเซอร์โคเนีย", "฿8,000–18,000"],
      ["ฟอกสีฟัน", "฿4,000–12,000"],
      ["จัดฟันใส Invisalign (เคสเต็ม)", "฿80,000–200,000"],
    ],
    note: "ราคาโดยประมาณจากคลินิกในกรุงเทพฯ ราคาจริงขึ้นกับแต่ละคลินิกและความซับซ้อนของเคส",
  },
  botox: {
    rows: [
      ["โบท็อกซ์ (ต่อยูนิต)", "฿80–250"],
      ["หน้าผาก", "10–20 ยูนิต"],
      ["หางตา (ตีนกา) ต่อข้าง", "8–16 ยูนิต"],
      ["ระหว่างคิ้ว", "16–24 ยูนิต"],
      ["กราม (ลดหน้าเหลี่ยม) ต่อข้าง", "25–50 ยูนิต"],
    ],
    note: "คูณจำนวนยูนิตกับราคาต่อยูนิตเพื่อเทียบราคาระหว่างคลินิกได้จริง ควรถามให้ชัดว่าราคาที่แจ้งเป็นต่อยูนิตหรือต่อบริเวณ",
  },
  filler: {
    rows: [
      ["ฟิลเลอร์ Juvederm / Restylane (1 ml)", "฿8,000–25,000"],
      ["ริมฝีปาก", "1 ml"],
      ["ร่องแก้ม", "1–2 ml"],
      ["เสริมจมูก", "0.5–1 ml"],
    ],
    note: "ควรขอดูกล่องและสติกเกอร์ล็อตของฟิลเลอร์ก่อนฉีดทุกครั้ง",
  },
  hifu: {
    rows: [
      ["HIFU ทั่วไป (ต่อครั้ง)", "฿8,000–25,000"],
      ["Ultherapy ของแท้ (ต่อครั้ง)", "฿40,000–80,000+"],
      ["Thermage FLX (ต่อครั้ง)", "฿35,000–70,000"],
    ],
    note: "ราคาต่างกันมากตามเครื่องและจำนวนช็อต ควรถามชื่อเครื่องและจำนวนช็อตก่อนตัดสินใจ",
  },
};

const TH_FAQ: Partial<Record<string, { q: string; a: string }[]>> = {
  botox: [
    {
      q: "เช็คโบท็อกซ์ของแท้อย่างไร?",
      a: "ขอดูกล่องและสติกเกอร์ซีเรียลก่อนฉีดทุกครั้ง คลินิกที่มั่นใจจะเปิดกล่องต่อหน้าคุณ ตรวจว่าชื่อแบรนด์บนกล่อง (Allergan, Dysport, Botulax) ตรงกับที่แจ้งราคา",
    },
    {
      q: "โบท็อกซ์ในกรุงเทพราคาเท่าไหร่?",
      a: "฿80–250 ต่อยูนิต ขึ้นกับแบรนด์ แต่ละบริเวณใช้จำนวนยูนิตไม่เท่ากัน จึงควรถามทั้งราคาต่อยูนิตและจำนวนยูนิตที่จะใช้",
    },
    {
      q: "โบท็อกซ์อยู่ได้นานแค่ไหน?",
      a: "โดยทั่วไป 3–6 เดือน ครั้งแรกมักอยู่สั้นกว่าเล็กน้อย บริเวณกรามมักอยู่ได้นานกว่าบริเวณรอบตา",
    },
  ],
  dental: [
    {
      q: "เลือกคลินิกทำฟันใกล้ฉันอย่างไรให้ปลอดภัย?",
      a: "ตรวจ 3 อย่าง: เลขที่ใบอนุญาตจากทันตแพทยสภา, รีวิวที่มีรูปก่อน–หลังจริงและเล่ารายละเอียดการรักษา, และแบรนด์รากเทียม/วัสดุที่ใช้ซึ่งควรระบุชื่อได้ชัดเจน",
    },
    {
      q: "รากฟันเทียมในกรุงเทพราคาเท่าไหร่?",
      a: "Straumann / Nobel Biocare ฿55,000–80,000 ต่อซี่ · Osstem / Astra ฿35,000–55,000 ต่อซี่ · All-on-4 ทั้งขากรรไกร ฿250,000–500,000 ราคารวมรากเทียม เดือย และครอบฟัน",
    },
    {
      q: "รากฟันเทียมใช้เวลานานแค่ไหน?",
      a: "วันแรกปรึกษาและถอนฟัน จากนั้นรอกระดูกยึดรากเทียม 3–6 เดือน แล้วกลับมาใส่ครอบฟัน ส่วน All-on-4 มักจบใน 1 ทริป 5–7 วัน",
    },
  ],
  filler: [
    {
      q: "ฟิลเลอร์แบรนด์ไหนปลอดภัย?",
      a: "เลือกแบรนด์ที่ผ่าน อย. ไทย เช่น Juvederm, Restylane, Belotero และขอดูกล่องก่อนฉีด ระวังราคาที่ต่ำผิดปกติซึ่งมักหมายถึงของที่ไม่ผ่านการนำเข้าอย่างถูกต้อง",
    },
    {
      q: "ฟิลเลอร์ในกรุงเทพราคาเท่าไหร่?",
      a: "฿8,000–25,000 ต่อ 1 ml ขึ้นกับแบรนด์และบริเวณ (ริมฝีปาก ร่องแก้ม จมูก) ปริมาณที่ใช้ต่างกันตามบริเวณ",
    },
  ],
  hifu: [
    {
      q: "HIFU อยู่ได้นานแค่ไหน?",
      a: "โดยทั่วไปเห็นผลชัดที่ 2–3 เดือนหลังทำ และคงอยู่ประมาณ 6 เดือน–1 ปี ขึ้นกับอายุและสภาพผิว",
    },
    {
      q: "HIFU ในกรุงเทพราคาเท่าไหร่?",
      a: "฿8,000–80,000+ ต่อครั้ง ต่างกันมากตามเครื่อง — Ultherapy ของแท้ราคาสูงกว่าเครื่อง HIFU ทั่วไปหลายเท่า ควรถามชื่อเครื่องและจำนวนช็อต",
    },
  ],
  facial: [
    {
      q: "เลือกคลินิกดูแลผิวหน้าอย่างไร?",
      a: "ตรวจว่ามีแพทย์ผิวหนังประจำคลินิกหรือไม่ และดูว่ารีวิวมีการพูดถึงผลข้างเคียงหรือการแพ้บ่อยแค่ไหน",
    },
  ],
  laser: [
    {
      q: "เลเซอร์ในกรุงเทพราคาเท่าไหร่?",
      a: "พิโคเลเซอร์เริ่มต้น ฿3,000 · CO2 เลเซอร์เริ่มต้น ฿8,000 ชนิดเลเซอร์ที่เหมาะสมต่างกันตามปัญหา (ฝ้า กระ รูขุมขน หลุมสิว)",
    },
  ],
  hair_transplant: [
    {
      q: "ปลูกผมในกรุงเทพราคาเท่าไหร่?",
      a: "FUE 2,000 กราฟท์ เริ่มต้นประมาณ ฿65,000 ราคาคิดต่อกราฟท์ จึงควรขอประเมินจำนวนกราฟท์ที่ต้องใช้ก่อนเทียบราคา",
    },
    {
      q: "หลังปลูกผมพักฟื้นนานแค่ไหน?",
      a: "สะเก็ดบริเวณที่ปลูกหลุดใน 7–10 วัน แต่เห็นผลเต็มที่ต้องรอ 9–12 เดือน ควรดูรีวิวที่มีรูปหลังทำ 6 เดือน–1 ปี",
    },
  ],
  eye: [
    {
      q: "เลสิกในกรุงเทพราคาเท่าไหร่?",
      a: "ขึ้นกับค่าสายตาและสภาพกระจกตา ต้องตรวจละเอียดก่อนจึงจะได้ราคาจริง ควรเลือกคลินิกที่ตรวจความหนากระจกตาและความดันตาอย่างละเอียดก่อนทำ",
    },
  ],
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return Array.from(VALID).map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> }
): Promise<Metadata> {
  const { service } = await params;
  const label = TH_LABELS[service] ?? service;
  const nearMe = TH_NEAR_ME[service];
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const matching = scoped.filter((c) => c.categories.includes(service));
  const count = matching.length;
  const totalReviews = matching.reduce((s, c) => s + c.total_reviews, 0);
  // thin content 방지 — /ko 와 동일 기준.
  const robots = count < 5 ? { index: false, follow: true } : undefined;
  const priceHint = TH_PRICE_HINTS[service];
  const SITE = getSiteUrl();
  const title = `${nearMe ?? `คลินิก${label}`} ในกรุงเทพฯ ${count} แห่ง — รีวิวจริง เช็คราคา`;
  return {
    title: { absolute: title },
    description: `คลินิก${label}ในกรุงเทพฯ ${count} แห่ง จัดอันดับด้วยคะแนนความน่าเชื่อถือจากรีวิว Google ${totalReviews.toLocaleString()} รายการ${priceHint ? ` ${priceHint}` : ""}`,
    alternates: {
      canonical: `${SITE}/th/c/${service}`,
      languages: {
        "en-US": `${SITE}/c/${service}`,
        "th-TH": `${SITE}/th/c/${service}`,
        "ko-KR": `${SITE}/ko/c/${service}`,
        "x-default": `${SITE}/c/${service}`,
      },
    },
    ...(robots && { robots }),
    openGraph: {
      type: "website",
      locale: "th_TH",
      title,
      description: `จัดอันดับอิสระจากการวิเคราะห์รีวิว Google ${totalReviews.toLocaleString()} รายการ`,
      url: `${SITE}/th/c/${service}`,
      images: [{
        url: `${SITE}/api/og?title=${encodeURIComponent(`คลินิก${label} ${count} แห่ง`)}&sub=${encodeURIComponent(`วิเคราะห์รีวิว ${totalReviews.toLocaleString()} รายการ`)}&count=${count}`,
        width: 1200,
        height: 630,
        alt: `คลินิก${label}ในกรุงเทพฯ`,
      }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ThServicePage(
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  if (!VALID.has(service)) notFound();

  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (focusValid && !focusValid.has(service)) notFound();

  const db = await loadMasterDb();
  const filtered = filterByCategory(applySiteFilter(db.clinics, cfg), service)
    .sort((a, b) => b.trust_score - a.trust_score);
  const label = TH_LABELS[service] ?? service;

  const byDistrict = new Map<string, number>();
  for (const c of filtered) {
    if (!c.district) continue;
    byDistrict.set(c.district, (byDistrict.get(c.district) ?? 0) + 1);
  }
  const districts = Array.from(byDistrict.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const totalReviews = filtered.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = filtered.filter((c) => c.scraped_review_count > 0).length;
  const faqs = TH_FAQ[service] ?? [];
  const priceTable = TH_PRICE_TABLE[service];

  const cityOrder = ["Bangkok", "Pattaya", "Phuket", "Chiang Mai", "Koh Samui", "Krabi", "Hua Hin"];
  const cityTh: Record<string, string> = {
    Bangkok: "กรุงเทพฯ", Pattaya: "พัทยา", Phuket: "ภูเก็ต", "Chiang Mai": "เชียงใหม่",
    "Koh Samui": "เกาะสมุย", Krabi: "กระบี่", "Hua Hin": "หัวหิน",
  };
  const byCity = new Map<string, typeof filtered>();
  for (const c of filtered) {
    const k = c.city_label || "Bangkok";
    if (!byCity.has(k)) byCity.set(k, []);
    byCity.get(k)!.push(c);
  }
  const sortedCities = cityOrder.filter((c) => byCity.has(c))
    .concat([...byCity.keys()].filter((c) => !cityOrder.includes(c)));

  // EN 허브와 동일한 렌더 예산 — 도시별 50장씩 찍으면 페이지가 1 MB를 넘는다
  // (2026-08-06 감사: /c/dental 이 1,395 KB였다). 나머지는 /city/{slug} 로 유도.
  const MAIN_CITY_CARDS = 30;
  const OTHER_CITY_CARDS = 5;
  const FULL_CARDS = 10;
  let globalRank = 1;

  return (
    <>
      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={filtered.length}
        totalReviews={totalReviews}
        withScraped={withScraped}
        entityLabel="คลินิก"
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/th" className="hover:text-[var(--fg)]">หน้าแรก</a>
          <span className="mx-2">›</span>
          <span>{label}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <CategoryIcon category={service} size={32} />
          คลินิก{label}ในกรุงเทพฯ
        </h1>
        <p className="text-[var(--muted)] mb-8">
          จัดอันดับ {filtered.length} แห่งด้วยคะแนนความน่าเชื่อถือ คำนวณจากข้อความรีวิว Google และข้อมูลคลินิก
          {TH_PRICE_HINTS[service] && <> ช่วงราคา: {TH_PRICE_HINTS[service]}</>}
        </p>

        {priceTable && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-3">ราคา{label}ในกรุงเทพฯ</h2>
            {/* 넓은 표가 페이지 자체를 옆으로 밀지 않도록 자체 스크롤 컨테이너 안에 둔다 */}
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[20rem] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 font-semibold">รายการ</th>
                    <th className="text-left py-2 font-semibold">ราคาโดยประมาณ</th>
                  </tr>
                </thead>
                <tbody>
                  {priceTable.rows.map(([item, price]) => (
                    <tr key={item} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-4">{item}</td>
                      <td className="py-2 tabular-nums whitespace-nowrap">{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-[var(--muted)]">{priceTable.note}</p>
          </section>
        )}

        {districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              {label}แยกตามเขต
            </h2>
            <div className="flex flex-wrap gap-2">
              {districts.map(([d, n]) => (
                <a
                  key={d}
                  href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {d} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {sortedCities.map((city) => {
          const cityList = byCity.get(city) ?? [];
          if (cityList.length === 0) return null;
          const citySlug = cityList[0].city_slug || city.toLowerCase().replace(/\s+/g, "-");
          const isMain = city === "Bangkok";
          const visible = cityList.slice(0, isMain ? MAIN_CITY_CARDS : OTHER_CITY_CARDS);
          const more = cityList.length - visible.length;
          const cityLabel = cityTh[city] ?? city;
          return (
            <section key={city} className={isMain ? "" : "mt-12 pt-8 border-t border-[var(--border)]"}>
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  คลินิก{label}ใน{cityLabel}
                  <span className="text-[var(--muted)] font-normal text-base ml-2">
                    {cityList.length} แห่ง
                  </span>
                </h2>
                <a
                  href={`/city/${citySlug}`}
                  className="text-sm font-bold hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  ดูคลินิกทั้งหมดใน{cityLabel} →
                </a>
              </div>
              <div className="grid gap-3">
                {visible.slice(0, 10).map((c) => {
                  const r = globalRank++;
                  return <ClinicCard key={c.id} clinic={c} rank={r} />;
                })}
              </div>
              {visible.length > 10 && (
                <div className="mt-6">
                  <div className="grid gap-1.5">
                    {visible.slice(10).map((c) => {
                      const r = globalRank++;
                      return <ClinicCardCompact key={c.id} clinic={c} rank={r} />;
                    })}
                  </div>
                </div>
              )}
              {more > 0 && (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  <a href={`/city/${citySlug}`} className="hover:underline" style={{ color: "var(--accent)" }}>
                    ดูเพิ่มอีก {more} แห่งใน{cityLabel} →
                  </a>
                </p>
              )}
            </section>
          );
        })}

        <div className="my-8">
          <BookingForm defaultService={service} lang="th" />
        </div>

        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">คลินิก{label}ในกรุงเทพฯ — คำถามที่พบบ่อย</h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4">
                  <summary className="font-medium cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-sm text-[var(--muted)]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <BreadcrumbJsonLd items={[
          { name: "หน้าแรก", url: "/th" },
          { name: label, url: `/th/c/${service}` },
        ]} />
        <FaqJsonLd faqs={faqs} />
        <CollectionPageJsonLd
          name={`คลินิก${label}ในกรุงเทพฯ`}
          description={`จัดอันดับคลินิก${label}ในกรุงเทพฯ ${filtered.length} แห่ง ด้วยคะแนนความน่าเชื่อถือจากการวิเคราะห์รีวิว Google`}
          url={`/th/c/${service}`}
          items={filtered}
        />
      </div>
    </>
  );
}
