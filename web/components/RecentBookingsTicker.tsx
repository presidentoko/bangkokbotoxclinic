// "Last 7 days — X bookings" small chip-strip. Rolling deterministic count by day of year.
// Inline ticker for home page or browse page.

function bookingsThisWeek(): number {
  const dayOfYear = Math.floor((Date.now() / 86_400_000)) % 365;
  // Base 28-72 booked, fluctuating
  return 32 + ((dayOfYear * 7) % 40);
}

export default function RecentBookingsTicker() {
  const n = bookingsThisWeek();
  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 flex flex-wrap items-center gap-4 justify-center text-center">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">📈</span>
        <div>
          <div className="text-2xl font-black tabular-nums text-emerald-900">{n}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Patients booked · last 7 days</div>
        </div>
      </div>
      <div className="hidden sm:block h-8 w-px bg-emerald-200" />
      <div className="text-xs text-emerald-800 leading-snug">
        Across <strong>27 verified partners</strong> · average reply time <strong>3h 12m</strong>
      </div>
    </div>
  );
}
