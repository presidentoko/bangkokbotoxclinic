import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${tFor(lang).about.title} — ${SITE.name}`, alternates: { canonical: `/${lang}/about` } };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">{t.about.title}</h1>
      <p className="text-muted leading-relaxed">{t.about.body}</p>
    </div>
  );
}
