// Photo URL resolver — local 백업 사진 path 를 외부 CDN(예: R2) 로 라우팅.
//
// 동작:
//   - NEXT_PUBLIC_PHOTOS_BASE 비어 있으면 path 그대로 반환 (local /photos/ 서빙).
//   - 비어 있지 않으면 path 가 "/photos/..." 로 시작할 때 prefix 붙임.
//   - 외부 URL (http://, https://) 은 그대로.
//
// 예: NEXT_PUBLIC_PHOTOS_BASE="https://photos.thaisupplyhub.com"
//   photoUrl("/photos/ChIJ../0.jpg") → "https://photos.thaisupplyhub.com/photos/ChIJ../0.jpg"
//   photoUrl("https://lh3.googleusercontent.com/...") → unchanged
//   photoUrl(null) → ""

const BASE = (process.env.NEXT_PUBLIC_PHOTOS_BASE || "").replace(/\/+$/, "");

export function photoUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/photos/")) return path;
  if (!BASE) return path;
  return BASE + path;
}
