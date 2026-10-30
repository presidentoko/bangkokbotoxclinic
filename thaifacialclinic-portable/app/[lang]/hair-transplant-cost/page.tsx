import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { SITE } from "@/lib/i18n";
import { loadClinics } from "@/lib/data";
import Header from "@/components/Header";
import {
  hairPrices, hairPricesCollected, hairPricesCheckedSites, transplantClinicCount,
  perGraftRange, estimateFor, baht, type HairPrice,
} from "@/lib/hairPrices";

// 2026-10-30: "hair transplant thailand cost"(100–1K, 경쟁 Low) · "ปลูกผม ราคา"(1K–10K).
// 가격은 클리닉이 자기 사이트에 공개한 것만 (lib/hairPrices.ts). 영어·태국어만 낸다 —
// 원문이 태국어 페이지라 태국어 판이 가장 정확하고, 다른 언어는 번역할 근거가 없다.
const LANGS = ["en", "th"] as const;
type PageLang = (typeof LANGS)[number];

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_TH = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
function dateLabel(iso: string, lang: PageLang) {
  const [y, m, d] = iso.split("-").map(Number);
  return lang === "th" ? `${d} ${MONTHS_TH[m - 1]} ${y + 543}` : `${d} ${MONTHS_EN[m - 1]} ${y}`;
}

const TECH_TH: Record<string, string> = {
  "FUE": "FUE",
  "FUT": "FUT",
  "Non-shaven FUE": "FUE แบบไม่โกน",
  "Long Hair FUE": "Long Hair FUE",
  "DHI": "DHI",
  "Long Hair DHI": "Long Hair DHI",
  "Eyebrow": "ปลูกคิ้ว",
};
const tech = (t: string, lang: PageLang) => (lang === "th" ? TECH_TH[t] ?? t : t);

function copy(lang: PageLang) {
  const n = transplantClinicCount();
  const fue = perGraftRange("FUE");
  const est2k = estimateFor(2000, "FUE");
  const year = hairPricesCollected.slice(0, 4);
  const unl = hairPrices.filter((p) => p.kind === "unlimited" && p.min != null).map((p) => p.min!);
  const unlText = unl.length ? (unl.length === 1 ? baht(unl[0]) : `${baht(Math.min(...unl))}–${baht(Math.max(...unl))}`) : null;
  if (lang === "th") {
    return {
      title: `ปลูกผม ราคาเท่าไหร่ (${Number(year) + 543}): ราคาจริงที่ ${n} คลินิกในไทยประกาศไว้`,
      description: `ราคาปลูกผมที่คลินิกในไทยประกาศบนเว็บไซต์ของตัวเอง${fue ? ` FUE กราฟต์ละ ${baht(fue.lo)}–${baht(fue.hi)}` : ""} พร้อมแพ็กเกจเหมากราฟต์ เปรียบเทียบ ${n} คลินิก ทุกราคามีลิงก์ต้นทาง`,
      h1: `ปลูกผม ราคาเท่าไหร่? ราคาที่ ${n} คลินิกในไทยประกาศไว้`,
      intro: `เราเปิดเว็บไซต์ของคลินิกปลูกผมในไทย ${hairPricesCheckedSites} แห่ง และเก็บเฉพาะราคาที่คลินิกเขียนไว้เองบนหน้าเว็บ ข้อมูลวันที่ ${dateLabel(hairPricesCollected, "th")} ทุกราคามีลิงก์ไปยังหน้าต้นทาง`,
      perGraftTitle: "ราคาต่อกราฟต์",
      perGraftNote: "คลินิกส่วนใหญ่คิดราคาตามจำนวนกราฟต์ (กอรากผมที่ย้าย) ตารางนี้คือราคาต่อกราฟต์ที่คลินิกประกาศ",
      estimateTitle: "ถ้าปลูก 2,000 กราฟต์ จะประมาณเท่าไหร่?",
      estimateBody: est2k
        ? `คิดจากราคา FUE ต่อกราฟต์ที่ประกาศไว้ (${baht(fue!.lo)}–${baht(fue!.hi)}) × 2,000 กราฟต์ = ${baht(est2k.lo)}–${baht(est2k.hi)} นี่คือการคูณเลขของเรา ไม่ใช่ใบเสนอราคา ยังไม่รวมราคาขั้นต่ำหรือโปรโมชั่นของแต่ละคลินิก`
        : "",
      packagesTitle: "แพ็กเกจและช่วงราคา",
      packagesNote: "บางคลินิกขายแบบเหมากราฟต์ (ราคาเดียวไม่จำกัดจำนวนกราฟต์) หรือแบ่งตามช่วงจำนวนกราฟต์",
      cols: { clinic: "คลินิก", technique: "เทคนิค", price: "ราคา", detail: "รายละเอียดตามที่คลินิกเขียน", source: "ต้นทาง" },
      perGraft: "ต่อกราฟต์",
      eyebrowTitle: "ปลูกคิ้ว",
      howTitle: "เราได้ตัวเลขเหล่านี้มาอย่างไร",
      how: [
        `เปิดเว็บไซต์คลินิกปลูกผมในไทย ${hairPricesCheckedSites} แห่ง (หน้าแรก หน้าบริการ และหน้าราคา) เมื่อ ${dateLabel(hairPricesCollected, "th")}`,
        "เก็บเฉพาะราคาที่คลินิกระบุว่าเป็นราคาของคลินิกเอง ข้อความทำนอง \"ราคาโดยทั่วไปในตลาด\" ไม่นับ",
        "เป็นราคาที่ประกาศ ไม่ใช่ใบเสนอราคา โปรโมชั่นเปลี่ยนได้ และราคาจริงขึ้นกับจำนวนกราฟต์ที่แพทย์ประเมิน",
        "ข้อมูลทั่วไปเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ ปรึกษาแพทย์ที่มีใบอนุญาตก่อนตัดสินใจ",
      ],
      faqTitle: "คำถามที่พบบ่อย",
      faqs: [
        { q: "ปลูกผม FUE ราคาเท่าไหร่?", a: fue ? `คลินิกที่ประกาศราคาต่อกราฟต์ไว้คิด FUE กราฟต์ละ ${baht(fue.lo)}–${baht(fue.hi)} ถ้าปลูก 2,000 กราฟต์ คิดคร่าวๆ ได้ ${baht(est2k!.lo)}–${baht(est2k!.hi)}${unlText ? ` บางคลินิกมีแพ็กเกจเหมากราฟต์เริ่มต้น ${unlText}` : ""}` : "" },
        { q: "FUE แบบไม่โกนแพงกว่าไหม?", a: (() => { const r = perGraftRange("Non-shaven FUE"); return r ? `แพงกว่า คลินิกที่ประกาศราคาคิด FUE แบบไม่โกนกราฟต์ละ ${baht(r.lo)}–${baht(r.hi)} สูงกว่า FUE แบบปกติ` : ""; })() },
        { q: "แพ็กเกจเหมากราฟต์คุ้มไหม?", a: "ขึ้นกับจำนวนกราฟต์ที่ต้องใช้ ถ้าแพทย์ประเมินว่าต้องใช้กราฟต์มาก แพ็กเกจเหมาอาจถูกกว่าคิดรายกราฟต์ ให้ถามคลินิกว่าแพ็กเกจรวมกี่กราฟต์จริงและรวมอะไรบ้าง" },
        { q: "ราคาเหล่านี้มาจากไหน?", a: `จากเว็บไซต์ของคลินิกเอง เก็บเมื่อ ${dateLabel(hairPricesCollected, "th")} แต่ละแถวในตารางมีลิงก์ไปยังหน้าที่ระบุราคา` },
      ],
      back: "ดูคลินิกปลูกผมทั้งหมด",
    };
  }
  return {
    title: `Hair Transplant Cost in Thailand (${year}): Prices ${n} Clinics Publish`,
    description: `What Thai hair transplant clinics publish on their own websites${fue ? `: FUE at ${baht(fue.lo)}–${baht(fue.hi)} per graft` : ""}, plus unlimited-graft packages. ${n} clinics compared, every price linked to its source.`,
    h1: `Hair Transplant Cost in Thailand: What ${n} Clinics Publish`,
    intro: `We opened the websites of ${hairPricesCheckedSites} hair transplant clinics in Thailand and kept only the prices each clinic states for itself. Collected ${dateLabel(hairPricesCollected, "en")}; every price links to the page it came from.`,
    perGraftTitle: "Price per graft",
    perGraftNote: "Most clinics charge by the number of grafts (follicle units moved). These are the per-graft prices clinics publish.",
    estimateTitle: "What would 2,000 grafts cost?",
    estimateBody: est2k
      ? `Using the published FUE per-graft prices (${baht(fue!.lo)}–${baht(fue!.hi)}) × 2,000 grafts = ${baht(est2k.lo)}–${baht(est2k.hi)}. That is our arithmetic, not a quote: it ignores each clinic's minimum charge and promotions.`
      : "",
    packagesTitle: "Packages and price ranges",
    packagesNote: "Some clinics sell an unlimited-graft package at one price, or price by graft bands.",
    cols: { clinic: "Clinic", technique: "Technique", price: "Price", detail: "As the clinic states it", source: "Source" },
    perGraft: "per graft",
    eyebrowTitle: "Eyebrow transplant",
    howTitle: "How we got these numbers",
    how: [
      `We opened the websites (home, service and price pages) of ${hairPricesCheckedSites} hair transplant clinics in Thailand on ${dateLabel(hairPricesCollected, "en")}.`,
      "Only prices a clinic states as its own count. Lines such as \"the market rate is usually…\" are left out.",
      "These are published prices, not quotes. Promotions change, and the real price depends on the number of grafts your doctor recommends.",
      "General information, not medical advice. Talk to a licensed doctor before deciding.",
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      { q: "How much does an FUE hair transplant cost in Thailand?", a: fue ? `Clinics that publish a per-graft price charge ${baht(fue.lo)}–${baht(fue.hi)} per graft for FUE. For 2,000 grafts that works out at roughly ${baht(est2k!.lo)}–${baht(est2k!.hi)}.${unlText ? ` Some clinics also sell unlimited-graft packages starting at ${unlText}.` : ""}` : "" },
      { q: "Is non-shaven FUE more expensive?", a: (() => { const r = perGraftRange("Non-shaven FUE"); return r ? `Yes. Clinics that publish it charge ${baht(r.lo)}–${baht(r.hi)} per graft for non-shaven FUE, above their standard FUE rate.` : ""; })() },
      { q: "Are unlimited-graft packages worth it?", a: "It depends on how many grafts you need. If your doctor plans a large session, a flat package can beat per-graft pricing. Ask how many grafts the package really covers and what it includes." },
      { q: "How does Thailand compare with Turkey?", a: "We only compare clinics in Thailand with each other, so we do not quote Turkish prices. Compare like with like: the same technique and the same number of grafts." },
      { q: "Where do these prices come from?", a: `From the clinics' own websites, collected ${dateLabel(hairPricesCollected, "en")}. Each row in the tables links to the page that states the price.` },
    ],
    back: "See all hair transplant clinics",
  };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: PageLang = lang === "th" ? "th" : "en";
  const c = copy(l);
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: `${SITE.origin}/${l}/hair-transplant-cost/`,
      languages: {
        en: `${SITE.origin}/en/hair-transplant-cost/`,
        th: `${SITE.origin}/th/hair-transplant-cost/`,
        "x-default": `${SITE.origin}/en/hair-transplant-cost/`,
      },
    },
  };
}

function priceCell(p: HairPrice, lang: PageLang, perGraftWord: string) {
  if (p.kind === "per_graft" && p.per_graft != null) return `${baht(p.per_graft)} ${perGraftWord}`;
  if (p.min != null && p.max != null) return `${baht(p.min)}–${baht(p.max)}`;
  if (p.min != null) return lang === "th" ? `เริ่มต้น ${baht(p.min)}` : `from ${baht(p.min)}`;
  return "—";
}

export default async function HairTransplantCostPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const l: PageLang = lang === "th" ? "th" : "en";
  const c = copy(l);
  const listed = new Set(loadClinics().clinics.map((x) => x.slug));

  const perGraft = hairPrices.filter((p) => p.kind === "per_graft" && p.technique !== "Eyebrow")
    .sort((a, b) => (a.per_graft ?? 0) - (b.per_graft ?? 0));
  const packages = hairPrices.filter((p) => p.kind !== "per_graft" && p.technique !== "Eyebrow")
    .sort((a, b) => (a.min ?? 0) - (b.min ?? 0));
  const eyebrow = hairPrices.filter((p) => p.technique === "Eyebrow");
  const faqs = c.faqs.filter((f) => f.a);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const Table = ({ rows }: { rows: HairPrice[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-[rgb(var(--muted))]">
            <th className="pb-2 pr-3 font-semibold">{c.cols.clinic}</th>
            <th className="pb-2 pr-3 font-semibold">{c.cols.technique}</th>
            <th className="pb-2 pr-3 font-semibold text-right">{c.cols.price}</th>
            <th className="pb-2 pr-3 font-semibold">{c.cols.detail}</th>
            <th className="pb-2 font-semibold">{c.cols.source}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={i} className="border-t align-top" style={{ borderColor: "rgb(var(--border))" }}>
              <td className="py-2 pr-3 font-medium">
                {listed.has(p.slug) ? <Link href={`/${l}/clinic/${p.slug}/`} className="hover:underline">{p.clinic}</Link> : p.clinic}
              </td>
              <td className="py-2 pr-3 whitespace-nowrap">{tech(p.technique, l)}</td>
              <td className="py-2 pr-3 text-right tabular-nums font-semibold whitespace-nowrap">{priceCell(p, l, c.perGraft)}</td>
              <td className="py-2 pr-3 text-xs text-[rgb(var(--muted))]">{l === "th" ? p.note_th : p.note_en}</td>
              <td className="py-2 text-xs">
                <a href={p.url} target="_blank" rel="nofollow noopener" className="underline text-[rgb(var(--muted))]">
                  {new URL(p.url).hostname.replace(/^www\./, "")}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header lang={lang} />
      <main className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        <header>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tighter-display leading-tight">{c.h1}</h1>
          <p className="mt-3 text-base text-[rgb(var(--muted))] leading-relaxed max-w-3xl">{c.intro}</p>
        </header>

        <section>
          <h2 className="text-xl font-bold mb-1">{c.perGraftTitle}</h2>
          <p className="text-sm text-[rgb(var(--muted))] mb-3">{c.perGraftNote}</p>
          <Table rows={perGraft} />
        </section>

        {c.estimateBody && (
          <section className="rounded-2xl border p-5" style={{ borderColor: "rgb(var(--border))" }}>
            <h2 className="text-lg font-bold mb-1">{c.estimateTitle}</h2>
            <p className="text-sm leading-relaxed">{c.estimateBody}</p>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-1">{c.packagesTitle}</h2>
          <p className="text-sm text-[rgb(var(--muted))] mb-3">{c.packagesNote}</p>
          <Table rows={packages} />
        </section>

        {eyebrow.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">{c.eyebrowTitle}</h2>
            <Table rows={eyebrow} />
          </section>
        )}

        <section className="rounded-2xl border p-5 text-sm leading-relaxed" style={{ borderColor: "rgb(var(--border))" }}>
          <h2 className="text-base font-bold mb-2">{c.howTitle}</h2>
          <ul className="list-disc pl-5 space-y-1 text-[rgb(var(--muted))]">
            {c.how.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">{c.faqTitle}</h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1 text-sm text-[rgb(var(--muted))] leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p>
          <Link href={`/${l}/c/fue/`} className="underline font-semibold">{c.back} →</Link>
        </p>
      </main>
    </>
  );
}
