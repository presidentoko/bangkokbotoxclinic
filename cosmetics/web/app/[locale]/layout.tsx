import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "../globals.css";
import { LOCALES, type Locale, isRTL } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getBanner } from "@/lib/adminData";
import { getNoindexLocales } from "@/lib/indexing";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#fbf4f1",
};

const BASE_METADATA: Metadata = {
  metadataBase: new URL("https://bangkokfillers.com"),
  title: {
    default: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
    template: "%s | BangkokFillers",
  },
  description:
    "จัดอันดับผลิตภัณฑ์ดูแลผิวด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ",
  openGraph: {
    type: "website",
    siteName: "BangkokFillers",
    locale: "th_TH",
    alternateLocale: ["en_US"],
    title: {
      default: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
      template: "%s | BangkokFillers",
    },
    description:
      "จัดอันดับผลิตภัณฑ์ดูแลผิวด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ",
    url: "https://bangkokfillers.com",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
      template: "%s | BangkokFillers",
    },
    description:
      "จัดอันดับผลิตภัณฑ์ดูแลผิวด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ",
  },
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const noindexSet = await getNoindexLocales();
  if (noindexSet.has(locale)) {
    return { ...BASE_METADATA, robots: { index: false, follow: false } };
  }
  return BASE_METADATA;
}

export const revalidate = 300;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const banner = await getBanner();
  return (
    <html
      lang={loc}
      dir={isRTL(loc) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#fbf4f1] text-[#2b2222] antialiased">
        {banner?.active && banner.text && (
          <div className="bg-rose-500 text-white text-xs font-medium text-center py-2 px-4">
            {banner.text}
          </div>
        )}
        <Header locale={loc} />
        <main className="mx-auto w-full max-w-5xl px-4 py-8 flex-1">{children}</main>
        <Footer locale={loc} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
