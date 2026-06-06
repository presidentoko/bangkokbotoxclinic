import type { ReactElement } from "react";
import type { Clinic } from "@/lib/types";

const ICON: Record<string, ReactElement> = {
  reddit: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11"/></svg>,
  naver: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><text x="2" y="18" fontSize="16" fontWeight="700">N</text></svg>,
  maps: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>,
  photos: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 5h-3.2l-1.8-2H9L7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>,
  videos: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7zM1 5h13v14H1z"/></svg>,
  bookimed: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>,
  website: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" fillOpacity="0" stroke="currentColor" strokeWidth="1.5"/></svg>,
};

const LABEL: Record<string, string> = {
  reddit: "Reddit", naver: "Naver", maps: "Maps",
  photos: "Photos", videos: "YouTube", bookimed: "Bookimed", website: "Site",
};

function badge(key: string, count: number) {
  if (!count) return null;
  return (
    <span key={key} className="src-badge" data-source={key} aria-label={`${LABEL[key]}: ${count}`}>
      {ICON[key]}
      <span>{LABEL[key]}</span>
      <strong className="ml-0.5 tabular-nums">{count}</strong>
    </span>
  );
}

export default function SourceBadges({
  c,
  compact = false,
}: {
  c: Clinic;
  compact?: boolean;
}) {
  // Use scraped reviews count as a proxy for Reddit/Naver/etc (we have a single combined source for now)
  const items = [
    { key: "maps", count: c.source_badges.google_reviews },
    { key: "photos", count: c.source_badges.photos },
    { key: "videos", count: c.source_badges.videos },
    { key: "bookimed", count: c.source_badges.bookimed },
    { key: "website", count: c.source_badges.website },
  ];
  return (
    <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
      {items.map((i) => badge(i.key, i.count))}
    </div>
  );
}
