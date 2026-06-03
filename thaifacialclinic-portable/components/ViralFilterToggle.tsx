"use client";
import type { Lang } from "@/lib/types";
import { t } from "@/lib/i18n";

export default function ViralFilterToggle({
  on, onChange, lang, hiddenCount,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  lang: Lang;
  hiddenCount: number;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-xs transition ${
        on
          ? "border-mint-500/40 bg-mint-50 text-mint-800 dark:bg-mint-900/30 dark:text-mint-200"
          : "border-[rgb(var(--border))] bg-[rgb(var(--bg-elev))]"
      }`}
    >
      <span className={`relative h-4 w-7 shrink-0 rounded-full transition ${on ? "bg-mint-500" : "bg-[rgb(var(--border))]"}`}>
        <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition ${on ? "left-3.5" : "left-0.5"}`} />
      </span>
      <span className="font-semibold">
        {t("filter_out_viral", lang)}
      </span>
      <span className="muted">· {hiddenCount} flagged</span>
    </button>
  );
}
