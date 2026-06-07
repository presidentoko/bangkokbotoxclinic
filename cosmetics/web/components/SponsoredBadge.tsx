interface Props {
  locale: string;
  className?: string;
}

export function SponsoredBadge({ locale, className = "" }: Props) {
  const label = locale === "th" ? "ได้รับการสนับสนุน" : "Sponsored";
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-amber-100 text-amber-700 border border-amber-200 ${className}`}
    >
      {label}
    </span>
  );
}
