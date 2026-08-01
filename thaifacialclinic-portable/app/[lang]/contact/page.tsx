import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { SUPPORTED_LANGS, SITE } from "@/lib/i18n";
import { CONTACT, fullAddress } from "@/lib/contact";
import Header from "@/components/Header";
import ContactBlock from "@/components/ContactBlock";
import EmergencyContactsBar from "@/components/EmergencyContactsBar";

export const dynamicParams = false;
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: `Contact — ${SITE.name}`,
    description: `Reach ${SITE.name} via LINE, WhatsApp, or email. Bangkok-based. Replies within 1 hour during business hours.`,
    alternates: {
      canonical: `${SITE.origin}/${lang}/contact/`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/contact/`])),
        "x-default": `${SITE.origin}/en/contact/`,
      },
    },
  };
}

const COPY: Record<Lang, { head: string; sub: string; map_label: string }> = {
  en: { head: "Talk to us",                     sub: "LINE is fastest. Real humans, not a chatbot.", map_label: "Office (visits by appointment)" },
  ko: { head: "연락하기",                       sub: "라인이 가장 빠릅니다. 챗봇 아닌 실제 사람.",   map_label: "사무실 (방문은 예약제)" },
  th: { head: "ติดต่อเรา",                      sub: "LINE เร็วที่สุด · ทีมงานจริง",                 map_label: "ออฟฟิศ (เยี่ยมตามนัด)" },
  zh: { head: "联系我们",                       sub: "LINE 最快 · 真人客服",                          map_label: "办公室（预约访问）" },
  ar: { head: "تواصل معنا",                     sub: "LINE هو الأسرع — فريق بشري حقيقي.",           map_label: "المكتب (زيارات بموعد)" },
};

export default async function ContactPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = COPY[lang] || COPY.en;
  const addr = fullAddress();
  const hasAddress = addr && CONTACT.address.line1;

  return (
    <>
      <Header lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <div className="text-xs font-black uppercase tracking-widest text-clinic">{t.head}</div>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold tracking-tighter-display">{t.head}</h1>
          <p className="mt-2 text-base text-[rgb(var(--muted))]">{t.sub}</p>
        </header>

        <section className="mb-10">
          <ContactBlock />
        </section>

        {/* Map embed if address set */}
        {hasAddress && (
          <section className="mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-3">{t.map_label}</h2>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "rgb(var(--border))" }}>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}
                title="Office location"
                className="w-full h-72"
                loading="lazy"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-[rgb(var(--muted))] mt-2">{addr}</p>
          </section>
        )}

        {/* Emergency / safety */}
        <section className="mb-10">
          <EmergencyContactsBar />
        </section>

        {/* Channel guide */}
        <section className="rounded-2xl border-2 bg-slate-50 p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
          <h2 className="font-display text-xl font-bold tracking-tighter-display mb-3">Which channel for what</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><strong className="text-emerald-700 w-20 shrink-0">LINE:</strong><span>General questions, clinic recommendations, &quot;help me decide&quot;</span></li>
            <li className="flex gap-2"><strong className="text-emerald-700 w-20 shrink-0">WhatsApp:</strong><span>International patients (UAE / Korea / SG) who don&apos;t use LINE</span></li>
            <li className="flex gap-2"><strong className="text-emerald-700 w-20 shrink-0">Email:</strong><span>Refund requests, partnership inquiries, written quotes you want to save</span></li>
            <li className="flex gap-2"><strong className="text-emerald-700 w-20 shrink-0">Billing:</strong><span><a className="underline" href={`mailto:${CONTACT.email.billing}`}>{CONTACT.email.billing}</a> — payment confirmations only</span></li>
            <li className="flex gap-2"><strong className="text-emerald-700 w-20 shrink-0">Clinics:</strong><span><a className="underline" href={`mailto:${CONTACT.email.partners}`}>{CONTACT.email.partners}</a> — to apply as a verified partner</span></li>
          </ul>
        </section>
      </main>
    </>
  );
}
