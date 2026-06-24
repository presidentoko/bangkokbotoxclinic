type Collection = { slug: string; label: string; city: string; count: number };

export function FamousVsGoodCollections({
  collections,
  analyzed,
}: {
  collections: Collection[];
  analyzed: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map(({ slug, label, city, count }) => (
        <a
          key={slug}
          href={`/famous-vs-good/${slug}`}
          className="group block bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-md transition-shadow hover:border-[#ea580c]"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-2">{city}</div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-[#ea580c] transition-colors">{label}</h3>
          <p className="text-sm text-[var(--muted)]">{count} {analyzed}</p>
        </a>
      ))}
    </div>
  );
}
