import { loadMasterDb } from "@/lib/data";
import { isRealEstateSlug } from "@/lib/estates";
import { Photo } from "@/components/Photo";
import { BreadcrumbJsonLd, CollectionPageJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { photoUrl } from "@/lib/photoUrl";
import type { Metadata } from "next";

// Search Console 2026-09 (태국 국내): "industrial estate in thailand" 49회 67위,
// "thailand industrial park" 42회 76위, "industrial estates" 5회. 이 쿼리의 답은
// 단지 목록이고 그건 이 페이지에 있다 — /c/industrial_estate 에는 운영사 9곳뿐이다.
export const metadata: Metadata = {
  title: "Industrial Estates & Industrial Parks in Thailand — Operators and Tenants",
  description:
    "Thai industrial estates and industrial parks mapped by operator — Amata, WHA, Hemaraj, Pinthong, Rojana, Nava Nakorn, Bang Plee. Tenant counts, DBD registration, capital and TSIC codes per estate.",
  alternates: { canonical: "/estate" },
};

// 단지 이름에서 운영사를 뽑는다. 태국 산업단지는 운영사가 곧 선택 기준이다 —
// 바이어가 "Amata 쪽인가 WHA 쪽인가" 로 먼저 좁히고 그다음 단지를 고른다.
const OPERATORS: { name: string; keys: string[]; note: string }[] = [
  { name: "WHA / Hemaraj", keys: ["wha", "hemaraj"], note: "Largest by leased area after the Hemaraj merger. Strongest on the Eastern Seaboard." },
  { name: "Amata", keys: ["amata"], note: "Owns its own utilities and infrastructure; high occupancy. Chon Buri and Rayong." },
  { name: "Pinthong", keys: ["pinthong"], note: "Closest cluster to Laem Chabang port — favoured by export-heavy tenants." },
  { name: "Rojana", keys: ["rojana"], note: "Spread beyond the Eastern Seaboard into Ayutthaya and Prachinburi." },
  { name: "Nava Nakorn", keys: ["navanakorn", "nava nakorn"], note: "North of Bangkok; electronics and food tenants rather than automotive." },
  { name: "IEAT & others", keys: ["bangpoo", "bang poo", "lat krabang", "map ta phut", "bang phli", "ieat"], note: "State-run (IEAT) and independent estates, including the Map Ta Phut petrochemical complex." },
];

const ESTATE_FAQS = [
  {
    q: "What is the difference between an industrial estate and an industrial park in Thailand?",
    a: "In practice the terms are used interchangeably. The meaningful distinction is whether the estate is IEAT-designated: factories inside an IEAT estate can access Board of Investment privileges and foreign land ownership rights, which privately developed parks may not offer. Ask the leasing office directly whether the site is IEAT-designated before signing.",
  },
  {
    q: "Which industrial estate is closest to Laem Chabang port?",
    a: "The Pinthong estates sit nearest the port, with the Sriracha and Bowin corridors next. Most export-oriented tenants target somewhere within 30 to 45 minutes of Laem Chabang, which also covers Amata City Chonburi and WHA's Chonburi estates.",
  },
  {
    q: "Do estates in Thailand give BOI tax incentives?",
    a: "Factories inside IEAT-designated estates are eligible for BOI promotion — corporate income tax exemption for up to 8 years, import duty exemption on machinery, and land ownership rights for foreign entities. Eligibility depends on your industry and investment size, not on the estate alone, so confirm with BOI as well as the estate.",
  },
  {
    q: "Can I visit before committing?",
    a: "Yes. Estate leasing offices run site tours by appointment, and the larger operators keep visitor centres with sample ready-built units. Phone numbers for tenants and offices are published on each estate page here.",
  },
  {
    q: "How were these estates and tenant counts compiled?",
    a: "Tenants come from public Google Business Profiles filtered to B2B manufacturers and operators, then cross-checked against Thailand's DBD company registry for registration number, capital and registered date. Counts reflect what we have mapped, not the estate's official occupancy figure.",
  },
];

export default async function EstateIndexPage() {
  const db = await loadMasterDb();

  type EstateEntry = {
    slug: string;
    name: string;
    totalCount: number;
    verifiedCount: number;
    sampleTenants: { name: string; id: string }[];
    photo: string | null;
  };
  const map = new Map<string, EstateEntry>();
  for (const s of db.suppliers) {
    if (!s.estate_slug || !s.estate_name) continue;
    // 주소 조각에서 뽑힌 가짜 단지는 목록에서 뺀다 (lib/estates.ts 참고).
    if (!isRealEstateSlug(s.estate_slug)) continue;
    let e = map.get(s.estate_slug);
    if (!e) {
      e = { slug: s.estate_slug, name: s.estate_name, totalCount: 0, verifiedCount: 0, sampleTenants: [], photo: null };
      map.set(s.estate_slug, e);
    }
    e.totalCount++;
    if (s.verified) e.verifiedCount++;
    if (e.sampleTenants.length < 3) e.sampleTenants.push({ name: s.name, id: s.id });
    if (!e.photo && s.hero_image) e.photo = s.hero_image;
  }
  const estates = Array.from(map.values())
    .sort((a, b) => b.totalCount - a.totalCount);

  // 운영사별 묶음 — 단지 수와 입주사 수를 함께 센다.
  const operators = OPERATORS.map((op) => {
    const matched = estates.filter((e) =>
      op.keys.some((k) => e.name.toLowerCase().replace(/\s+/g, " ").includes(k)),
    );
    return {
      ...op,
      estates: matched,
      tenants: matched.reduce((n, e) => n + e.totalCount, 0),
    };
  }).filter((op) => op.estates.length > 0);

  const totalTenants = estates.reduce((n, e) => n + e.totalCount, 0);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <nav className="text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-stone-900">Home</a>
        <span className="mx-2">›</span>
        <span className="text-stone-900 font-medium">Industrial Estates</span>
      </nav>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          🏘 {estates.length} estates mapped
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">
          Industrial estates &amp; industrial parks in Thailand
        </h1>
        <p className="text-base md:text-lg text-stone-600 max-w-3xl">
          Thailand&apos;s industrial estates operate under the Industrial Estate Authority of Thailand (IEAT) and host export-
          oriented manufacturers — typically with tax incentives, customs facilities, and pre-vetted infrastructure. We&apos;ve
          mapped the tenants we&apos;ve identified in each estate, with DBD-verified business records where available.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <a href="/guide/eastern-seaboard-industrial-estates-compared"
             className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-semibold hover:underline">
            📖 Estate comparison guide →
          </a>
          <a href="/best/industrial-estates"
             className="inline-flex items-center gap-1.5 text-sm text-amber-700 font-semibold hover:underline">
            🏆 Ranked estate list →
          </a>
        </div>
      </header>

      {/* 답변엔진이 인용할 수 있는 한 문단. 숫자는 전부 이 DB 에서 계산된다. */}
      <section className="mb-10 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">In short</h2>
        <p className="leading-relaxed text-stone-700">
          Thai Supply Hub has mapped {estates.length} industrial estates and industrial parks in
          Thailand holding {totalTenants.toLocaleString()} B2B tenants.
          {operators.length > 0 && (
            <> The largest operators here are{" "}
              {operators
                .slice()
                .sort((a, b) => b.tenants - a.tenants)
                .slice(0, 3)
                .map((o) => `${o.name} (${o.tenants} tenants)`)
                .join(", ")}
              .</>
          )}{" "}
          Factories inside IEAT-designated estates can access Board of Investment incentives —
          corporate income tax exemption for up to 8 years, duty-free machinery imports, and land
          ownership rights for foreign entities — but eligibility depends on your industry and
          investment size, not the estate alone.
        </p>
      </section>

      {operators.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-1">By operator</h2>
          <p className="text-sm text-stone-600 mb-5 max-w-2xl">
            Thai buyers and site-selection teams usually narrow by operator before picking a specific
            estate, because infrastructure, utilities and leasing terms follow the operator.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {operators
              .slice()
              .sort((a, b) => b.tenants - a.tenants)
              .map((op) => (
                <div key={op.name} className="border border-stone-200 rounded-xl p-4 bg-white">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-bold text-lg">{op.name}</h3>
                    <span className="text-sm text-stone-500 tabular-nums whitespace-nowrap">
                      {op.estates.length} {op.estates.length === 1 ? "estate" : "estates"} · {op.tenants} tenants
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed mb-3">{op.note}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {op.estates.slice(0, 6).map((e) => (
                      <a
                        key={e.slug}
                        href={`/estate/${e.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-300 text-xs bg-white hover:border-emerald-400 hover:text-emerald-700 transition"
                      >
                        {e.name}
                        <span className="text-stone-400 tabular-nums">{e.totalCount}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      <h2 className="text-2xl font-bold mb-5">All {estates.length} estates by tenant count</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {estates.map((e) => (
          <a key={e.slug} href={`/estate/${e.slug}`}
             className="group block bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition">
            {e.photo && (
              <div className="relative w-full bg-stone-100 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <Photo src={photoUrl(e.photo)} alt={e.name}
                       className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="text-white font-bold text-lg leading-tight">{e.name}</div>
                </div>
              </div>
            )}
            <div className="p-5">
              {!e.photo && (
                <h2 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 leading-tight mb-1">{e.name}</h2>
              )}
              <div className="text-xs text-stone-600 flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-bold text-stone-900">{e.totalCount} tenant{e.totalCount === 1 ? "" : "s"}</span>
                {e.verifiedCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">✓ {e.verifiedCount} DBD-verified</span>
                  </>
                )}
              </div>
              <ul className="text-xs text-stone-600 space-y-0.5 list-disc list-inside">
                {e.sampleTenants.map((t) => (
                  <li key={t.id} className="line-clamp-1">{t.name}</li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Industrial Estates", url: "/estate" },
      ]} />
      <section className="mt-12 border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-bold mb-5">Questions buyers ask</h2>
        <div className="space-y-5 max-w-3xl">
          {ESTATE_FAQS.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold mb-1">{f.q}</h3>
              <p className="text-stone-600 leading-relaxed text-[15px]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <a href="/c/industrial_estate" className="px-3 py-1.5 rounded-full border border-stone-300 bg-white hover:border-emerald-400 transition">
          Estate operators &amp; leasing offices →
        </a>
        <a href="/c/warehouse" className="px-3 py-1.5 rounded-full border border-stone-300 bg-white hover:border-emerald-400 transition">
          Warehouses &amp; distribution centers →
        </a>
        <a href="/c/logistics" className="px-3 py-1.5 rounded-full border border-stone-300 bg-white hover:border-emerald-400 transition">
          3PL &amp; logistics providers →
        </a>
      </div>

      <FaqJsonLd faqs={ESTATE_FAQS} />
      <CollectionPageJsonLd
        name="Industrial estates in Thailand"
        description={`${estates.length} Thai industrial estates with mapped B2B tenants.`}
        url="/estate"
        numberOfItems={estates.length}
      />
    </article>
  );
}
