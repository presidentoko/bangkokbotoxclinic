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

// Every route under this layout (home, city/district/service indexes, guide
// index, about, advertise, compare, favorites — anything without its own
// nested dynamic segment) shares this [lang] segment as its only dynamic
// param. Without this, a lang value outside en/th/ko/isLang() still gets
// on-demand rendered (function invocation + ISR write) before the page's own
// isLang()+notFound() check runs — every bot probe (/wp-login.php, /fr, /de,
// random slugs) burns one, repeated after every deploy. false makes it a
// free edge 404 with zero function invocation. Nested dynamic segments
// (city/[city], place/[id], etc.) set their own dynamicParams independently
// and are unaffected by this.
export const dynamicParams = false;

// 2026-08-27: 이 사이트에는 revalidate 가 한 페이지도 없었다(12개 라우트 전부).
// 그래서 모든 응답이 `Cache-Control: public, max-age=0, must-revalidate` 로
// 나가고, 브라우저와 CDN 이 매 요청마다 되물어본다. 그게 그대로
// ISR Reads(1.5M / 한도 1M)와 Fast Origin Transfer(12.4GB / 한도 10GB)다 —
// 페이지 5,799개에 페이지당 258회 읽힌 셈이다.
//
// 되물어볼 이유가 없다: 데이터는 배포로만 바뀌고(하루 0.9회, 재배포되면
// 캐시가 통째로 갈린다) dynamicParams=false 라 전 페이지가 정적 생성이다.
// 30일은 클리닉 사이트들의 clinic/doctor 페이지와 같은 값이다.
// 레이아웃에 두면 하위 라우트 전체에 적용된다 — 개별 페이지가 더 짧은 값을
// 선언하면 그쪽이 이긴다.
export const revalidate = 2592000;

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
