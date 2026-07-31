// Google Photos/Maps image URLs (lh3.googleusercontent.com) encode the
// requested size directly in the URL, e.g. "...=w203-h270-k-no". Scraped
// photos were captured at thumbnail size for list-view cards; reusing the
// same URL for a full-width hero image just upscales a ~200px source into a
// ~700px box (visibly soft on any 2x+ display). Scaling both dimensions by
// the same factor preserves the exact crop already baked into the URL —
// this is a URL rewrite, not a real re-encode, so it costs nothing extra
// (works even with next.config's unoptimized:true).
export function upscaleGooglePhoto(url: string, factor = 3, max = 1600): string {
  const match = url.match(/^(.*=w)(\d+)(-h)(\d+)(-.*)$/);
  if (!match) return url;
  const [, prefix, w, hSep, h, suffix] = match;
  const newW = Math.min(Math.round(Number(w) * factor), max);
  const newH = Math.min(Math.round(Number(h) * factor), max);
  return `${prefix}${newW}${hSep}${newH}${suffix}`;
}

// Some scraped photo arrays are contaminated with reviewer profile-photo
// thumbnails (Google's own "=w32-h32-p-k-no" avatar size) instead of venue
// photos. A hero/gallery image this small is never a real venue shot.
export function isLikelyAvatarThumbnail(url: string): boolean {
  return /=w(\d+)-h(\d+)-p-k-no/.test(url) && Number(url.match(/=w(\d+)-h/)?.[1] ?? 0) <= 64;
}
