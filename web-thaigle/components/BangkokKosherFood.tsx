const OPTIONS = [
  {
    name: "Chabad of Thailand (Bangkok)",
    emoji: "✡️",
    area: "Sukhumvit Soi 8, near Nana BTS",
    price: "Shabbat dinner ฿0 (donation appreciated); Deli meals vary",
    why: "Chabad Bangkok serves the Jewish traveler community with Shabbat dinners on Friday evenings (reservations required). Also runs a kosher deli with takeaway options during the week. The Chabad house is a community hub — meet other Jewish travelers, get local advice, and access kosher-certified meals.",
    tip: "Email in advance for Shabbat reservation. The Chabad house also offers information about other kosher options in Bangkok. During Passover (Pesach), they organize large community seders — open to all Jewish visitors. Address: check Chabad.org for current Bangkok location.",
  },
  {
    name: "Kosher Certified Supermarkets",
    emoji: "🛒",
    area: "Villa Market branches (Sukhumvit area)",
    price: "Varies — import prices",
    why: "Villa Market (international supermarket chain) carries a selection of kosher-certified packaged foods — mostly imported Israeli products (Tnuva, Elite), American kosher products, kosher wine and grape juice. Not a specialty kosher store but sufficient for travelers who need basics.",
    tip: "Villa Market on Sukhumvit Soi 11 has the largest international selection. Look for the kosher certification marks (OU, KF, etc.) on packages. Fresh produce and eggs are generally permissible with inspection — Chabad can advise on standards.",
  },
  {
    name: "Nana (Soi 3/3.1) Arab Quarter",
    emoji: "🥙",
    area: "Sukhumvit Soi 3, near Nana BTS",
    price: "Budget meals ฿80–250",
    why: "Bangkok's Arab quarter (Soi 3 and surrounding streets) has many halal Middle Eastern restaurants — while halal and kosher are not the same, certain items overlap (falafel, hummus, tahini, vegetarian dishes, fish). For travelers needing meat-free or fish options, these restaurants offer Middle Eastern vegetarian dishes.",
    tip: "Strictly kosher travelers should verify with their rabbi about halal meat. However for falafel, hummus, vegetable dishes, and fresh fish (checking scales/fins) this area provides the most Middle Eastern food in Bangkok. Israeli tourists frequently eat here.",
  },
];

const NOTE = "Bangkok does not have a fully certified kosher butcher shop or extensive kosher restaurant infrastructure beyond Chabad. Most observant Jewish travelers rely on Chabad for hot meals, vegetarian Thai food (checking ingredients), or self-catering with imported kosher products. The Jewish traveler community in Bangkok is active — connect via Chabad for the most current information.";

export function BangkokKosherFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        ✡️ Kosher food in Bangkok — Chabad, supermarkets & practical guide
      </div>
      <div className="space-y-2 mb-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-3 leading-snug">{NOTE}</div>
    </div>
  );
}
