import { Inter, Fraunces, Noto_Sans_KR, Noto_Sans_Thai } from "next/font/google";

// Shared across both root layouts (app/(root)/layout.tsx and
// app/[lang]/layout.tsx) -- next/font/google should only be called once per
// font, not duplicated per file, or Next.js treats them as separate font
// instances.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const notoKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-kr",
  display: "swap",
});
const notoTH = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-th",
  display: "swap",
});

export const fontVariables = `${inter.variable} ${fraunces.variable} ${notoKR.variable} ${notoTH.variable}`;
