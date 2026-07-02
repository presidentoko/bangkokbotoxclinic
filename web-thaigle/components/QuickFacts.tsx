type QuickFactsProps = {
  priceRange?: string;
  hasParking?: boolean;
  acceptsCards?: boolean;
  hasEnglishMenu?: boolean;
  isHalal?: boolean;
  isVegetarianFriendly?: boolean;
};

export function QuickFacts({
  priceRange,
  hasParking,
  acceptsCards,
  hasEnglishMenu,
  isHalal,
  isVegetarianFriendly,
}: QuickFactsProps) {
  const facts = [
    priceRange && { icon: "💰", label: `Price: ${priceRange}` },
    hasEnglishMenu !== undefined && { icon: hasEnglishMenu ? "✅" : "⚠️", label: hasEnglishMenu ? "English menu" : "Thai menu only" },
    acceptsCards !== undefined && { icon: acceptsCards ? "💳" : "💵", label: acceptsCards ? "Cards accepted" : "Cash only" },
    hasParking !== undefined && { icon: hasParking ? "🅿️" : "🚌", label: hasParking ? "Parking available" : "No parking — BTS nearby" },
    isHalal && { icon: "☪️", label: "Halal certified" },
    isVegetarianFriendly && { icon: "🥗", label: "Vegetarian-friendly" },
  ].filter(Boolean) as { icon: string; label: string }[];

  if (facts.length === 0) return null;

  return (
    <div className="border border-[var(--border)] rounded-xl p-3 my-3 bg-white">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">Quick facts</div>
      <div className="flex flex-wrap gap-2">
        {facts.map((f, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-xs bg-[var(--bg)] border border-[var(--border)] px-2 py-1 rounded-full">
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
