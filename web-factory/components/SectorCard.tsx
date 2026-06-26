type SectorCardProps = {
  icon: string;
  label: string;
  href: string;
  supplierCount: number;
  dbdCount: number;
  topCity: string;
};

export function SectorCard({ icon, label, href, supplierCount, dbdCount, topCity }: SectorCardProps) {
  return (
    <a
      href={href}
      className="group block border border-[var(--border)] rounded-2xl bg-white p-5 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-bold text-base group-hover:text-emerald-700 transition">{label}</div>
      <div className="mt-3 space-y-1">
        <div className="text-sm text-[var(--muted)]">
          <span className="font-semibold text-[var(--fg)]">{supplierCount.toLocaleString()}</span> suppliers
        </div>
        <div className="text-sm text-emerald-700 font-medium">
          {dbdCount.toLocaleString()} DBD-verified
        </div>
        <div className="text-xs text-[var(--muted)] mt-2">📍 {topCity}</div>
      </div>
    </a>
  );
}
