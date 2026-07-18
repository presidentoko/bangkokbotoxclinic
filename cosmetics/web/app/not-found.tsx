import Link from "next/link";
import "./globals.css";

// Rare fallback: triggers only when the URL has no valid locale segment at
// all (so app/[locale]/layout.tsx never ran and never supplied <html>/<body>).
// Self-contained on purpose — do not rely on components that assume a locale.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#fbf4f1] text-[#2b2222] antialiased px-4">
        <div className="text-center space-y-4">
          <p className="text-6xl">🌸</p>
          <h1 className="font-serif-display text-2xl font-semibold">Page not found</h1>
          <p className="text-sm text-neutral-500">ไม่พบหน้านี้ · This page doesn&apos;t exist.</p>
          <Link
            href="/th"
            className="inline-block rounded-full bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 min-h-[44px] text-sm font-semibold transition-colors"
          >
            Go to BangkokFillers
          </Link>
        </div>
      </body>
    </html>
  );
}
