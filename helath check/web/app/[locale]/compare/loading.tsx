export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-80 bg-slate-100 rounded mb-5" />
      <div className="flex flex-wrap gap-2 mb-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-100 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl h-56" />
        ))}
      </div>
    </div>
  );
}
