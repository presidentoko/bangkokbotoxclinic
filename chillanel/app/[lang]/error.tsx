"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLang, DEFAULT_LANG } from "@/lib/site";
import { tFor } from "@/lib/i18n";

// error.js must be a client component and only receives `error`/`reset` --
// no route params -- so the language is read from the URL path, same
// approach as not-found.tsx in this folder.
export default function LangError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1];
  const lang = isLang(segment) ? segment : DEFAULT_LANG;
  const t = tFor(lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-3">{t.errorPage.title}</h1>
      <p className="text-muted leading-relaxed mb-8">{t.errorPage.body}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-6 py-3 min-h-11 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          {t.errorPage.retry}
        </button>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 min-h-11 font-semibold hover:border-accent transition"
        >
          {t.errorPage.cta}
        </Link>
      </div>
    </div>
  );
}
