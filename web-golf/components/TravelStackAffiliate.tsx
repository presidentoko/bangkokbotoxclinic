// Travel stack affiliate — Hotel × Flight × Rentcar.
// 골프+호텔 패키지가 commission 가장 큼. 도시 페이지 / 코스 페이지 / 가이드 끝에 노출.
//
// city: snake_case city slug (e.g. "chon_buri"). 도시 라벨용 cityLabel 따로 받음.

import {
  bookingHotelSearch,
  agodaHotelSearch,
  expediaHotelSearch,
  tripcomFlightSearch,
  skyscannerFlightSearch,
  rentalcarsSearch,
  klookTransferSearch,
} from "@/lib/affiliate";

type Props = {
  city: string;        // snake_case slug, AIRPORT_CODE 매칭용
  cityLabel?: string;  // 표시용 (default = city 그대로 + 첫글자 대문자)
  origin?: string;     // IATA, default ICN (인천)
  context?: "course" | "city" | "guide";
};

export function TravelStackAffiliate({ city, cityLabel, origin = "ICN", context = "city" }: Props) {
  const label = cityLabel || city.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const heading =
    context === "course" ? "Plan your stay around this round" :
    context === "guide"  ? "Putting it all together — book the trip" :
                           `Plan your ${label} golf trip`;

  const hotelAgoda    = agodaHotelSearch(label);
  const hotelBooking  = bookingHotelSearch(label);
  const hotelExpedia  = expediaHotelSearch(label);
  const flightTrip    = tripcomFlightSearch(city, origin);
  const flightSky     = skyscannerFlightSearch(city, origin);
  const carRental     = rentalcarsSearch(label);
  const transfer      = klookTransferSearch(label);

  return (
    <aside className="my-8 border border-[var(--border)] rounded-2xl p-5 bg-gradient-to-br from-sky-50 via-white to-indigo-50 shadow-sm">
      <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Travel partners · sponsored
          </div>
          <h3 className="text-base font-bold mt-1">{heading}</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">Hotel · flight · airport transfer</span>
      </div>

      {/* Hotel row */}
      <div className="mb-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          🛏 Hotel near {label}
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <PartnerLink href={hotelAgoda} title="Agoda" subtitle="Most-used by Korean travellers" color="rose" />
          <PartnerLink href={hotelBooking} title="Booking.com" subtitle="Largest inventory" color="indigo" />
          <PartnerLink href={hotelExpedia} title="Expedia" subtitle="Flight + hotel bundles" color="amber" />
        </div>
      </div>

      {/* Flight row */}
      <div className="mb-3">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          ✈ Flight ({origin} → {label})
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <PartnerLink href={flightTrip} title="Trip.com" subtitle="Asia inbound specialist" color="sky" />
          <PartnerLink href={flightSky} title="Skyscanner" subtitle="Multi-airline price compare" color="emerald" />
        </div>
      </div>

      {/* Transfer / Rentcar row */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
          🚗 Airport transfer · rental car
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <PartnerLink href={transfer} title="Klook transfer" subtitle="Pre-booked car + driver" color="orange" />
          <PartnerLink href={carRental} title="Rentalcars" subtitle="Self-drive comparison" color="slate" />
        </div>
      </div>

      <p className="text-[10px] text-[var(--muted)] mt-3 leading-relaxed">
        Some links are sponsored — we may earn a small commission on bookings at no extra cost to you. Course rankings are never paid.
      </p>
    </aside>
  );
}

type LinkProps = { href: string; title: string; subtitle: string; color: "rose" | "indigo" | "amber" | "sky" | "emerald" | "orange" | "slate" };

const COLOR_RING: Record<LinkProps["color"], string> = {
  rose:    "hover:border-rose-400",
  indigo:  "hover:border-indigo-400",
  amber:   "hover:border-amber-400",
  sky:     "hover:border-sky-400",
  emerald: "hover:border-emerald-400",
  orange:  "hover:border-orange-400",
  slate:   "hover:border-slate-400",
};
const COLOR_ARROW: Record<LinkProps["color"], string> = {
  rose:    "text-rose-600",
  indigo:  "text-indigo-600",
  amber:   "text-amber-600",
  sky:     "text-sky-600",
  emerald: "text-emerald-600",
  orange:  "text-orange-600",
  slate:   "text-slate-600",
};

function PartnerLink({ href, title, subtitle, color }: LinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener sponsored nofollow"
      className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-[var(--border)] ${COLOR_RING[color]} hover:shadow-sm transition`}
    >
      <div className="min-w-0">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-[11px] text-[var(--muted)] truncate">{subtitle}</div>
      </div>
      <span className={`${COLOR_ARROW[color]} group-hover:translate-x-0.5 transition shrink-0 text-sm`}>→</span>
    </a>
  );
}
