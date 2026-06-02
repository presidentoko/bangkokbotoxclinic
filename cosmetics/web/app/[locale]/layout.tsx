import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "../globals.css";
import { LOCALES, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
    template: "%s | BangkokFillers",
  },
  description:
    "จัดอันดับผลิตภัณฑ์ดูแลผิวด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ",
};

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
    <html
      lang={loc}
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf4f1] text-[#2b2222] antialiased">
        <Header locale={loc} />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 flex-1">{children}</main>
        <Footer locale={loc} />
      </body>
    </html>
  );
}
