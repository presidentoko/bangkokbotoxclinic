"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a sponsored placement and reports whether anyone actually saw or
 * clicked it.
 *
 * An impression is only counted once the placement has been at least half
 * visible for a full second — a slot that flicks past during a fast scroll was
 * not seen, and counting it would overstate the number the advertiser is shown.
 * Clicks go out via sendBeacon so the request survives the navigation the click
 * causes.
 */
export function AdTracker({
  slotId,
  children,
  className = "",
}: {
  slotId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          timer = setTimeout(() => {
            if (counted.current) return;
            counted.current = true;
            send(slotId, "imp");
            observer.disconnect();
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [slotId]);

  return (
    <div ref={ref} className={className} onClickCapture={() => send(slotId, "clk")}>
      {children}
    </div>
  );
}

function send(slotId: string, kind: "imp" | "clk") {
  const payload = JSON.stringify({ slotId, kind });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/ad-event", new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  // keepalive gives fetch the same survive-the-unload property as sendBeacon.
  fetch("/api/ad-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}
