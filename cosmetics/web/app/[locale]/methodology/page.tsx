import type { Metadata } from "next";
import Link from "next/link";
import { STATIC_LOCALES, localeAlternates, type Locale } from "@/lib/i18n";
import { coverage } from "@/lib/scoreCoverage";
import { PRICE_FRESH_DAYS } from "@/lib/priceFreshness";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return STATIC_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const title =
    loc === "th"
      ? "วิธีให้คะแนน — เกณฑ์ ที่มาของข้อมูล และข้อจำกัด"
      : "How We Score — Formula, Sources and Limits";
  const description =
    loc === "th"
      ? "คะแนนรวม = ส่วนผสม 45% + รีวิว 45% + ความคุ้มค่า 10% พร้อมที่มาของข้อมูลทุกตัวเลข จำนวนสินค้าที่วัดได้จริง และสิ่งที่เรายังไม่รู้"
      : "Total score = 45% ingredients + 45% reviews + 10% value — with the source of every number, how many products we can actually measure, and what we don't know.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/methodology`,
      languages: localeAlternates((l) => `${BASE}/${l}/methodology`),
    },
  };
}

/** A labelled card row. */
function Row({
  head,
  children,
}: {
  head: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100">
      <p className="font-semibold text-neutral-800">{head}</p>
      <div className="mt-1.5 space-y-1 text-sm text-neutral-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-neutral-800">{children}</span>;
}

export default async function Methodology({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const th = locale === "th";

  // Every figure below is counted from the catalogue at build time. A trust
  // page is the worst place for a hand-copied number: bangkoktopclinic's
  // editorial policy claimed "955 of 1,001 URLs" long after the real count
  // had drifted to 857.
  const c = coverage();
  const n = (x: number) => x.toLocaleString("en-US");
  const pct = (x: number) => Math.round((x / c.products) * 100);
  const withReviews = c.products - c.withoutReviews;

  const weights = [
    {
      pct: 45,
      label: th ? "ส่วนผสม" : "Ingredients",
      desc: th
        ? "ให้น้ำหนักตามหลักฐานของสารออกฤทธิ์ต่อปัญหานั้น หักคะแนนสารที่ควรระวัง"
        : "Evidence-weighted actives for the concern, minus caution-flag penalties.",
      color: "bg-rose-400",
    },
    {
      pct: 45,
      label: th ? "รีวิว" : "Reviews",
      desc: th
        ? "ค่าเฉลี่ยแบบเบย์ (ปรับตามจำนวนรีวิว)"
        : "Bayesian average adjusted by review count.",
      color: "bg-rose-300",
    },
    {
      pct: 10,
      label: th ? "ความคุ้มค่า" : "Value",
      desc: th
        ? "ราคาต่อมล. เทียบค่ามัธยฐานของรูปแบบเดียวกัน"
        : "Price-per-ml against the median for the same dosage form.",
      color: "bg-amber-300",
    },
  ];

  return (
    <article className="prose max-w-2xl space-y-8">
      {/* ── Header ── */}
      <header className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif-display text-3xl font-semibold text-neutral-900">
          {th ? "วิธีให้คะแนน" : "How We Score"}
        </h1>
        <p className="mt-2 text-base text-neutral-600 leading-relaxed">
          {th
            ? `คะแนนรวมคำนวณจาก 3 ปัจจัย จากสินค้า ${n(c.products)} ชิ้น ${n(c.brands)} แบรนด์ หน้านี้บอกที่มาของทุกตัวเลข และบอกด้วยว่าตัวไหนเรายังวัดไม่ได้`
            : `The total score comes from three factors across ${n(c.products)} products and ${n(c.brands)} brands. This page gives the source of every number — and says which ones we cannot yet measure.`}
        </p>
      </header>

      {/* ── Formula ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-4">
          {th ? "สูตรคะแนนรวม" : "Score Formula"}
        </h2>
        {weights.map((w) => (
          <div
            key={w.label}
            className="flex items-start gap-4 rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100"
          >
            <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-[#efe1db] bg-rose-50">
              <span className="text-xl font-bold text-rose-500 leading-none">{w.pct}</span>
              <span className="text-[10px] text-[#c9a86a] font-medium">%</span>
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="font-semibold text-neutral-800">{w.label}</p>
              <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className={`h-full rounded-full ${w.color}`} style={{ width: `${w.pct}%` }} />
              </div>
              <p className="text-sm text-neutral-500">{w.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Equation ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-2">
          {th ? "สมการคำนวณ" : "The Formula"}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100 space-y-3">
          <p className="font-mono text-sm text-neutral-700 leading-relaxed">
            {th
              ? "คะแนนรวม = (ส่วนผสม × 0.45) + (รีวิว × 0.45) + (ความคุ้มค่า × 0.10)"
              : "total = (ingredient × 0.45) + (review × 0.45) + (value × 0.10)"}
          </p>
          <div className="border-t border-[#efe1db] pt-3">
            <p className="text-xs text-neutral-500 mb-1">{th ? "ตัวอย่าง:" : "Example:"}</p>
            <p className="font-mono text-sm text-neutral-600 leading-relaxed">
              (25 × 0.45) + (98 × 0.45) + (95 × 0.10) = 11.25 + 44.10 + 9.50 = 64.85 → 65
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {th ? "ปัดเป็นจำนวนเต็ม" : "Rounded to the nearest integer"}
            </p>
          </div>
          <p className="text-xs text-neutral-500 border-t border-[#efe1db] pt-3">
            {th
              ? "เครื่องสำอางแต่งหน้าใช้สูตรต่างออกไป (รีวิว×70% + คุ้มค่า×30% บวก 5 เมื่อมีค่า SPF) เพราะเราไม่ให้คะแนนส่วนผสมกับสินค้าประเภทนี้"
              : "Makeup uses a different formula (Reviews×70% + Value×30%, +5 with an SPF) because we do not score it on ingredients."}
          </p>
        </div>
      </section>

      {/* ── Sources ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-4">
          {th ? "ข้อมูลมาจากไหน" : "Where the data comes from"}
        </h2>
        <div className="space-y-3">
          <Row head={th ? "ส่วนผสม" : "Ingredients"}>
            <p>
              {th
                ? "รายการส่วนผสม (INCI) จากหน้าสินค้าของผู้ขาย เทียบกับตารางอ้างอิงของเราที่ให้คะแนนสารออกฤทธิ์แต่ละตัวต่อปัญหาผิว 6 แบบ (0–3) และติดธงสารที่ควรระวัง"
                : "The INCI list on the retailer's product page, scored against our reference table, which rates each active 0–3 for six skin concerns and flags cautions."}
            </p>
            <p>
              {th ? "วัดได้จริง " : "Measured on "}
              <Num>
                {n(c.measured)}/{n(c.products)}
              </Num>
              {th ? ` ชิ้น (${pct(c.measured)}%)` : ` products (${pct(c.measured)}%)`}
            </p>
          </Row>

          <Row head={th ? "รีวิว" : "Reviews"}>
            <p>
              {th
                ? "คะแนนดาวรวมและจำนวนรีวิวจาก Konvy ปรับแบบเบย์ และปรับสเกลกับช่วงที่คอร์ปัสนี้ใช้จริง (เพราะคะแนนดิบเกาะ 5.0 กันแน่น)"
                : "Konvy's aggregate star rating and review count, Bayesian-shrunk and rescaled against the band this corpus actually occupies (raw ratings cluster hard at 5.0)."}
            </p>
            <p>
              <Num>{n(c.konvyReviewCount)}</Num>
              {th ? " รีวิว ครอบคลุม " : " reviews across "}
              <Num>{n(withReviews)}</Num>
              {th ? " ชิ้น" : " products"}
            </p>
            <p className="text-neutral-500">
              {th
                ? `เราเก็บ "ตัวบท" รีวิวไว้เพียง ${n(c.reviewTextsHeld)} ชิ้น จากสินค้า ${n(c.reviewTextProducts)} รายการ และใช้มันเขียนสรุปข้อดีข้อเสียเท่านั้น ไม่ได้ใช้คิดคะแนน`
                : `We hold review text for only ${n(c.reviewTextProducts)} products (${n(c.reviewTextsHeld)} reviews). That text is used for the pros-and-cons summaries, never for the score.`}
            </p>
          </Row>

          <Row head={th ? "ราคาและความคุ้มค่า" : "Price and value"}>
            <p>
              {th
                ? "ราคาต่อมล. เทียบค่ามัธยฐานของรูปแบบเดียวกัน (เซรั่มเทียบเซรั่ม ไม่เทียบกับโลชั่นขวด 500 มล.)"
                : "Price per ml against the median for the same dosage form — serums against serums, not against a 500ml lotion."}
            </p>
            <p>
              {th ? "ราคาเก็บระหว่าง " : "Prices collected between "}
              <Num>{c.priceFrom ?? "—"}</Num> – <Num>{c.priceTo ?? "—"}</Num>
            </p>
            <p className="text-neutral-500">
              {th
                ? `ทุกหน้าสินค้าแสดงวันที่เก็บราคาของชิ้นนั้น และป้ายส่วนลดจะถูกถอดออกเมื่อราคาเก่ากว่า ${PRICE_FRESH_DAYS} วัน เพราะ "ลด 40%" เป็นคำกล่าวถึงสิ่งที่ร้านกำลังทำอยู่ตอนนี้`
                : `Each product page carries its own collection date, and discount badges are dropped once a price is older than ${PRICE_FRESH_DAYS} days — "-40%" is a claim about what the shop is doing right now.`}
            </p>
          </Row>

          <Row head={th ? "แหล่งอ้างอิงข้าม" : "Cross-references"}>
            <p>
              {c.retailerSources.length
                ? c.retailerSources
                    .map((s) => `${s.name} ${n(s.products)}`)
                    .join(th ? " · " : " · ")
                : "—"}
            </p>
            <p className="text-neutral-500">
              {th
                ? "การจับคู่กับ Boots นับเฉพาะที่ยืนยันด้วยบาร์โค้ด ชื่อที่คล้ายกันแยกสินค้าภายในแบรนด์เดียวกันไม่ได้ และการจับคู่ผิดจะทำให้อันดับเพี้ยน"
                : "Boots joins count only when confirmed by barcode. Name similarity cannot tell products apart within a brand, and a wrong join would move a ranking."}
            </p>
          </Row>
        </div>
      </section>

      {/* ── Coverage, gaps included ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-1">
          {th ? "สิ่งที่เรายังวัดไม่ได้" : "What we cannot measure yet"}
        </h2>
        <p className="text-sm text-neutral-500 mb-3">
          {th
            ? "ส่วนนี้มีเพื่อให้คุณรู้ว่าคะแนนไหนเชื่อได้แค่ไหน"
            : "This section exists so you can tell how far to trust a given score."}
        </p>
        <div className="space-y-3">
          <Row
            head={
              th
                ? `ไม่มีรายการส่วนผสม — ${n(c.noIngredientData)} ชิ้น (${pct(c.noIngredientData)}%)`
                : `No ingredient list — ${n(c.noIngredientData)} products (${pct(c.noIngredientData)}%)`
            }
          >
            <p>
              {th
                ? "ผู้ขายไม่ได้ลงรายการส่วนผสมไว้ คะแนนส่วนผสมของสินค้ากลุ่มนี้จึงเป็นค่าตั้งต้น 10/100 ไม่ใช่ผลวิเคราะห์ เราไม่แสดงแถบคะแนนส่วนผสมในหน้าเหล่านั้น แต่คะแนนรวมยังรวมค่าตั้งต้นนั้นอยู่ตามสูตรเดิม — ที่ 10 คูณ 0.45 สินค้ากลุ่มนี้จึงไม่เคยขึ้นถึง 20 อันดับแรกของปัญหาใดเลย"
                : "The retailer never published an ingredient list. For these, the ingredient score is a 10/100 default rather than an analysis, so we do not draw the ingredient bar on those pages — but the total still includes that default at the usual weight. At 10 × 0.45, none of them reaches the top 20 of any concern."}
            </p>
          </Row>
          <Row
            head={
              th
                ? `อ่านส่วนผสมแล้วไม่พบสารออกฤทธิ์ที่ให้คะแนน — ${n(c.listOnly)} ชิ้น`
                : `Read the list, found no scored active — ${n(c.listOnly)} products`
            }
          >
            <p>
              {th
                ? "กลุ่มนี้ต่างจากกลุ่มข้างบน เรามีรายการส่วนผสมและอ่านแล้ว ผลคือไม่มีสารที่ตารางอ้างอิงให้คะแนนต่อปัญหานั้น 10/100 จึงเป็นข้อค้นพบจริง และแถบคะแนนยังแสดงอยู่"
                : "Unlike the group above, we have the list and read it; nothing in it is a scored active for that concern. Here 10/100 is a real finding, and the bar stays."}
            </p>
          </Row>
          <Row
            head={
              th
                ? `ยังไม่มีรีวิว — ${n(c.withoutReviews)} ชิ้น`
                : `No reviews yet — ${n(c.withoutReviews)} products`
            }
          >
            <p>
              {th
                ? "องค์ประกอบรีวิวเป็น 0 สำหรับสินค้ากลุ่มนี้ ไม่ได้ปรับน้ำหนักใหม่ให้"
                : "The review component is 0 for these. We do not re-weight the formula to compensate."}
            </p>
          </Row>
        </div>
      </section>

      {/* ── Neutrality ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-4">
          {th ? "ความเป็นกลาง" : "Neutrality"}
        </h2>
        <Row head={th ? "ค่าคอมมิชชันไม่มีผลต่ออันดับ" : "Commission never affects ranking"}>
          <p>
            {th
              ? "บางลิงก์ไปร้านค้าเป็นลิงก์พันธมิตร และเราได้ส่วนแบ่งเมื่อมีการสั่งซื้อ อันดับคำนวณจากส่วนผสม รีวิว และราคาเท่านั้น ไม่มีช่องให้จ่ายเพื่อเลื่อนอันดับ พื้นที่โฆษณาจะติดป้ายว่าเป็นโฆษณาและอยู่นอกตารางอันดับ"
              : "Some links to shops are affiliate links and we earn a share when an order goes through. Ranking is computed from ingredients, reviews and price alone — there is no way to pay for a position. Advertising is labelled as advertising and sits outside the ranked tables."}
          </p>
        </Row>
      </section>

      {/* ── Limits. Deliberately not an expert-review badge: there is no
             reviewing pharmacist or dermatologist, and claiming one would be
             the "named a platform we never used" mistake in a worse place. ── */}
      <section className="not-prose space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-neutral-800 mb-4">
          {th ? "ขอบเขตของหน้านี้" : "The limits of this"}
        </h2>
        <Row head={th ? "นี่ไม่ใช่คำแนะนำทางการแพทย์" : "This is not medical advice"}>
          <p>
            {th
              ? "คะแนนทั้งหมดรวบรวมจากหน้าสินค้าของผู้ขายและเอกสารอ้างอิงด้านส่วนผสมที่เผยแพร่แล้ว ไม่มีเภสัชกรหรือแพทย์ผิวหนังตรวจทานหน้านี้ — เราบอกตรง ๆ แทนที่จะติดตราผู้เชี่ยวชาญที่ไม่มีอยู่"
              : "Every score is compiled from retailer product pages and published ingredient references. No pharmacist or dermatologist reviews this site — we would rather say so than wear an expert badge we do not have."}
          </p>
          <p>
            {th
              ? "สารออกฤทธิ์ตัวเดียวกันให้ผลต่างกันตามความเข้มข้น สูตร และผิวของแต่ละคน ถ้าคุณมีปัญหาผิวที่ต้องรักษา ให้ปรึกษาแพทย์ ไม่ใช่ตารางอันดับ"
              : "The same active behaves differently depending on its concentration, the formula around it, and your skin. For a skin condition that needs treating, see a doctor, not a ranking table."}
          </p>
        </Row>
      </section>

      {/* ── Freshness ── */}
      <footer className="not-prose border-t border-neutral-100 pt-4 space-y-1">
        <p className="text-xs text-neutral-400">
          {th ? "ข้อมูลชุดนี้สร้างเมื่อ" : "This dataset was built on"}{" "}
          <Num>{c.generated ?? "—"}</Num>
          {" · "}
          {th ? "สินค้า" : "products"} <Num>{n(c.products)}</Num>
          {" · "}
          {th ? "แบรนด์" : "brands"} <Num>{n(c.brands)}</Num>
        </p>
        <p className="text-xs text-neutral-400">
          {th ? "ดูเพิ่ม: " : "See also: "}
          <Link href={`/${locale}/privacy`} className="underline hover:text-rose-500">
            {th ? "ความเป็นส่วนตัวและการเปิดเผยข้อมูล" : "Privacy and disclosures"}
          </Link>
        </p>
      </footer>
    </article>
  );
}
