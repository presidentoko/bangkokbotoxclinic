export type WishlistItem = {
  id: string;
  name: string;
  type: "activity" | "restaurant";
  url: string;
  icon?: string;
};

export function encodeWishlist(items: WishlistItem[]): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(items.slice(0, 12)))));
}

export function decodeWishlist(str: string): WishlistItem[] {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(str))));
    if (!Array.isArray(data)) return [];
    return data.filter(
      (it): it is WishlistItem =>
        !!it &&
        typeof it === "object" &&
        typeof it.id === "string" &&
        typeof it.name === "string" &&
        typeof it.url === "string" &&
        // Only ever render same-origin paths here — a crafted share link
        // could otherwise smuggle a javascript:/external href into a
        // trusted-looking "a friend shared their wishlist" banner.
        it.url.startsWith("/") &&
        !it.url.startsWith("//")
    );
  } catch {
    return [];
  }
}
