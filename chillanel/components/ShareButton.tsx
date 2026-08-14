"use client";

import { useState } from "react";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { ShareIcon, CheckIcon } from "@/components/Icon";

// A massage trip is usually a two-person decision (booking for a partner,
// checking with whoever's paying) -- neither favorites nor compare had any
// way to hand the list to someone else, so both stayed single-player even
// though the compare table in particular is built to be looked at
// together. navigator.share opens the OS share sheet where available
// (mobile Safari/Chrome); everywhere else this falls back to copying the
// link, since Clipboard API has far broader support than the Web Share API
// (desktop Chrome/Firefox lack it entirely).
export function ShareButton({
  lang,
  url,
  title,
  className,
  iconClassName = "w-4 h-4",
}: {
  lang: Lang;
  url: string;
  title: string;
  className?: string;
  iconClassName?: string;
}) {
  const t = tFor(lang);
  const [copied, setCopied] = useState(false);

  async function onClick() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled the share sheet, or the OS call itself failed --
        // either way fall through to copy so the button still does
        // something rather than silently no-op.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied -- nothing more this button can do.
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-border bg-bg font-semibold px-5 py-2.5 min-h-11 hover:border-accent transition"
      }
    >
      {copied ? (
        <>
          <CheckIcon className={`${iconClassName} text-accent`} /> {t.share.copied}
        </>
      ) : (
        <>
          <ShareIcon className={iconClassName} /> {t.share.button}
        </>
      )}
    </button>
  );
}
