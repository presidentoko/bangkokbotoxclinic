"use client";

type Props = {
  venueName: string;
  venueUrl: string;
};

export function ReportButton({ venueName, venueUrl }: Props) {
  const href = `/takedown?businessName=${encodeURIComponent(venueName)}&pageUrl=${encodeURIComponent(venueUrl)}`;
  return (
    <a
      href={href}
      rel="nofollow"
      className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-red-500 transition border border-transparent hover:border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg"
    >
      <span aria-hidden>⚑</span>
      Report incorrect info
    </a>
  );
}
