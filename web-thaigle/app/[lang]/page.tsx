import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlaces } from "@/lib/places";
import { HomeSearch } from "@/components/HomeSearch";
import { CATEGORY_COLORS } from "@/lib/plan/store";
import type { Category } from "@/lib/plan/store";
import { localsScoreColor } from "@/lib/localsScoreColor";
import { placeHref } from "@/lib/placeIndexing";

export const dynamic = "force-static";

const LANGS = ["th", "en", "ko"] as const;
type Lang = typeof LANGS[number];

// All locales actually served across the site (header language switcher,
// alternates.languages in the root layout). Anything outside this set is a
// typo/broken link and should 404, not silently render English content.
const SUPPORTED_LANGS = ["th", "en", "ko", "ja", "ru", "ar"] as const;

// This route matches any single-segment path (/[lang]), which makes it a
// magnet for bot probes (/wp-login.php, /xmlrpc.php, etc). Pre-generate every
// supported lang (including the ja/ru/ar leaf pages) and hard-404 everything
// else at build time instead of rendering + ISR-caching each probe on demand.
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    th: "Thaigle — ตรวจสอบความจริงของร้านที่กำลังฮิต",
    en: "Thaigle — Verify Bangkok Places Before You Go",
    ko: "Thaigle — 방콕 장소 진짜인지 확인하세요",
  };
  const descs: Record<string, string> = {
    th: "เอาลิงก์ TikTok/IG มาใส่ — เราบอกว่าร้านนั้นดีจริงหรือแค่สปอนเซอร์ ข้อมูลจากรีวิวจริง ไม่มีอินฟลูเอนเซอร์",
    en: "Paste a TikTok or IG link — we tell you if the place is real or just sponsored hype. Data from real reviews, no influencer picks.",
    ko: "틱톡/인스타 링크를 붙여넣으면 그 장소가 진짜인지 알려드립니다. 실제 리뷰 데이터, 인플루언서 없음.",
  };
  return {
    title: titles[lang] ?? titles.en,
    description: descs[lang] ?? descs.en,
    alternates: {
      canonical: `/${lang}`,
    },
    // This is a distinct TikTok/IG-verification utility, not the site homepage —
    // keep it out of the indexed hreflang cluster to avoid competing with "/".
    robots: { index: false, follow: true },
  };
}

export default async function LangHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang as (typeof SUPPORTED_LANGS)[number])) {
    notFound();
  }

  // Trending: take top 6 places by localsScore
  const places = getAllPlaces()
    .sort((a, b) => b.localsScore - a.localsScore)
    .slice(0, 6);

  const taglines: Record<string, { h1: string; sub: string }> = {
    th: {
      h1: "ร้านนั้นดีจริงหรือเปล่า?",
      sub: "วาง TikTok / IG link หรือพิมพ์ชื่อร้าน → เราตอบจากข้อมูลจริง",
    },
    en: {
      h1: "Is that place actually good?",
      sub: "Paste a TikTok / IG link or type a name → we answer from real data",
    },
    ko: {
      h1: "그 장소 진짜 좋아요?",
      sub: "틱톡/인스타 링크 또는 장소명 입력 → 진짜 데이터로 답합니다",
    },
  };
  const tl = taglines[lang] ?? taglines.en;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">
          {tl.h1}
        </h1>
        <p className="text-base text-[var(--muted)] mb-8">{tl.sub}</p>
        <HomeSearch lang={lang} />
      </div>

      {/* Trending — SSR, crawlable */}
      {places.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">
            Recently verified
          </h2>
          <div className="space-y-3">
            {places.map((place) => {
              const t = place.i18n[lang as Lang] ?? place.i18n["en"];
              const colors = CATEGORY_COLORS[place.category as Category];
              const scoreColor = localsScoreColor(place.localsScore);

              return (
                <a
                  key={place.slug}
                  href={placeHref(lang, place.slug)}
                  className="block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-sm transition group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-0.5 shrink-0"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {place.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm group-hover:text-orange-700 transition truncate">
                        {t.name}
                      </div>
                      <div className="text-xs text-[var(--muted)]">{place.area}</div>
                    </div>
                    <span
                      className="text-sm font-black shrink-0 tabular-nums"
                      style={{ color: scoreColor }}
                    >
                      {place.localsScore}
                    </span>
                  </div>

                  {/* Feed vs Data contrast */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div
                      className="rounded-lg px-2.5 py-1.5"
                      style={{
                        background: "var(--receipt-feed-bg)",
                        color: "var(--receipt-feed-text)",
                      }}
                    >
                      <div className="font-black mb-0.5 text-[9px] uppercase tracking-wider opacity-70">
                        Feed says
                      </div>
                      <div className="line-clamp-2 italic">{t.receipt.feedSays}</div>
                    </div>
                    <div
                      className="rounded-lg px-2.5 py-1.5"
                      style={{
                        background: "var(--receipt-data-bg)",
                        color: "var(--receipt-data-text)",
                      }}
                    >
                      <div className="font-black mb-0.5 text-[9px] uppercase tracking-wider opacity-70">
                        Data says
                      </div>
                      <div className="line-clamp-2 font-medium">
                        {t.receipt.dataSays.slice(0, 100)}...
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <a
              href="/activities"
              className="text-sm text-[var(--muted)] hover:text-orange-600 transition"
            >
              Browse all verified activities
            </a>
          </div>
        </section>
      )}
    </div>
  );
}