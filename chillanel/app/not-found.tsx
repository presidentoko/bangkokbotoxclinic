import Link from "next/link";
import { DEFAULT_LANG } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// True root not-found.tsx (sibling to app/(root)/ and app/[lang]/, outside
// both). Only reached when app/[lang]/layout.tsx itself throws notFound()
// for an invalid lang segment (e.g. /fr/whatever) -- a layout's own
// notFound() call can't be caught by a not-found.tsx in the same folder,
// only by one in a parent segment, and there's no lang to localize to
// here since the segment never resolved. Needs its own <html>/<body>,
// same as app/(root)/layout.tsx, since there's no shared app/layout.tsx.
export default function RootNotFound() {
  const t = tFor(DEFAULT_LANG);
  return (
    <html lang={DEFAULT_LANG} className={fontVariables}>
      <body>
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <p className="font-display italic text-6xl text-accent mb-4" aria-hidden="true">
            404
          </p>
          <h1 className="text-2xl font-bold mb-3">{t.notFound.title}</h1>
          <p className="text-muted leading-relaxed mb-8">{t.notFound.body}</p>
          <Link
            href={`/${DEFAULT_LANG}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-6 py-3 min-h-11 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            {t.notFound.cta}
          </Link>
        </div>
      </body>
    </html>
  );
}
