// /for-buyers 페이지 본문 — locale별 텍스트로 재사용.
// 3개 라우트(/for-buyers, /ko/for-buyers, /th/for-buyers)에서 import.

import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteConfig } from "@/lib/site";
import { RfqForm } from "@/components/RfqForm";
import { LeadMagnetCta } from "@/components/LeadMagnetCta";
import { PaidPdfCta } from "@/components/PaidPdfCta";
import { BUYERS_I18N, type Locale } from "@/lib/buyersI18n";

export async function ForBuyersPage({ locale }: { locale: Locale }) {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const totalReviews = db.suppliers.reduce((s, c) => s + c.total_reviews, 0);
  const provinceCount = Object.keys(db.city_counts).length;
  const t = BUYERS_I18N[locale];
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const homeLabel = locale === "en" ? "Home" : locale === "ko" ? "홈" : "หน้าหลัก";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href={homeHref} className="hover:text-[var(--fg)]">{homeLabel}</a>
        <span className="mx-2">›</span>
        <span>{t.breadcrumb}</span>
      </nav>

      <header className="mb-10 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
          {t.heroTag}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance leading-[1.1]">
          {t.heroH1Line1}
          <br />
          <span style={{ color: cfg.themeAccent }}>{t.heroH1Line2}</span>
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto text-balance">
          {t.heroSub(db.total_suppliers.toLocaleString(), String(provinceCount), totalReviews.toLocaleString())}
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3 mb-10">
        <Segment icon="🇰🇷" title={t.segKR.title} body={t.segKR.body} />
        <Segment icon="🇯🇵" title={t.segJP.title} body={t.segJP.body} />
        <Segment icon="🌏" title={t.segGLOBAL.title} body={t.segGLOBAL.body} />
      </section>

      <section className="grid sm:grid-cols-4 gap-3 mb-10">
        <Stat n={db.total_suppliers.toLocaleString()} label={t.statSuppliers} />
        <Stat n={(db.verified_count ?? db.suppliers.filter((s) => s.verified).length).toLocaleString()} label={t.statWebsite} />
        <Stat n={String(provinceCount)} label={t.statProvinces} />
        <Stat n="< 24h" label={t.statSla} />
      </section>

      <section id="rfq" className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-center">
          {t.rfqH2}
        </h2>
        <p className="text-sm text-[var(--muted)] text-center mb-6 max-w-xl mx-auto">
          {t.rfqSub}
        </p>
        <RfqForm locale={locale} />
      </section>

      <hr className="border-[var(--border)] my-12" />

      <LeadMagnetCta locale={locale} />

      <PaidPdfCta locale={locale} />

      <hr className="border-[var(--border)] my-12" />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.whyH2}</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Why icon="🎯" title={t.why1.title} body={t.why1.body} />
          <Why icon="✂"  title={t.why2.title} body={t.why2.body} />
          <Why icon="🇰🇷🇯🇵" title={t.why3.title} body={t.why3.body} />
          <Why icon="⚡" title={t.why4.title} body={t.why4.body} />
        </div>
      </section>

      <section className="mb-12 bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.processH2}</h2>
        <ol className="space-y-4 max-w-2xl mx-auto">
          <Step n={1} title={t.step1.title}>{t.step1.body}</Step>
          <Step n={2} title={t.step2.title}>{t.step2.body}</Step>
          <Step n={3} title={t.step3.title}>{t.step3.body}</Step>
        </ol>
        <div className="text-center mt-6">
          <a href="#rfq" className="inline-block px-6 py-3 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition">
            {t.submitArrow}
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-center">
          {locale === "ko" ? "유용한 자료" : locale === "th" ? "แหล่งข้อมูลที่มีประโยชน์" : "Helpful resources"}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a href={locale === "ko" ? "/ko/guide" : locale === "th" ? "/th/guide" : "/guide"}
             className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition text-center">
            <div className="text-2xl mb-1">📖</div>
            <div className="font-bold text-sm">
              {locale === "ko" ? "한국어 가이드" : locale === "th" ? "คู่มือผู้ซื้อ" : "Buyer Guides"}
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">
              {locale === "ko" ? "산단·OEM·BOI 심층 가이드" : locale === "th" ? "คู่มือการจัดซื้อเชิงลึก" : "Deep-dive sourcing guides"}
            </p>
          </a>
          <a href="/best"
             className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-bold text-sm">
              {locale === "ko" ? "추천 공급사 목록" : locale === "th" ? "รายการแนะนำ" : "Curated Lists"}
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">
              {locale === "ko" ? "신뢰도 순위별 14개 목록" : locale === "th" ? "รายการตามหัวข้อ 14 รายการ" : "14 ranked lists by sector"}
            </p>
          </a>
          <a href="/best/highly-recommended"
             className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="font-bold text-sm">
              {locale === "ko" ? "신뢰도 Top 50" : locale === "th" ? "Top 50 ที่แนะนำ" : "Top 50 Suppliers"}
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">
              {locale === "ko" ? "DBD 검증 + 구글 리뷰 순위" : locale === "th" ? "จัดอันดับโดย Trust Score" : "DBD-verified, ranked by Trust Score"}
            </p>
          </a>
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: homeLabel, url: homeHref },
        { name: t.breadcrumb, url: locale === "en" ? "/for-buyers" : `/${locale}/for-buyers` },
      ]} />
    </div>
  );
}

function Segment({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:border-emerald-300 transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
      <div className="text-2xl font-bold tabular-nums">{n}</div>
      <div className="text-[10px] text-[var(--muted)] uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function Why({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-bold text-base mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center">
        {n}
      </div>
      <div className="flex-1 pt-1">
        <div className="font-bold mb-0.5">{title}</div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">{children}</p>
      </div>
    </li>
  );
}
