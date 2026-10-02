import { loadMasterDb } from "@/lib/data";
import { isRealEstateSlug } from "@/lib/estates";
import { IEAT_ESTATES, IEAT_META, UNRESOLVED, mergeEstates } from "@/lib/ieatEstates";
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
  // 목록의 기준은 IEAT 공식 포털(83곳)이다. 예전에는 "입주사가 매칭된 단지" 만
  // 세어서 16곳이었는데, 단지 목록을 찾는 사람에게 그건 답이 아니다.
  // map 은 아래 카드가 쓰던 사진·샘플 입주사를 위해 그대로 둔다.
  const merged = mergeEstates(db);
  const estates = merged.map((e) => {
    const ours = e.slug ? map.get(e.slug) : undefined;
    return {
      slug: e.slug,
      name: e.name,
      nameTh: e.name_th,
      province: e.province,
      areaRai: e.area_rai,
      operator: e.operator,
      detailUrl: e.detail_url,
      totalCount: e.tenants.length,
      verifiedCount: e.verifiedTenants,
      sampleTenants: ours?.sampleTenants ?? [],
      photo: ours?.photo ?? null,
    };
  });

  // 공식 목록(IEAT)과 우리 데이터에서만 나온 민간 단지를 구분해 표기한다 —
  // 전부 IEAT 목록이라고 쓰면 사실이 아니다.
  const officialCount = IEAT_ESTATES.length;
  const extraCount = estates.length - officialCount;
  const withTenants = estates.filter((e) => e.totalCount > 0);
  const totalTenants = estates.reduce((n, e) => n + e.totalCount, 0);

  // 운영사별 묶음 — 공식 목록 기준이라 입주사 0곳인 단지도 들어간다.
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

  // 도별 — 단지를 찾는 사람은 보통 지역부터 좁힌다.
  const byProvince = new Map<string, number>();
  for (const e of estates) if (e.province) byProvince.set(e.province, (byProvince.get(e.province) ?? 0) + 1);
  const provinces = [...byProvince.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <nav className="text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-stone-900">Home</a>
        <span className="mx-2">›</span>
        <span className="text-stone-900 font-medium">Industrial Estates</span>
      </nav>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          🏘 {estates.length} estates · {provinces.length} provinces
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
          There are {estates.length} industrial estates and industrial parks listed here, across{" "}
          {provinces.length} provinces: the {officialCount} on the official list published by the
          Industrial Estate Authority of Thailand (IEAT)
          {extraCount > 0 && (
            <>, plus {extraCount} private {extraCount === 1 ? "estate" : "estates"} that list does not
              name but where we have tenants</>
          )}
          .{" "}
          {provinces.length > 2 && (
            <>The densest provinces are{" "}
              {provinces.slice(0, 3).map(([p, n]) => `${p} (${n})`).join(", ")}.{" "}</>
          )}
          We have mapped B2B tenants inside {withTenants.length} of them, {totalTenants.toLocaleString()}{" "}
          companies in total, with DBD registration records where available. Factories inside
          IEAT-designated estates can access Board of Investment incentives — corporate income tax
          exemption for up to 8 years, duty-free machinery imports, and land ownership rights for
          foreign entities — but eligibility depends on your industry and investment size, not the
          estate alone.
        </p>
        <p className="text-xs text-stone-500 mt-3 leading-relaxed">
          Estate list and areas from the{" "}
          <a className="underline" href={IEAT_META.sourceUrl} target="_blank" rel="noopener nofollow">
            IEAT official portal
          </a>{" "}
          (retrieved {IEAT_META.fetchedAt}). Tenant counts are ours and reflect what we have matched,
          not an estate&apos;s official occupancy.
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
                    {/* 상세 페이지는 입주사를 매칭한 단지에만 있다. slug 가 없는
                        단지를 링크하면 /estate/null 로 나간다 — 칩으로만 보여준다. */}
                    {op.estates.slice(0, 8).map((e) =>
                      e.slug && e.totalCount > 0 ? (
                        <a
                          key={e.name}
                          href={`/estate/${e.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-300 text-xs bg-white hover:border-emerald-400 hover:text-emerald-700 transition"
                        >
                          {e.name}
                          <span className="text-stone-400 tabular-nums">{e.totalCount}</span>
                        </a>
                      ) : (
                        <span
                          key={e.name}
                          title="On the IEAT list; no tenants matched in our directory yet"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-stone-200 text-xs bg-stone-50 text-stone-500"
                        >
                          {e.name}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {provinces.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-1">By province</h2>
          <p className="text-sm text-stone-600 mb-4 max-w-2xl">
            Where the estates are. Chonburi and Rayong hold most of them because of the Eastern
            Economic Corridor and Laem Chabang port.
          </p>
          <div className="flex flex-wrap gap-2">
            {provinces.map(([p, n]) => (
              <span
                key={p}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 text-sm bg-white"
              >
                {p}
                <span className="text-stone-500 tabular-nums">{n}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <h2 className="text-2xl font-bold mb-2">All {estates.length} estates</h2>
      <p className="text-sm text-stone-600 mb-5 max-w-2xl">
        Estates we have mapped tenants for come first. The rest are on the official IEAT list but we
        have not matched tenants to them yet — the estate is real, our tenant data for it is not
        there.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {estates.map((e) => {
          const meta = (
            <div className="text-xs text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
              {e.province && <span>{e.province}</span>}
              {e.province && e.areaRai && <span>·</span>}
              {e.areaRai && <span className="tabular-nums">{Math.round(e.areaRai).toLocaleString()} rai</span>}
              {e.operator && (
                <>
                  <span>·</span>
                  <span>{e.operator}</span>
                </>
              )}
            </div>
          );

          // 입주사가 매칭된 단지 — 상세 페이지로 링크한다.
          if (e.slug && e.totalCount > 0) {
            return (
              <a
                key={e.slug}
                href={`/estate/${e.slug}`}
                className="group block bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition"
              >
                {e.photo && (
                  <div className="relative w-full bg-stone-100 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <Photo
                      src={photoUrl(e.photo)}
                      alt={e.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-white font-bold text-lg leading-tight">{e.name}</div>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  {!e.photo && (
                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 leading-tight mb-1">
                      {e.name}
                    </h3>
                  )}
                  {e.nameTh && <div className="text-sm text-stone-500 mb-1" lang="th">{e.nameTh}</div>}
                  {meta}
                  <div className="text-xs text-stone-600 flex items-center gap-2 mb-3 flex-wrap">
                    <span className="font-bold text-stone-900">
                      {e.totalCount} tenant{e.totalCount === 1 ? "" : "s"} mapped
                    </span>
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
            );
          }

          // 공식 목록에는 있지만 우리 입주사가 없는 단지. 링크할 상세 페이지가
          // 없으므로 설명 카드로 둔다 — 빈 페이지를 72개 만드는 것보다 낫다.
          return (
            <div key={`${e.name}-${e.province ?? "x"}`} className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
              <h3 className="font-bold text-lg text-stone-900 leading-tight mb-1">{e.name}</h3>
              {e.nameTh && <div className="text-sm text-stone-500 mb-1" lang="th">{e.nameTh}</div>}
              {meta}
              <p className="text-xs text-stone-500 leading-relaxed">
                On the IEAT list; no tenants matched in our directory yet.
                {e.detailUrl && (
                  <>
                    {" "}
                    <a
                      className="underline hover:text-stone-800"
                      href={e.detailUrl}
                      target="_blank"
                      rel="noopener nofollow"
                    >
                      IEAT page →
                    </a>
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {UNRESOLVED.length > 0 && (
        <section className="mt-12 border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold mb-2">Tenants placed by operator only</h2>
          <p className="text-sm text-stone-600 mb-4 max-w-2xl">
            For these companies our source named the operator but not which of its estates, so we
            have not assigned them to a specific one rather than guess.
          </p>
          <div className="flex flex-wrap gap-2">
            {UNRESOLVED.map((u) => (
              <a
                key={u.slug ?? u.name}
                href={u.slug ? `/estate/${u.slug}` : "/estate"}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 text-sm bg-white hover:border-emerald-400 hover:text-emerald-700 transition"
              >
                {u.name}
                <span className="text-stone-500 tabular-nums">{u.tenants.length}</span>
              </a>
            ))}
          </div>
        </section>
      )}

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
