export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-6" />
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <div className="h-8 w-2/3 bg-slate-200 rounded mb-3" />
        <div className="h-4 w-1/3 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-1/4 bg-slate-100 rounded" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
          <div className="h-4 w-1/2 bg-slate-200 rounded mb-3" />
          <div className="h-3 w-1/3 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}
