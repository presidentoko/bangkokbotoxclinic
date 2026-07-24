import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { listGuides } from "@/lib/guides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${tFor(lang).guide.indexTitle} — ${SITE.name}`, alternates: { canonical: `/${lang}/guide` } };
}

export default async function GuideIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const guides = listGuides();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">{t.guide.indexTitle}</h1>
      <div className="space-y-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${lang}/guide/${g.slug}`}
            className="block rounded-xl border border-border p-4 hover:border-accent transition font-semibold"
          >
            {g.title[lang]}
          </Link>
        ))}
      </div>
    </div>
  );
}
