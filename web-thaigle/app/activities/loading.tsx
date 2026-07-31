export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 w-96 max-w-full bg-gray-100 rounded-lg mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border)] p-4 h-32 bg-gray-50" />
        ))}
      </div>
    </div>
  );
}
