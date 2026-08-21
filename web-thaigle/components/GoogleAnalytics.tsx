import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * GA4.
 *
 * The site already reports to Vercel Analytics, which is kept: it is what
 * lib/track.ts sends affiliate-click events to and it needs no consent
 * banner. GA4 is added alongside it for one reason Vercel Analytics cannot
 * cover — it links to AdSense, which is what turns "this page got traffic"
 * into "this page earned $X". Without that link there is no way to tell which
 * page types are worth more ad inventory.
 *
 * Renders nothing until NEXT_PUBLIC_GA_ID is set, so this ships before the
 * property exists.
 */
export function GoogleAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(GA_ID)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
