import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { findGuideKo } from "@/lib/guides_ko";
import { sortWithSponsored } from "@/lib/sponsored";
import { AdSlot } from "@/components/AffiliateSlot";
import { computeTrustScore } from "@/lib/trustScore";
import type { Metadata } from "next";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return Object.keys(db.city_counts).map((label) => ({ name: citySlug(label) }));
}

const CITY_NOTES_KO: Record<string, { hook: string; long: string; guide?: string }> = {
  chon_buri: {
    hook: "동부해안 본진 — Toyota·Honda·Mitsubishi·Isuzu 본플랜트 + Tier 1/2 협력사 클러스터.",
    long: "Chon Buri (촌부리)는 태국 자동차·전자 제조 핵심. Pinthong, Amata City Chonburi, WHA Chonburi 등 주요 산단 5+ 위치. Sriracha + Laem Chabang 컨테이너 항만이 인접해 수출 logistics 최적.",
    guide: "korea-sme-amata-wha-comparison",
  },
  rayong: {
    hook: "Map Ta Phut 석유화학 — PTT, IRPC, PTTGC, SCG Chemicals 본단.",
    long: "Rayong (라용)은 동남아 최대 석유화학 집적지. Amata City Rayong, Hemaraj Eastern Seaboard 산단. Toyota·Ford 자동차 OEM + 일본계 부품사 집중. 한국 화학·자동차 buyer 핵심 거점.",
    guide: "korea-sme-amata-wha-comparison",
  },
  pathum_thani: {
    hook: "방콕 북쪽 산단 벨트 — 전자·식품·HDD 클러스터.",
    long: "Pathum Thani (빠툼따니)는 방콕 북쪽 30km. Bangkadi Industrial Park 위치. Western Digital, Seagate (HDD), 식품 가공업체 다수.",
  },
  samut_sakhon: {
    hook: "방콕 남서 — 가공식품·해산물·플라스틱 OEM 거점.",
    long: "Samut Sakhon (사뭇사콘)은 가공식품 (특히 냉동 해산물) 태국 1위 cluster. 플라스틱·포장재·텍스타일 OEM 도 집중.",
  },
  samut_prakan: {
    hook: "Suvarnabhumi 공항 인접 — 항공물류·전자·의류 OEM.",
    long: "Samut Prakan (사뭇쁘라깐)은 Suvarnabhumi 공항을 끼고 있는 항공 물류 거점. Bangpoo Industrial Estate 위치. 전자·의류 OEM 다수.",
  },
  bangkok: {
    hook: "본사·R&D·corporate office 거점.",
    long: "Bangkok (방콕)은 제조 plant 보다 본사·R&D·commercial 헤드쿼터가 집중. Lat Krabang Industrial Estate 등 일부 산단도 위치.",
    guide: "korea-sme-thai-oem-process",
  },
  phra_nakhon_si_ayutthaya: {
    hook: "Rojana Hi-Tech + Honda·Sony·Sharp 자동차/전자 본단.",
    long: "Ayutthaya (아유타야)는 Rojana Industrial Park, Hi-Tech Industrial Estate, Saha Rattana Nakorn 본단. Honda 자동차, 일본계 전자 (Sony, Sharp) 집중. 방콕에서 1시간으로 R&D·임원진 출장 효율.",
    guide: "korea-sme-amata-wha-comparison",
  },
  songkhla: {
    hook: "남부 — 천연고무·해산물·할랄 가공식품.",
    long: "Songkhla (송클라)는 Hat Yai 도시권. 태국 1위 천연고무 cluster + 해산물·할랄 가공식품 OEM 거점.",
  },
  khon_kaen: {
    hook: "북동부 — 농업가공·고무·식품 OEM.",
    long: "Khon Kaen (콘깬)은 태국 북동부(이산) 거점. 농업가공·고무·식품 OEM 클러스터. 인건비가 동부해안 대비 낮아 노동집약 manufacturing에 유리.",
  },
  prachin_buri: {
    hook: "Rojana Prachinburi + 304 Industrial Park.",
    long: "Prachin Buri (쁘라찐부리)는 Rojana Prachinburi + 304 Industrial Park 거점. 동부해안 임금 회피 + 방콕 인접 (1.5-2시간) 으로 한국 SME 진출 검토 영역.",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  const { name } = await params;
  const db = await loadMasterDb();
  const display =
    Object.keys(db.city_counts).find((k) => citySlug(k) === name) ??
    name.replace(/_/g, " ");
  const note = CITY_NOTES_KO[name];
  return {
    title: `${display} 태국 공급사 디렉토리 — 신뢰도 + 직거래`,
    description: note?.hook
      ? `${display} 공급사 — ${note.hook} 신뢰도 점수로 정렬.`
      : `${display}의 검증된 태국 공급사: 제조사, 창고, 산단. 공개 Google 리뷰 기반 신뢰도 점수.`,
    alternates: {
      canonical: `/ko/city/${name}`,
      languages: {
        "ko-KR": `/ko/city/${name}`,
        "en-US": `/city/${name}`,
        "x-default": `/city/${name}`,
      },
    },
    openGraph: { locale: "ko_KR" },
  };
}

export default async function KoCityPage(
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const db = await loadMasterDb();
  const filtered = sortWithSponsored(filterByCity(db.suppliers, name));
  if (filtered.length === 0) notFound();

  const display = filtered[0]?.city_label ?? name.replace(/_/g, " ");
  const note = CITY_NOTES_KO[name];

  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const categories = [...catMap.entries()].sort((a, b) => b[1] - a[1]);

  const withWebsite = filtered.filter((r) => r.website).length;
  const avgTrust =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, c) => s + computeTrustScore(c).overall, 0) / filtered.length)
      : 0;

  const guide = note?.guide ? findGuideKo(note.guide) : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/ko" className="hover:text-[var(--fg)]">홈</a>
        <span className="mx-2">›</span>
        <span>{display}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {display} 공급사
      </h1>
      {note?.hook && (
        <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">{note.hook}</p>
      )}
      <p className="text-[var(--muted)] mb-6">
        {filtered.length.toLocaleString()}곳 검증된 공급사. 신뢰도 점수 기준 정렬.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8 text-center">
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{filtered.length.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">공급사</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{avgTrust}</div>
          <div className="text-xs text-[var(--muted)]">평균 신뢰도</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="text-2xl font-bold tabular-nums">{withWebsite.toLocaleString()}</div>
          <div className="text-xs text-[var(--muted)]">웹사이트 공개</div>
        </div>
      </div>

      {guide && (
        <a
          href={`/ko/guide/${guide.slug}`}
          className="block mb-8 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="flex items-start gap-4">
            <div className="text-2xl shrink-0">📖</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">
                {display} 한국 buyer 가이드
              </div>
              <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">
                {guide.title}
              </h2>
              <p className="text-sm text-[var(--muted)] line-clamp-2">{guide.metaDescription}</p>
            </div>
            <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
          </div>
        </a>
      )}

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">카테고리별</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/ko/c/${c}`}
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

      <AdSlot slot="ko-city-mid" />

      <section>
        <h2 className="text-xl font-bold mb-4">신뢰도 Top {Math.min(filtered.length, 100)}</h2>
        <div className="grid gap-3">
          {filtered.slice(0, 100).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
      </section>

      {note?.long && (
        <section className="mt-12 bg-white border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-lg font-bold mb-3">{display} 안내</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{note.long}</p>
        </section>
      )}

      <CollectionPageJsonLd
        name={`${display} 태국 공급사 디렉토리`}
        description={note?.hook ?? `${display} 검증된 공급사: 제조사 · 창고 · 산단.`}
        url={`/ko/city/${name}`}
        lang="ko"
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "홈", url: "/ko" },
        { name: display, url: `/ko/city/${name}` },
      ]} />
      <ItemListJsonLd
        name={`${display} 공급사 Top`}
        description={note?.long}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
