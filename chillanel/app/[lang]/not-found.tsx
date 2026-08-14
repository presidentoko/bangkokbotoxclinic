"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLang, DEFAULT_LANG } from "@/lib/site";
import { tFor } from "@/lib/i18n";

// Catches notFound() thrown by pages nested under [lang] (place/[id],
// city/[city], district/[district], guide/[slug] all call it for unknown
// ids/slugs) -- but NOT the [lang] segment's own layout.tsx, which throws
// notFound() for an invalid lang value before this file's tree can render.
// That case falls through to the real root-level app/not-found.tsx instead
// (a documented Next.js behavior: a layout's own notFound() can't be caught
// by a not-found.tsx in the same folder, only by one in a parent segment).
//
// Next.js does not pass route `params` to not-found.js (confirmed against
// this project's Next 16 build -- it throws if you destructure params
// here), so the language is read from the URL path instead of props.
export default function LangNotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const lang = isLang(segment) ? segment : DEFAULT_LANG;
  const t = tFor(lang);
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="font-display italic text-6xl text-accent mb-4" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-bold mb-3">{t.notFound.title}</h1>
      <p className="text-muted leading-relaxed mb-8">{t.notFound.body}</p>
      <Link
        href={`/${lang}`}
        className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-6 py-3 min-h-11 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:-translate-y-0.5 transition"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}
