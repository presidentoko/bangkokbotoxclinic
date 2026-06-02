import { LOCALES, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  return (
    <div lang={loc}>
      <Header locale={loc} />
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
