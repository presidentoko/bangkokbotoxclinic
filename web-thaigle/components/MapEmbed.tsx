// ⚠️ AUTO-GENERATED from shared/components/MapEmbed.tsx
// DO NOT edit directly — edit shared/components/MapEmbed.tsx, then run `python scripts/sync_shared.py`.

// Google Maps iframe — API key 불필요, 무료. lat/lng 또는 검색어 사용.

export function MapEmbed({
  lat, lng, name, height = 320,
}: {
  lat: number | null;
  lng: number | null;
  name: string;
  height?: number;
}) {
  // 좌표 있으면 그걸로, 없으면 이름 + 방콕 으로 검색
  const query = lat && lng ? `${lat},${lng}` : encodeURIComponent(`${name} Bangkok`);
  const src = `https://maps.google.com/maps?q=${query}&z=16&hl=en&output=embed`;

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-gray-50">
      <iframe
        src={src}
        width="100%"
        height={height}
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map: ${name}`}
      />
    </div>
  );
}
