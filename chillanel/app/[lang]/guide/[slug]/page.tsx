import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, SITE } from "@/lib/site";
import { getGuide, listGuides } from "@/lib/guides";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: `${guide.title[lang]} — ${SITE.name}`, alternates: { canonical: `/${lang}/guide/${slug}` } };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">{guide.title[lang]}</h1>
      <p className="text-muted leading-relaxed whitespace-pre-line">{guide.body[lang]}</p>
    </div>
  );
}
