"use client";

import { useState, useEffect } from "react";
import { ShortlistButton } from "./ShortlistButton";

interface Props {
  id: string;
  name: string;
  cityLabel: string;
  phone?: string | null;
  mapsUrl?: string | null;
  website?: string | null;
}

export function SupplierActionBar({ id, name, cityLabel, phone, mapsUrl, website }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waPhone = phone
    ? (() => {
        const digits = phone.replace(/\D/g, "");
        const intl = digits.startsWith("66") ? digits : digits.startsWith("0") ? "66" + digits.slice(1) : digits;
        const msg = encodeURIComponent(`Hello ${name}, I found you on thaisupplyhub.com and would like a quote.`);
        return digits.length >= 6 ? `https://wa.me/${intl}?text=${msg}` : null;
      })()
    : null;

  if (!visible) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <div className="font-bold text-sm truncate min-w-0 text-stone-900">{name}</div>
        <div className="flex items-center gap-1.5 shrink-0">
          {waPhone && (
            <a
              href={waPhone}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.837L.057 23.882l6.21-1.452A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.664-.527-5.176-1.437l-.371-.22-3.686.862.902-3.589-.241-.381A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
          )}
          {phone && !waPhone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-stone-900 text-white hover:bg-stone-700 transition"
            >
              📞 Call
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 px-2.5 rounded-lg text-xs font-bold border border-stone-300 bg-white hover:border-stone-600 transition"
              aria-label="Maps"
            >
              📍
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="py-1.5 px-2.5 rounded-lg text-xs font-bold border border-stone-300 bg-white hover:border-stone-600 transition hidden sm:block"
              aria-label="Website"
            >
              🌐
            </a>
          )}
          <ShortlistButton id={id} name={name} cityLabel={cityLabel} variant="icon" />
          <a
            href="#rfq"
            className="py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-700 text-white hover:bg-amber-800 transition"
          >
            Get quote
          </a>
        </div>
      </div>
    </div>
  );
}
