import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import type { TherapistMention } from "@/lib/types";

export function TherapistMentions({
  mentions,
  lang,
}: {
  mentions: TherapistMention[];
  lang: Lang;
}) {
  const t = tFor(lang);

  if (mentions.length === 0) {
    return <p className="text-sm text-muted">{t.place.noMentions}</p>;
  }

  return (
    <div>
      <p className="text-xs text-muted mb-4 leading-relaxed border-l-2 border-border pl-3">
        {t.place.therapistDisclaimer}
      </p>
      <div className="space-y-4">
        {mentions.map((m) => (
          <div key={m.name} className="rounded-xl border border-border p-4">
            <div className="font-bold text-accent mb-2">
              {m.name} <span className="text-muted font-normal text-xs">· mentioned {m.count}x</span>
            </div>
            <ul className="space-y-1.5">
              {m.quotes.map((q, i) => (
                <li key={i} className="text-sm text-muted italic">&ldquo;{q}&rdquo;</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
