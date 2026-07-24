import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";

export function Footer({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-muted">
        <p>© {new Date().getFullYear()} chillanel. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
