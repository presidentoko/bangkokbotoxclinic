import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdPlaceholder } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { BEST_FOR, findBestFor } from "@/lib/bestFor";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import { loadPhotos } from "@/lib/photos";
import { SpinDiscover } from "@/components/SpinDiscover";
import { ClinicPodiumImage } from "@/components/ClinicPodiumImage";
import type { Metadata } from "next";

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  return BEST_FOR.map((c) => ({ criterion: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ criterion: string }> }
): Promise<Metadata> {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) return { title: "Not found" };
  const db2 = await loadMasterDb();
  // 2026-08-20: 예전엔 db2.clinics(전 도메인 합산)를 셌다. 그런데 아래 본문은
  // applySiteFilter 로 이 사이트 소관만 렌더한다 — 즉 덴탈 사이트에서 클리닉이
  // 0~2곳뿐인 /best/ 페이지가, 보톡스 사이트 클리닉 덕분에 합산 5를 넘겨
  // 색인 가능으로 통과하고 있었다. 게이트를 본문과 같은 기준으로 맞춘다.
  const scoped2 = applySiteFilter(db2.clinics, getSiteConfig());
  const count2 = scoped2.filter((c) => !cfg.filterFn || cfg.filterFn(c)).length;
  const robots = count2 < 5 ? { index: false, follow: true } : undefined;
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `/best/${cfg.slug}` },
    ...(robots && { robots }),
  };
}

export default async function BestForPage(
  { params }: { params: Promise<{ criterion: string }> }
) {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) notFound();

  const site = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, site);

  const filtered = focused
    .filter((c) => !cfg.filterFn || cfg.filterFn(c))
    .map((c) => ({ ...c, _score: cfg.scoreFn(c) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 50);

  // 사진 미리 로드 (top 3 podium + SpinDiscover pool 용)
  const topPhotos = await Promise.all(filtered.slice(0, 50).map((c) => loadPhotos(c.id)));
  const spinPool = filtered.slice(0, 50).map((c, i) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    rating: c.rating,
    trust_score: c.trust_score,
    total_reviews: c.total_reviews,
    photo: topPhotos[i]?.photos[0]?.thumb,
  }));
  const accent = site.themeAccent;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Best</span>
        <span className="mx-2">›</span>
        <span>{cfg.title.replace(/^Best |^Most |^Bangkok /, "")}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        {cfg.title}
      </h1>
      <p className="text-[var(--muted)] mb-2">
        {cfg.intro}
      </p>
      <p className="text-xs text-[var(--muted)] mb-8 italic">
        {filtered.length} clinics matched. Refreshed from Google Maps, HDmall, Wongnai + partner platforms — see methodology on{" "}
        <a href="/about" className="underline">/about</a>.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No clinics matched this criterion yet. Data refreshes every 30 minutes.</p>
      ) : (
        <>
          {/* PODIUM — top 3 with medals + photos. Visual hook before data-dense list. */}
          {filtered.length >= 3 && (
            <section className="mb-8">
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { idx: 1, medal: "🥈", height: "md:mt-8", border: "border-slate-400", scale: "scale-95" },
                  { idx: 0, medal: "🥇", height: "", border: "border-amber-400", scale: "" },
                  { idx: 2, medal: "🥉", height: "md:mt-12", border: "border-orange-400", scale: "scale-95" },
                ].map(({ idx, medal, height, border, scale }) => {
                  const c = filtered[idx];
                  if (!c) return null;
                  const photo = topPhotos[idx]?.photos[0];
                  const rank = idx + 1;
                  return (
                    <a
                      key={c.id}
                      href={`/clinic/${c.id}`}
                      className={`relative group block ${height} ${scale}`}
                    >
                      <div className={`bg-white rounded-xl border-2 ${border} overflow-hidden shadow-md group-hover:shadow-xl group-hover:-translate-y-1 transition-all`}>
                        <div
                          className="relative aspect-[4/3] overflow-hidden"
                          style={photo ? undefined : { background: `linear-gradient(135deg, ${accent}20, ${accent}10)` }}
                        >
                          {photo ? (
                            <ClinicPodiumImage src={photo.thumb} alt={c.name} accent={accent} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-40" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}10)` }}>
                              🏥
                            </div>
                          )}
                          <div className="absolute top-2 left-2 text-3xl md:text-4xl drop-shadow-lg">{medal}</div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-xs font-black tabular-nums">
                            #{rank}
                          </div>
                        </div>
                        <div className="p-2 md:p-3">
                          <h3 className="font-bold text-[11px] md:text-sm leading-tight line-clamp-2">{c.name}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-1 text-[9px] md:text-xs text-[var(--muted)]">
                            <span className="whitespace-nowrap">★ {c.rating.toFixed(1)}</span>
                            <span className="hidden sm:inline">·</span>
                            <span className="font-bold whitespace-nowrap" style={{ color: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04" }}>
                              Trust {c.trust_score.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="grid gap-3">
              {filtered.slice(0, 10).map((c, i) => (
                <ClinicCard key={c.id} clinic={c} rank={i + 1} />
              ))}
            </div>

            {/* GAME WIDGET — discover random clinic, addictive interaction */}
            <SpinDiscover pool={spinPool} accent={accent} />

            <AffiliateInline />
            {filtered.length > 10 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                  #11 – #{filtered.length} · runner-up rankings
                </h3>
                <div className="grid gap-1.5">
                  {filtered.slice(10).map((c, i) => (
                    <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="my-8">
            <BookingForm />
          </div>

          {filtered.length >= 2 && (
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Head-to-head comparison</h2>
              <a href={`/compare/${filtered[0].id}/${filtered[1].id}`} rel="nofollow"
                className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition group">
                <span className="text-2xl shrink-0">⚖️</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[var(--muted)] mb-1">Compare #1 vs #2 — side-by-side Trust Score analysis</div>
                  <div className="font-semibold text-sm group-hover:text-[var(--accent)] transition truncate">
                    {filtered[0].name} vs {filtered[1].name}
                  </div>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition shrink-0">→</span>
              </a>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Other ways to find a clinic
            </h2>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR.filter((x) => x.slug !== cfg.slug).map((x) => (
                <a
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {x.title.replace(/^Best Bangkok |^Bangkok |^Most /, "").replace(/Aesthetic Clinics?|Clinics?/, "").trim()}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: cfg.title, url: `/best/${cfg.slug}` },
      ]} />
      <ItemListJsonLd
        name={cfg.title}
        items={filtered.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
