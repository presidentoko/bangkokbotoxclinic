import Script from 'next/script'

/**
 * GA4 and the AdSense loader, both gated on their environment variable.
 *
 * Until now the only traffic signal available for this site was Search Console,
 * which reports impressions and clicks but nothing about what happens after the
 * click — no sessions, no pages per visit, no scroll depth. Those are exactly
 * the numbers an advertiser asks for, and the ones needed to tell whether an ad
 * placement is worth its layout cost.
 *
 * Both scripts use `afterInteractive`, so neither blocks first paint. If the
 * variables are unset the component renders nothing, which is the state the
 * site ships in until the accounts exist.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID

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
      {ADSENSE_ID && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  )
}
