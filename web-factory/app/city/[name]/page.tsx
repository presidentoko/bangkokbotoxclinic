import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { citySlugFromDisplay } from "@/lib/cityNorm";
import { districtsForCity } from "@/lib/districts";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { findGuide } from "@/lib/guides";
import { computeTrustScore } from "@/lib/trustScore";

// 도시 → 가장 관련 깊은 가이드.
const CITY_TO_GUIDE: Record<string, string> = {
  chon_buri: "eastern-seaboard-industrial-estates-compared",
  chonburi: "eastern-seaboard-industrial-estates-compared",
  si_racha: "laem-chabang-warehouse-logistics",
  map_ta_phut: "map-ta-phut-petrochemical-cluster",
  rayong: "map-ta-phut-petrochemical-cluster",
  pathum_thani: "thai-electronics-manufacturer-hdd-ems",
  samut_sakhon: "thai-food-manufacturer-haccp-export",
  samut_prakan: "thai-textile-apparel-oem-guide",
  ayutthaya: "eastern-seaboard-industrial-estates-compared",
  bangkok: "sourcing-thai-suppliers-direct",
  songkhla: "thai-rubber-products-sourcing-guide",
  nonthaburi: "sourcing-thai-suppliers-direct",
  chachoengsao: "eastern-seaboard-industrial-estates-compared",
  nakhon_ratchasima: "sourcing-thai-suppliers-direct",
  chiang_mai: "sourcing-thai-suppliers-direct",
  pattaya: "laem-chabang-warehouse-logistics",
};
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
import type { Metadata } from "next";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const seen = new Set<string>();
  return Object.keys(db.city_counts)
    .map((label) => citySlugFromDisplay(label))
    .filter((slug) => {
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .map((slug) => ({ name: slug }));
}

// City context — 한국 buyer 가 알 만한 핵심 facts (AEO).
const CITY_NOTES: Record<string, { hook: string; long: string }> = {
  chon_buri: {
    hook: "Eastern Seaboard 본진 — Toyota·Honda·Mitsubishi·Isuzu 본플랜트 + Tier 1/2 협력사 클러스터.",
    long: "Chon Buri (촌부리)는 태국 자동차·전자 제조의 핵심. Pinthong, Amata City Chonburi, WHA Chonburi 등 주요 산단 5+ 곳이 위치. Sriracha 항만 + Laem Chabang 컨테이너 항구로 수출 logistics 최적.",
  },
  rayong: {
    hook: "Map Ta Phut petrochemical 복합단지 — PTT, IRPC, PTTGC, SCG Chemicals 본단.",
    long: "Rayong (라용)은 동남아 최대 석유화학 집적지. Amata City Rayong, Hemaraj Eastern Seaboard 등 산단 다수. Toyota·Ford 등 자동차 OEM 본플랜트 + 일본계 부품사 집중.",
  },
  pathum_thani: {
    hook: "방콕 북쪽 산단 벨트 — 전자·식품·HDD 클러스터.",
    long: "Pathum Thani (빠툼따니)는 Bangkok 북쪽 30km. Bangkadi Industrial Park 등 산단 위치. Western Digital, Seagate (HDD), 식품 가공업체 다수.",
  },
  samut_sakhon: {
    hook: "방콕 남서 — 가공식품·해산물·플라스틱 OEM 거점.",
    long: "Samut Sakhon (사뭇사콘)은 가공식품 (특히 냉동 해산물) 의 태국 1위 cluster. 플라스틱·포장재·텍스타일 OEM 도 집중.",
  },
  samut_prakan: {
    hook: "Suvarnabhumi 공항 인접 — 항공물류·전자·의류 OEM.",
    long: "Samut Prakan (사뭇쁘라깐)은 Suvarnabhumi 공항을 끼고 있는 항공 물류 거점. Bangpoo Industrial Estate 등 산단 위치. 전자·의류 OEM 다수.",
  },
  bangkok: {
    hook: "본사·R&D·corporate office 거점.",
    long: "Bangkok (방콕)은 제조 plant 보다 본사·R&D·commercial 헤드쿼터가 집중. Lat Krabang Industrial Estate 등 일부 산단도 위치.",
  },
  ayutthaya: {
    hook: "Rojana Hi-Tech + 일본계 자동차 본단.",
    long: "Ayutthaya (아유타야)는 Rojana Industrial Park, Hi-Tech Industrial Estate, Saha Rattana Nakorn 본단. Honda 자동차, 일본계 전자 (Sony, Sharp) 집중.",
  },
  songkhla: {
    hook: "남부 — 천연고무·해산물·할랄 가공식품.",
    long: "Songkhla (송클라)는 Hat Yai 도시권. 태국 1위 천연고무 cluster + 해산물·할랄 가공식품 OEM 거점.",
  },
  nonthaburi: {
    hook: "방콕 북서 위성도시 — 의약품·화장품·식품 OEM 클러스터.",
    long: "Nonthaburi (논타부리)는 방콕 서북쪽 접경 위성도시. Bangkhen, Pak Kret 일대에 의약품·화장품·가공식품 OEM 공장이 집중. 방콕 도심 접근성을 유지하면서도 Pathum Thani 산단 벨트와 연결되는 위치.",
  },
  chachoengsao: {
    hook: "방콕 동쪽 관문 — Eastern Seaboard 물류 허브·산업단지.",
    long: "Chachoengsao (차청사오)는 방콕에서 동쪽으로 80km — Eastern Seaboard 진입 관문. Amata Nakhon Industrial Estate (Chon Buri 경계 인근), WHA Industrial Estate Chachoengsao 등 주요 산단 위치. 자동차 부품·전자·물류 창고 집중.",
  },
  nakhon_ratchasima: {
    hook: "동북부 최대 도시 — 자동차·전자·농식품 OEM.",
    long: "Nakhon Ratchasima (나콘랏차시마·코랏)는 태국 동북부 최대 산업도시. Suranaree Industrial Estate, Nakhon Ratchasima Industrial Estate 위치. Honda, Mitsubishi 협력사 + 농식품 가공업체 분포.",
  },
  khon_kaen: {
    hook: "동북부 허브 — 농업·식품 가공·물류 거점.",
    long: "Khon Kaen (콘깬)은 태국 동북부 (이산) 경제 허브. 농식품 가공 (전분·설탕·가금류), 자동차 부품 일부, 물류 창고 위치. Khon Kaen Special Economic Zone 지정으로 외국인 투자 유치 중.",
  },
  chiang_rai: {
    hook: "북부 — GMS 무역 관문·농식품 OEM.",
    long: "Chiang Rai (치앙라이)는 태국 최북단 도시. 미얀마·라오스·중국 클릉난강 무역 통로 GMS (Greater Mekong Subregion) 관문. 커피·차·과일 농식품 OEM + 내륙 물류 창고 집중.",
  },
  si_racha: {
    hook: "Laem Chabang 항구 최인접 — 자동차 Tier 2/3 + 수출 물류 허브.",
    long: "Si Racha (시라차)는 Laem Chabang 컨테이너 항구에서 차로 20-30분 거리. Pinthong Industrial Estate 1-5 등 주요 수출 산단이 집중되어 있어 자동차 Tier 2/3 부품·패키징·플라스틱 OEM의 물류 거점으로 이상적.",
  },
  chonburi: {
    hook: "Eastern Seaboard 핵심 — 산업단지 밀집 지역.",
    long: "Chonburi (촌부리)는 Chon Buri 주 광역 행정구역. Amata City Chonburi, Pinthong, WHA Chonburi 등 주요 산단 밀집. 자동차 부품·전자·플라스틱·패키징 OEM의 핵심 거점.",
  },
  map_ta_phut: {
    hook: "동남아 최대 석유화학 집적지 — PTT·IRPC·PTTGC 본단.",
    long: "Map Ta Phut (맵타풋)는 Rayong 내 특수 산업 구역. PTT, IRPC, PTTGC, SCG Chemicals 등 태국 대형 석유화학기업 본단. 전용 항구 + 파이프라인 인프라 보유. 화학·플라스틱 원재료 조달 최적지.",
  },
  pattaya: {
    hook: "Eastern Seaboard 남단 — 자동차·제조·물류 복합 거점.",
    long: "Pattaya (파타야)는 관광도시 이미지와 달리 제조 인프라 보유. Eastern Seaboard 남단에 위치해 Chon Buri·Rayong 산단과 근접. 자동차 부품·물류·서비스 기업 분포.",
  },
  chiang_mai: {
    hook: "북부 경제 허브 — 농식품 OEM·공예·소규모 제조.",
    long: "Chiang Mai (치앙마이)는 태국 북부 최대 도시. 농식품 (커피·허브·건강식품) OEM, 전통 공예 (래커·세라믹·섬유), 소규모 정밀 제조 클러스터. Chiang Mai Industrial Estate 위치.",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  const display =
    Object.keys(db.city_counts).find((k) => citySlug(k) === name) ??
    name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const note = CITY_NOTES[name];
  return {
    title: `${display} Suppliers — Verified B2B Directory & Trust Scores`,
    description: note?.hook
      ? `${display} suppliers — ${note.hook} Trust Scores from real Google reviews.`
      : `Verified Thai suppliers in ${display}: manufacturers, warehouses, industrial estates. Trust Scores from real Google reviews.`,
    alternates: {
      canonical: `/city/${name}`,
      languages: {
        "en-US": `/city/${name}`,
        "ko-KR": `/ko/city/${name}`,
        "th-TH": `/th/city/${name}`,
        "x-default": `/city/${name}`,
      },
    },
  };
}

export default async function CityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();

  const filtered = sortWithSponsored(filterByCity(db.suppliers, name));
  if (filtered.length === 0) notFound();

  const display = filtered[0]?.city_label ?? name.replace(/_/g, " ");
  const note = CITY_NOTES[name];

  // Categories in this city
  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  // Canonical districts in this city (Mueang/Muang 등 병합, supplier 5+ 만).
  const districts = districtsForCity(db, name);

  const withWebsite = filtered.filter((r) => r.website).length;
  const verifiedCount = filtered.filter((r) => r.verified).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + computeTrustScore(c).overall, 0) / filtered.length)
      : 0;

  // Estate breakdown for this city
  const estateMap = new Map<string, { slug: string; count: number }>();
  for (const r of filtered) {
    if (r.estate_name && r.estate_slug) {
      const e = estateMap.get(r.estate_name) ?? { slug: r.estate_slug, count: 0 };
      e.count++;
      estateMap.set(r.estate_name, e);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} Suppliers
      </h1>
      {note?.hook && (
        <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">
          {note.hook}
        </p>
      )}
      <p className="text-[var(--muted)] mb-6">
        {filtered.length.toLocaleString()} verified suppliers in {display}, ranked by Trust Score from public Google reviews.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{filtered.length.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">Suppliers</div>
        </div>
        {verifiedCount > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="text-2xl font-bold tabular-nums text-emerald-700">✓ {verifiedCount.toLocaleString()}</div>
            <div className="text-xs text-emerald-700">DBD-verified</div>
          </div>
        )}
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{avgTrust}</div>
          <div className="text-xs text-[var(--muted)]">Avg Trust Score</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{withWebsite.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">With website</div>
        </div>
      </div>

      {estateMap.size > 0 && (
        <section className="mb-8 border border-emerald-200 rounded-2xl bg-emerald-50/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-3">
            🏘 Industrial Estates in {display}
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(estateMap.entries())
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, { slug, count }]) => (
                <a
                  key={slug}
                  href={`/estate/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300 bg-white text-sm hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition font-medium"
                >
                  {name} <span className="text-emerald-600 tabular-nums">{count}</span>
                </a>
              ))}
          </div>
        </section>
      )}

      {(() => {
        const guideSlug = CITY_TO_GUIDE[name];
        const guide = guideSlug ? findGuide(guideSlug) : null;
        if (!guide) return null;
        return (
          <a
            href={`/guide/${guide.slug}`}
            className="block mb-8 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl shrink-0">📖</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                  Buyer guide for {display}
                </div>
                <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">
                  {guide.title}
                </h2>
                <p className="text-sm text-[var(--muted)] line-clamp-2">{guide.metaDescription}</p>
              </div>
              <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
            </div>
          </a>
        );
      })()}

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS[c] ?? c}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {districts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map((g) => (
              <a
                key={g.slug}
                href={`/d/${g.slug}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                📍 {g.display} <span className="text-[var(--muted)]">{g.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="city-mid" />

      <div className="mb-8">
        <SupplierAlertSignup city={display} />
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      {note?.long && (
        <section className="mt-12 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">About {display}</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{note.long}</p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <a href="/best" className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition">🏆 Curated lists →</a>
        <a href="/guide" className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white hover:border-emerald-400 hover:text-emerald-700 transition">Buyer guides →</a>
      </div>

      <CollectionPageJsonLd
        name={`${display} Suppliers Directory`}
        description={note?.hook ?? `Verified Thai suppliers in ${display}: manufacturers, warehouses, industrial estates.`}
        url={`/city/${name}`}
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: display, url: `/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`Top ${display} suppliers`}
        description={note?.long}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
