"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";
import { tFor } from "@/lib/i18n";
import { getRecentlyViewedIds } from "@/lib/recently-viewed";
import { loadPlacesIndex } from "@/lib/places-index-client";
import { PlaceCard } from "@/components/PlaceCard";

// Same lazy-load-on-scroll-into-view treatment as RecommendedForYou (see
// that file for why): this section is below the fold and most visitors
// never have any recently-viewed places yet on a first session, so it
// shouldn't cost a fetch until it's actually about to be seen.
export function RecentlyViewed({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [items, setItems] = useState<Place[] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    const node = rootRef.current;
    if (!node) return;
    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (triggered || !entries.some((e) => e.isIntersecting)) return;
        triggered = true;
        observer.disconnect();
        loadPlacesIndex()
          .then((all) => {
            const byId = new Map(all.map((p) => [p.id, p]));
            setItems(ids.map((id) => byId.get(id)).filter((p): p is Place => Boolean(p)));
          })
          .catch(() => setItems([]));
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items === null) return <div ref={rootRef} />;
  if (items.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="font-display italic text-2xl sm:text-3xl mb-6">{t.home.recentlyViewedTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
    </section>
  );
}
