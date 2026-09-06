import Script from 'next/script'
import { ADSENSE_CLIENT } from '@/lib/ads'

/**
 * GA4 and the AdSense loader.
 *
 * Until now the only traffic signal available for this site was Search Console,
 * which reports impressions and clicks but nothing about what happens after the
 * click — no sessions, no pages per visit, no scroll depth. Those are exactly
 * the numbers an advertiser asks for, and the ones needed to tell whether an ad
 * placement is worth its layout cost.
 *
 * GA4 uses `afterInteractive` so it never blocks first paint; the AdSense
 * loader is `beforeInteractive` so its tag is present in the served HTML head
 * (see below). GA4 renders nothing until `NEXT_PUBLIC_GA_ID` is set, which is
 * still the state the site ships in.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function Analytics() {
  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
          </Script>
        </>
      )}
      {/* `beforeInteractive` puts the tag in the served HTML head, which is
          where Google's own snippet says to put it and where its site-review
          crawler looks for it. The script is `async`, so it costs nothing on
          first paint, and having it in the static HTML means Auto ads can place
          units without waiting for hydration. */}
      {ADSENSE_CLIENT && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  )
}
