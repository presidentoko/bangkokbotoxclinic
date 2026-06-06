import { Geist, Lora } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], style: ["normal", "italic"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${lora.variable} h-full`}>
      <body className="min-h-full bg-[#fbf4f1] text-[#2b2222] antialiased">{children}</body>
    </html>
  );
}
