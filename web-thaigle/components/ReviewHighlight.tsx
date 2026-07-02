type ReviewHighlightProps = {
  review: string;
  author?: string;
  rating?: number;
  venueName?: string;
  venueUrl?: string;
};

export function ReviewHighlight({ review, author, rating, venueName, venueUrl }: ReviewHighlightProps) {
  return (
    <blockquote className="border-l-4 border-orange-400 bg-orange-50 rounded-r-xl p-4 my-4">
      <p className="text-sm italic text-[var(--fg)] leading-relaxed mb-2">&ldquo;{review}&rdquo;</p>
      <footer className="flex items-center gap-2 flex-wrap">
        {rating && (
          <span className="text-yellow-500 font-bold text-xs">{"★".repeat(Math.round(rating))}</span>
        )}
        {author && (
          <cite className="text-xs text-[var(--muted)] not-italic">— {author}</cite>
        )}
        {venueName && venueUrl && (
          <a href={venueUrl} className="text-xs text-orange-600 font-bold hover:underline ml-auto">
            {venueName} →
          </a>
        )}
      </footer>
    </blockquote>
  );
}
