import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isLang, SITE } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import { listCities } from "@/lib/data";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import "../globals.css";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "th" }, { lang: "ko" }];
}

// 2026-10-01: `export const dynamicParams = false` 를 제거했다.
//
// 원래 의도는 봇 차단이었다 — /fr, /wp-login.php 같은 잘못된 lang 이 on-demand
// 렌더(함수 호출 + ISR 쓰기)를 태우기 전에 엣지에서 공짜 404 를 내려는 것. 그
// 주석은 "중첩 동적 세그먼트(city/[city], place/[id])는 각자 dynamicParams 를
// 설정하므로 영향받지 않는다"고 적고 있었다. **실측 결과 그게 틀렸다.**
//
// place/[id] 는 `dynamicParams = true` 와 함께 리뷰 50개 이상만 프리렌더하고,
// "걸러진 롱테일도 요청 시 200 을 낸다"고 주석에 적어뒀는데 — 라이브에서 리뷰
// 수 구간별로 찍어보면 50 을 경계로 딱 갈린다:
//     리뷰 200+ → 200    리뷰 50~199 → 200
//     리뷰 20~49 → 404   리뷰 1~19  → 404
// 부모 세그먼트의 false 가 (lang, id) 조합 전체를 고정시키기 때문이다. 즉 관련
// 장소 8,157곳 중 **4,662곳이 404** 였다.
//
// 그냥 "색인 안 되는 롱테일"이 아니라 **사이트 자신의 링크가 깨져 있었다**:
//   /en/city/pattaya          place 링크 90개 중 69개(77%)가 404
//   /en/service/hot-stone     90개 중 27개가 404
//   /en/district/thonglor…    90개 중 2개
// 파타야 도시 페이지가 노출 36 · 클릭 0 · 평균 58.5위인 것도 이것으로 설명된다.
//
// 봇 비용은 감수한다. ISR 폭주(읽기 1.5M)의 원인은 잘못된 lang 프로브가 아니라
// AI·SEO 상업 크롤러였고 그건 app/robots.ts 에서 이미 막았다. 얇은 장소가 색인에
// 다시 불어나는 것은 dynamicParams 가 아니라 noindex 로 막는다
// (place/[id] 의 THIN_MIN_REVIEWS 참조) — 사람에겐 200, 구글에겐 noindex.

// This is the real root layout for every content page (everything except
// the bare "/" redirect -- see app/(root)/layout.tsx). Owning <html> here
// means `lang` is set correctly per static page at build time instead of
// hardcoded to "en" and patched client-side after hydration.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: "chillanel — Find your massage & spa vibe",
  description:
    "A Thailand massage & spa guide that reads real Google reviews to surface each place's actual mood — quiet & relaxing, strong pressure, good value — not just a star rating.",
  openGraph: {
    siteName: SITE.name,
    type: "website",
    url: SITE.origin,
    // Next's metadata objects don't deep-merge across segments — a child
    // page setting its own `openGraph` replaces this whole object, which
    // silently drops the image the parent app/opengraph-image.tsx route
    // would otherwise auto-attach. Every page below re-declares `images`
    // for that reason (see each page.tsx's openGraph block).
    images: [`${SITE.origin}/opengraph-image`],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  // "Browse" in the bottom tab bar used to point straight at /city/bangkok —
  // now that other cities can have data too, send it to the city chooser
  // unless there's genuinely only one city (skip the extra tap in that case).
  const cities = listCities();
  const browseHref = cities.length === 1 ? `/${lang}/city/${cities[0]}` : `/${lang}/city`;
  const t = tFor(lang);
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <WebsiteJsonLd />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        <BottomNav lang={lang} browseHref={browseHref} t={t.nav} />
        <Analytics />
        <SpeedInsights />
        {/* 2026-08-23: GA4. Vercel Analytics 는 방문수는 주지만 유입 쿼리·전환
            경로를 안 줘서, 광고주에게 "어떤 검색으로 들어와 무엇을 눌렀는지"를
            보여줄 수가 없다. 나머지 세 사이트 중 botox·facial 은 이미 GA4 가
            붙어 있고 이 사이트만 없었다.
            측정 ID 는 환경변수로만 받는다 — 코드에 박으면 프리뷰/로컬 트래픽까지
            같은 속성에 섞인다. NEXT_PUBLIC_GA_ID 가 없으면 아무것도 로드하지 않는다. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
