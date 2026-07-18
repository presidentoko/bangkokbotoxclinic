// URL builders shared by every share surface (product, quiz result, concern, compare).
// Kept framework-agnostic (no browser APIs) so it's safe to import from server components too.

export function withShareUtm(url: string, medium: string): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}utm_source=share&utm_medium=${encodeURIComponent(medium)}`;
}

export function lineShareUrl(url: string): string {
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
}

export function whatsappShareUrl(text: string, url: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`;
}

export function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
