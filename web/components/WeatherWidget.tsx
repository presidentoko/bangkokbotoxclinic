// 5-day Bangkok weather forecast — synth/seasonal model (no API needed).
// Helps trip planning by showing expected temp + rain probability.

const MONTH_PROFILES = [
  /* Jan */ { temp: [22, 32], rain: 5,  vibe: "Cool & dry" },
  /* Feb */ { temp: [23, 33], rain: 5,  vibe: "Cool & dry" },
  /* Mar */ { temp: [25, 35], rain: 15, vibe: "Hot start" },
  /* Apr */ { temp: [27, 37], rain: 20, vibe: "Hottest" },
  /* May */ { temp: [26, 35], rain: 50, vibe: "Hot + storms" },
  /* Jun */ { temp: [25, 33], rain: 60, vibe: "Rainy season" },
  /* Jul */ { temp: [25, 33], rain: 65, vibe: "Rainy season" },
  /* Aug */ { temp: [25, 33], rain: 70, vibe: "Rainy peak" },
  /* Sep */ { temp: [25, 33], rain: 80, vibe: "Rainy peak" },
  /* Oct */ { temp: [24, 32], rain: 60, vibe: "Rain tapering" },
  /* Nov */ { temp: [22, 31], rain: 15, vibe: "Cool starts" },
  /* Dec */ { temp: [21, 31], rain: 5,  vibe: "Cool & dry" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeatherWidget() {
  const now = new Date();
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const m = MONTH_PROFILES[d.getMonth()];
    // Mild day-to-day variation
    const variance = ((d.getDate() * 7) % 4) - 2;
    return {
      label: i === 0 ? "Today" : DAY_LABELS[d.getDay()],
      date: d.getDate(),
      low: m.temp[0] + variance,
      high: m.temp[1] + variance,
      rain: m.rain + (variance * 3),
      vibe: m.vibe,
    };
  });

  const todayVibe = days[0].vibe;
  const goodForOutdoor = days[0].rain < 30;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Bangkok weather</div>
          <h3 className="text-base font-black mt-0.5">Plan your trip · {todayVibe}</h3>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${goodForOutdoor ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
          {goodForOutdoor ? "Good outdoor day" : "Pack umbrella"}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {days.map((d, i) => (
          <div key={i} className="rounded-lg bg-slate-50 border p-2 text-center" style={{ borderColor: "var(--border)" }}>
            <div className="text-[10px] font-bold uppercase text-[var(--muted)]">{d.label}</div>
            <div className="text-xs font-black tabular-nums">{d.date}</div>
            <div className="text-2xl my-1">
              {d.rain >= 60 ? "🌧" : d.rain >= 30 ? "⛅" : "☀️"}
            </div>
            <div className="text-[10px] tabular-nums">
              <strong>{d.high}°</strong>
              <span className="text-[var(--muted)]"> / {d.low}°</span>
            </div>
            <div className="text-[9px] text-[var(--muted)] mt-0.5">{d.rain}% rain</div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed">
        Climate averages — confirm with weather.com closer to travel. Most procedures unaffected by weather.
      </p>
    </section>
  );
}
