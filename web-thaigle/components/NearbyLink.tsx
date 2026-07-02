"use client";
import { useState } from "react";

const BKK_AREAS = [
  { name: "Sukhumvit", url: "/restaurants/bangkok/sukhumvit", lat: 13.7308, lng: 100.5697 },
  { name: "Silom", url: "/restaurants/bangkok/silom", lat: 13.7224, lng: 100.5218 },
  { name: "Thonglor", url: "/restaurants/bangkok/thonglor", lat: 13.7285, lng: 100.5869 },
  { name: "Chatuchak", url: "/restaurants/bangkok/chatuchak", lat: 13.7953, lng: 100.5507 },
  { name: "Ari", url: "/restaurants/bangkok/ari", lat: 13.7774, lng: 100.5459 },
  { name: "Siam", url: "/restaurants/bangkok/siam", lat: 13.745, lng: 100.5346 },
];

function dist(lat1: number, lng1: number, lat2: number, lng2: number) {
  return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
}

export function NearbyLink() {
  const [state, setState] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [area, setArea] = useState<typeof BKK_AREAS[0] | null>(null);

  const findNearest = () => {
    if (!navigator.geolocation) { setState("error"); return; }
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const nearest = BKK_AREAS.reduce((a, b) =>
          dist(lat, lng, a.lat, a.lng) < dist(lat, lng, b.lat, b.lng) ? a : b
        );
        setArea(nearest);
        setState("found");
      },
      () => setState("error"),
      { timeout: 5000 }
    );
  };

  if (state === "found" && area) {
    return (
      <a
        href={area.url}
        className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition"
      >
        📍 Nearest area: {area.name} →
      </a>
    );
  }

  return (
    <button
      onClick={findNearest}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-full border border-[var(--border)] font-bold hover:border-orange-400 hover:text-orange-700 transition disabled:opacity-60"
    >
      {state === "loading" ? "📍 Finding..." : state === "error" ? "📍 Use GPS ✕" : "📍 Find nearest area"}
    </button>
  );
}
