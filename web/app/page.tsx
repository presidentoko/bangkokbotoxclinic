import { loadMasterDb, topByFocusRelevance } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS, CATEGORY_FAQS } from "@/lib/faq";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { HeroSearch } from "@/components/HeroSearch";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SponsoredHero } from "@/components/SponsoredHero";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import { guidesForFocus } from "@/lib/guides";

export const revalidate = 1800; // ISR 30분 — sponsored 슬롯 변경은 admin API 의 revalidatePath() 로 즉시 반영. 백그라운드 자동 갱신은 30분 (Hobby ISR Writes 한도 절약)

export default async function HomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const top = await sortWithSponsored(topByFocusRelevance(focused, cfg.focus, 50));
  // Pre-compute sponsored tiers for hero lookup (sponsoredTier is now async)
  const heroTiers = await Promise.all(top.map((c) => sponsoredTier(c.id)));
  const heroIdx = heroTiers.findIndex((t) => t !== null);
  const heroClinic = heroIdx !== -1 ? top[heroIdx] : null;

  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const withScraped = focused.filter((c) => c.scraped_review_count > 0).length;

  // District 섹션은 dominant city 한정 — Pattaya/Phuket district가 Bangkok과 섞이면
  // 외국인이 "Bangkok"으로 검색 후 150km 떨어진 클리닉 예약하는 사고 방지.
  // 다른 도시는 아래 "By City" 섹션에서 별도 진입.
  const cityCounts = new Map<string, number>();
  for (const c of focused) {
    if (c.city_label) cityCounts.set(c.city_label, (cityCounts.get(c.city_label) ?? 0) + 1);
  }
  const dominantCity = [...cityCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const districtMap = new Map<string, number>();
  for (const c of focused) {
    if (!c.district) continue;
    // dominantCity가 있으면 그 도시만; city_label 없는 행은 안전하게 포함
    if (dominantCity && c.city_label && c.city_label !== dominantCity) continue;
    districtMap.set(c.district, (districtMap.get(c.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  // 멀티시티 — focused 안에서 city별 count. 도시 1개면 섹션 숨김.
  const cityMap = new Map<string, { slug: string; count: number }>();
  for (const c of focused) {
    if (!c.city_label) continue;
    const cur = cityMap.get(c.city_label);
    if (cur) cur.count += 1;
    else cityMap.set(c.city_label, { slug: c.city_slug || c.city_label.toLowerCase(), count: 1 });
  }
  const cities = [...cityMap.entries()].sort((a, b) => b[1].count - a[1].count);

  const categoryMap = new Map<string, number>();
  for (const c of focused) {
    for (const cat of c.categories) categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  const homeFaqs = cfg.focus !== "all" && CATEGORY_FAQS[cfg.focus]
    ? [...CATEGORY_FAQS[cfg.focus], ...HOME_FAQS]
    : HOME_FAQS;

  const popularSearches = [
    ...(cfg.focus !== "all"
      ? districts.slice(0, 3).map(([d]) => ({
          label: `${cfg.focus} in ${d}`,
          href: `/c/${cfg.focus}/${d.toLowerCase().replace(/\s+/g, "-")}`,
        }))
      : categories.slice(0, 4).map(([cat]) => ({
          label: CATEGORY_LABELS[cat] ?? cat,
          href: `/c/${cat}`,
        }))),
  ];

  const searchIndex = focused.map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    rating: c.rating,
    trust_score: c.trust_score,
  }));

  // Recent positive reviews — social proof
  const reviewQuotes = focused
    .filter((c) => c.trust_score >= 75 && c.sample_reviews_en && c.sample_reviews_en.length > 0)
    .slice(0, 3)
    .map((c) => ({
      clinic: c.name,
      district: c.district,
      rating: c.rating,
      review: c.sample_reviews_en[0],
      id: c.id,
    }));

  const accent = cfg.themeAccent;
  const focusLabel = cfg.focus === "all" ? "Bangkok aesthetic" : cfg.focus;

  return (
    <>
      {/* MEGA HERO — trust/safety voice */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl"
            style={{ background: accent }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{ background: `${accent}15`, color: accent }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
            Verified · Independent · No clinic sponsorship in rankings
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            {cfg.focus === "all" ? (
              <>Verify before<br /><span style={{ color: accent }}>you book.</span></>
            ) : cfg.focus === "botox" || cfg.focus === "filler" ? (
              <>Verify before<br /><span style={{ color: accent }}>you inject.</span></>
            ) : cfg.focus === "dental" ? (
              <>Verify before<br /><span style={{ color: accent }}>you smile.</span></>
            ) : cfg.focus === "hifu" || cfg.focus === "laser" ? (
              <>Verify before<br /><span style={{ color: accent }}>you treat.</span></>
            ) : (
              <>{cfg.hero.split(" — ")[0] ?? cfg.hero}<br /><span style={{ color: accent }}>{cfg.hero.split(" — ")[1] ?? "verified."}</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-[var(--fg)]">{focused.length.toLocaleString()}</span> {focusLabel} clinics ranked by{" "}
            <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> Google reviews — every single one analyzed for credibility.
          </p>

          <HeroSearch entities={searchIndex} hrefBase="/clinic" popularSearches={popularSearches} searchPlaceholder="Search clinic name or district..." />
        </div>
      </section>

      {/* MEGA STATS BAR — accent gradient */}
      <section
        className="border-y border-[var(--border)] text-white"
        style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent}dd 50%, ${accent} 100%)` }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          <Stat big={focused.length.toLocaleString()} label="Clinics verified" />
          <Stat big={`${(totalReviews / 1000).toFixed(0)}K`} label="Reviews analyzed" />
          <Stat big={withScraped.toLocaleString()} label="Deep-analyzed" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {heroClinic ? <SponsoredHero c={heroClinic} /> : null}

        {/* MANIFESTO — site-aware trust signals */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="🛡️"
            title="Real reviews only"
            body="No paid review removals. Aggregated from public Google Maps — the most regulated review system on earth."
            accent={accent}
          />
          <Manifesto
            icon="📊"
            title="Trust Score"
            body="Rating + review volume + Local Guide credibility + reviewer authority. One transparent number, every clinic."
            accent={accent}
          />
          {cfg.focus === "dental" ? (
            <Manifesto
              icon="🦷"
              title="Specialist credentials"
              body="We track implant brand mentions (Straumann, Nobel, Osstem) and specialist signals — implantologist vs general dentist, English/Korean-speaking, US/UK/JP-trained."
              accent={accent}
            />
          ) : cfg.focus === "hifu" || cfg.focus === "laser" ? (
            <Manifesto
              icon="⚡"
              title="Machine verification"
              body="We track Ultherapy / Thermage / Ultraformer / Pico / CO2 brand mentions in reviews — spot generic-machine clinics charging brand prices."
              accent={accent}
            />
          ) : cfg.focus === "facial" ? (
            <Manifesto
              icon="✨"
              title="Treatment depth"
              body="HydraFacial, LED, oxygen, chemical peel, brightening — we track which treatments each clinic actually performs (vs marketing claims)."
              accent={accent}
            />
          ) : (
            <Manifesto
              icon="💉"
              title="Brand verification"
              body="We track Allergan / Dysport / Botulax / Juvederm / Restylane mentions in reviews — spot fake product claims."
              accent={accent}
            />
          )}
        </section>

        {/* FEATURED 6 — bigger cards */}
        {top.length >= 6 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Top 6 by Trust Score
              </h2>
              <a href="/best/highly-rated" className="text-sm font-medium hover:underline" style={{ color: accent }}>
                See full ranking →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {top.slice(0, 6).map((c, i) => (
                <a
                  key={c.id}
                  href={`/clinic/${c.id}`}
                  className="group block border border-[var(--border)] rounded-2xl p-5 bg-white hover:shadow-xl hover:-translate-y-0.5 transition relative overflow-hidden"
                >
                  <div className="flex items-end justify-between gap-2 mb-3">
                    <div>
                      <div className="text-2xl font-black tabular-nums text-[var(--muted)] leading-none">#{i + 1}</div>
                      <div className="text-[9px] uppercase tracking-widest text-[var(--muted)] font-bold mt-1">Rank</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black tabular-nums leading-none" style={{
                        color: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04"
                      }}>
                        {c.trust_score.toFixed(0)}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-[var(--muted)] font-bold mt-1">Trust Score</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-base group-hover:opacity-90 transition leading-tight mb-1" style={{ color: "var(--fg)" }}>{c.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{c.district}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                    <span className="text-yellow-700 font-bold">★ {c.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>{c.total_reviews.toLocaleString()} reviews</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium"
                        style={{ background: `${accent}15`, color: accent }}
                      >
                        <CategoryIcon category={cat} size={11} />
                        {CATEGORY_LABELS[cat] ?? cat}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* REAL REVIEW QUOTES */}
        {reviewQuotes.length >= 3 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                What real patients say
              </h2>
              <span className="text-xs text-[var(--muted)]">From verified Google reviews</span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {reviewQuotes.map((q, i) => (
                <a
                  key={i}
                  href={`/clinic/${q.id}`}
                  className="group block bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-md transition"
                >
                  <div className="text-3xl leading-none mb-2" style={{ color: accent }}>"</div>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-4">{q.review.text}</p>
                  <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate group-hover:opacity-80 transition" style={{ color: "var(--fg)" }}>
                        {q.clinic}
                      </div>
                      <div className="text-xs text-[var(--muted)] truncate">{q.district}</div>
                    </div>
                    <div className="text-yellow-700 font-bold text-sm shrink-0">★ {q.rating.toFixed(1)}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By City — 도시 2개 이상일 때만 표시 (Bangkok만 있으면 의미 없음) */}
        {cities.length >= 2 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([label, { slug, count }]) => (
                <a
                  key={label}
                  href={`/city/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  🏙️ {label}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By Service */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Service</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            By District{dominantCity ? ` · ${dominantCity}` : ""}
          </h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Guides promo — focus 맞는 가이드만 (dental 사이트에 botox 가이드 X). */}
        {(() => { const focusGuides = guidesForFocus(cfg.focus); return focusGuides.length > 0 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-slate-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Editor's guides</h2>
                <p className="text-sm text-[var(--muted)] mt-1">Pricing reality, brand verification, what packages cover.</p>
              </div>
              <a href="/guide" className="text-sm font-bold hover:underline" style={{ color: accent }}>All guides →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {focusGuides.map((g) => (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:shadow-md transition"
                >
                  <div className="font-bold text-sm leading-tight mb-1">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{g.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        ); })()}

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top {Math.min(top.length, 50)} by Trust Score</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>

          <AffiliateInline />

          {top.length > 10 && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
                  #11 – #{top.length} · runner-up rankings
                </h3>
                <span className="text-xs text-[var(--muted)] hidden sm:inline">
                  Same data depth, lighter view
                </span>
              </div>
              <div className="grid gap-1.5">
                {top.slice(10).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-12">
          <BookingForm />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked</h2>
          <div className="space-y-3">
            {homeFaqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={homeFaqs} />
        <ItemListJsonLd
          name={`Top ${cfg.brand} by Trust Score`}
          items={top.slice(0, 20).map((c) => ({
            name: c.name,
            url: `/clinic/${c.id}`,
          }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-5xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon, title, body, accent }: { icon: string; title: string; body: string; accent: string }) {
  return (
    <div
      className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md transition"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
