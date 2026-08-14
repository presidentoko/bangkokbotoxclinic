"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { Lang } from "@/lib/site";

type MapPlace = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
};

// Leaflet's default marker PNGs resolve relative to the page URL, not the
// bundled asset path -- the classic bundler gotcha where every marker
// silently renders as a broken image. A small inline SVG divIcon sidesteps
// that entirely (no image request at all) and matches the rest of the
// site's no-photo-pipeline aesthetic (gradient PlaceCard headers, not
// stock imagery).
function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 1px 2px rgb(0 0 0 / 0.35))">
      <path d="M13 0C5.8 0 0 5.8 0 13c0 9.5 13 21 13 21s13-11.5 13-21C26 5.8 20.2 0 13 0z" fill="${color}"/>
      <circle cx="13" cy="13" r="5.5" fill="white"/>
    </svg>`,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
}

const DEFAULT_PIN = pinIcon("#0e7c6b");

function FitBounds({ points }: { points: MapPlace[] }) {
  const map = useMap();
  useMemo(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 16 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points.map((p) => p.id).join(",")]);
  return null;
}

// Client-only Leaflet + OpenStreetMap view -- lat/lng is 100% covered in
// the live dataset (see the 2026-08-14 retention audit), but until now
// nothing on the site actually plotted it. Free, no API key (OSM tiles
// require only the attribution link below, not a billing account like
// Google Maps embeds would).
export function PlaceMap({
  places,
  lang,
  viewLabel,
  heightClassName = "h-80 sm:h-96",
}: {
  places: MapPlace[];
  lang: Lang;
  /** Label for the popup's "view place" link -- passed in rather than importing lib/i18n here, same reasoning as CardActions.tsx. */
  viewLabel: string;
  heightClassName?: string;
}) {
  const points = places.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (points.length === 0) return null;
  const center: [number, number] = [points[0].lat, points[0].lng];

  return (
    <div className={`${heightClassName} rounded-2xl overflow-hidden border border-border`}>
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={DEFAULT_PIN}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold mb-1">{p.name}</div>
                {p.rating != null && <div className="text-xs text-muted mb-1.5">★ {p.rating.toFixed(1)}</div>}
                <Link href={`/${lang}/place/${p.id}`} className="text-xs font-semibold text-accent hover:underline">
                  {viewLabel}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
