// Video-consult availability badge + CTA. Reduces "I have to fly first" anxiety.
// Used inline next to other badges on clinic detail.

export default function VirtualConsultBadge({
  clinicName,
  available = true,
}: {
  clinicName: string;
  available?: boolean;
}) {
  if (!available) return null;
  return (
    <a
      href={`mailto:hello@bkkclinics.com?subject=${encodeURIComponent(`Video consult request — ${clinicName}`)}`}
      className="inline-flex items-center gap-2 rounded-full border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800 transition"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      <span>📹 Free video pre-consult</span>
      <span className="text-blue-600">·</span>
      <span>15 min</span>
    </a>
  );
}
