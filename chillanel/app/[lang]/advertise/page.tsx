import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, ogLocale } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdvertiseForm } from "@/components/AdvertiseForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.advertise.title} — ${SITE.name}`,
    description: t.advertise.intro,
    alternates: {
      canonical: `/${lang}/advertise`,
      languages: hreflangAlternates((l) => `/${l}/advertise`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/advertise`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
    // 2026-08-20: 예전엔 noindex 였다 — "업주용 리드폼은 검색 의도가 없다"는
    // 판단이었는데, 이 페이지가 이 사이트의 유일한 수익 페이지다. 스파 업주가
    // "advertise on bangkok spa directory" 같은 질의로 도달할 수 있어야 하고,
    // 광고 네트워크 심사도 광고주 안내 페이지를 크롤해서 확인한다.
    // 중복 보일러플레이트 우려는 사이트맵 우선순위를 낮게 두는 쪽으로 다룬다.
  };
}

export default async function AdvertisePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.advertise.title, href: `/${lang}/advertise` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">{t.advertise.title}</h1>
      <p className="text-muted leading-relaxed text-lg mb-8">{t.advertise.intro}</p>
      <AdvertiseForm lang={lang} />
    </div>
  );
}
