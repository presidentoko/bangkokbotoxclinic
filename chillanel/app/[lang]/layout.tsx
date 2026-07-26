import { notFound } from "next/navigation";
import { isLang } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";
import { BottomNav } from "@/components/BottomNav";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "th" }, { lang: "ko" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div lang={lang}>
      <HtmlLangSetter lang={lang} />
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
      <BottomNav lang={lang} />
    </div>
  );
}
