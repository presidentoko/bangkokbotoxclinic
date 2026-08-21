const CAFES = [
  {
    name: "Factory Coffee (Ari garden terrace)",
    emoji: "☕",
    area: "Ari neighborhood",
    price: "Drinks ฿80–180, light food ฿120–280",
    why: "Bangkok's most popular Instagram garden café. Lush tropical plants covering every surface. Converted factory building with outdoor seating under big trees. Specialty coffee, excellent matcha, small food menu. Extremely photogenic.",
    tip: "Arrive 9–11am to get outdoor seats before Instagram crowd peaks. Weekend queues can be 30–45 min — weekdays much better. Their specialty lattes (butterfly pea, pandan, black sesame) taste as good as they photograph. Cash and card accepted.",
  },
  {
    name: "The Bookshop Bangkok",
    emoji: "📚",
    area: "Thonglor area",
    price: "Coffee ฿100–200, tea ฿80–160",
    why: "Garden café inside a converted home with bookshelves lining every wall. Outdoor garden surrounded by plants. Second-hand books for sale. Quiet, studious atmosphere. Good wifi. Very different vibe from typical Bangkok cafés — peaceful and green.",
    tip: "Excellent working café — better wifi reliability than most Bangkok coffee shops. Bring your laptop: the garden table experience with coffee + books is genuinely special. English-language books available for purchase or trade. Afternoon is quieter than morning.",
  },
  {
    name: "Treehouse Café Bangkok",
    emoji: "🌳",
    area: "Sukhumvit area",
    price: "Coffee ฿90–180, food ฿180–380",
    why: "Built around a large tree, this café has multi-level seating weaving around the actual trunk. Unique architecture, outdoor terrace, tropical greenery. Good Thai-Western café menu. Popular with creative professionals and lifestyle bloggers.",
    tip: "The 'tree level' seating (highest platform in the tree) is most popular — arrive early or wait. Brunch menu available on weekends. Parking available if coming by car. BTS + Grab the easier option from center.",
  },
  {
    name: "Chatuchak Park Garden Cafés",
    emoji: "🌺",
    area: "Mo Chit BTS area, adjacent to Chatuchak Park",
    price: "Drinks ฿50–150, food ฿80–250",
    why: "Several café clusters have appeared around Chatuchak Park's edges. Tables set in tropical park surrounds, koi ponds visible from tables, actual garden immersion. Most are Thai-owned and serve light Thai food alongside coffee. Genuinely peaceful.",
    tip: "Walk through Chatuchak Park itself (free) then choose a café along the eastern edge. Morning visits see locals doing park exercises — very Bangkok experience. Weekend market nearby means you can café → market → lunch all in one area.",
  },
];

export function BangkokGardenCafe() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Garden cafés in Bangkok — outdoor coffee spots hidden in greenery
      </h2>
      <div className="space-y-2">
        {CAFES.map((c) => (
          <div key={c.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{c.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-green-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
