// Matches PlaceCard's shape so the loading -> loaded swap doesn't jump —
// used while favorites/compare fetch places-index.json client-side (no
// server data at request time, so there's no way to avoid a brief loading
// window; the point is not leaving it blank).
export function PlaceCardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-bg-elev overflow-hidden animate-pulse" aria-hidden="true">
      <div className="h-20 bg-border/40" />
      <div className="p-5 pt-6 space-y-3">
        <div className="h-5 bg-border/40 rounded w-3/4" />
        <div className="h-3 bg-border/40 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-border/40 rounded-full w-16" />
          <div className="h-6 bg-border/40 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}
