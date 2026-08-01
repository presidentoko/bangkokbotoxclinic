import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { ContactForm } from "@/components/ContactForm";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return [{ locale: "th" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const th = locale === "th";
  return {
    title: th ? "ติดต่อเรา" : "Contact Us",
    description: th
      ? "สอบถามโฆษณา พาร์ทเนอร์ชิพ หรือข้อเสนอแนะ"
      : "Advertising, partnership, or general enquiries.",
    alternates: {
      canonical: `${BASE}/${locale}/contact`,
      languages: {
        th: `${BASE}/th/contact`,
        en: `${BASE}/en/contact`,
        "x-default": `${BASE}/th/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const th = locale === "th";

  return (
    <div className="max-w-lg mx-auto space-y-8 py-8">
      <header className="space-y-2 border-b border-[#efe1db] pb-6">
        <h1 className="font-serif-display text-3xl font-semibold text-neutral-900">
          {th ? "ติดต่อเรา" : "Contact Us"}
        </h1>
        <p className="text-neutral-500 text-base leading-relaxed">
          {th
            ? "สอบถามเรื่องโฆษณา พาร์ทเนอร์ชิพ หรือข้อเสนอแนะ — เราตอบทุกข้อความ"
            : "Advertising, partnerships, or general feedback — we reply to everything."}
        </p>
      </header>
      <ContactForm locale={locale} />
    </div>
  );
}
