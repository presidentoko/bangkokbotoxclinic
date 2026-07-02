type PhotoHintsProps = {
  niche?: string;
};

const HINTS: Record<string, { tip: string; time: string; spot: string }[]> = {
  spa: [
    { tip: "Golden hour through shoji screens", time: "4–6pm", spot: "Ask reception for the garden room" },
    { tip: "Overhead steam shot from above", time: "Any time", spot: "Works best in pools/baths with steam" },
    { tip: "Zen garden flat-lay with robe", time: "Morning", spot: "Outdoor garden area" },
  ],
  "muay-thai": [
    { tip: "Action shot mid-kick, shallow depth", time: "During sparring", spot: "Corner of the ring" },
    { tip: "Gloves on ring post silhouette", time: "Sunset or after session", spot: "Outdoor gyms best" },
    { tip: "Wrap hands close-up detail", time: "Pre-training", spot: "Natural window light" },
  ],
  "yoga-pilates": [
    { tip: "Rooftop pose with city blur behind", time: "Sunrise (6–7am)", spot: "Rooftop studios in Sukhumvit" },
    { tip: "Bamboo studio flat-lay", time: "Before class", spot: "Many studios have bamboo floors" },
    { tip: "Tree pose with temple in distance", time: "Golden hour", spot: "Lumphini Park, near Silom" },
  ],
  cooking: [
    { tip: "Wok fire burst shot (set to sports mode)", time: "During cooking", spot: "Stay back 1.5m for safety" },
    { tip: "Ingredients flat-lay on banana leaf", time: "Before cooking", spot: "Ask instructor for permission" },
    { tip: "Close-up spice paste in mortar", time: "Any time", spot: "Natural light from side" },
  ],
  default: [
    { tip: "Early morning = empty streets + soft light", time: "6–8am", spot: "Old city, Chinatown, Lumphini" },
    { tip: "Market stalls most colorful at setup", time: "7–9am", spot: "Or Tor Kor, Chatuchak early entry" },
    { tip: "Rooftop bars are best at blue hour", time: "30 mins after sunset", spot: "Silom, Sathorn, Riverside" },
  ],
};

export function PhotoHints({ niche = "default" }: PhotoHintsProps) {
  const hints = HINTS[niche] ?? HINTS.default;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-sm font-black mb-3">📸 Photo Tips</div>
      <div className="space-y-3">
        {hints.map((h, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-5 h-5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
            <div>
              <div className="text-sm font-medium">{h.tip}</div>
              <div className="text-xs text-[var(--muted)] mt-0.5">⏰ {h.time} · 📍 {h.spot}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
