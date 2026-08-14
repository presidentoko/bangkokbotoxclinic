// Small set of inline SVG icons replacing the site's text-glyph icons
// (★ ♡ ♥ ✓ →) -- glyphs render inconsistently across OS/browser font
// stacks (missing tofu boxes on some Android fonts, inconsistent
// baseline/weight everywhere else) and can't take a stroke-width or scale
// cleanly the way currentColor SVG can. All are 1em square so they drop
// into existing text-size classes without extra sizing props.
type IconProps = { className?: string };

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.5l2.472 5.01 5.528.803-4 3.899.944 5.508L10 14.25l-4.944 2.47.944-5.508-4-3.899 5.528-.803L10 1.5z" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
      className={className}
      aria-hidden="true"
    >
      <path d="M10 17.2s-6.5-4-8.4-8.02C.4 6.1 2 3.2 5 3.2c1.8 0 3.3 1.1 5 3.3 1.7-2.2 3.2-3.3 5-3.3 3 0 4.6 2.9 3.4 5.98C16.5 13.2 10 17.2 10 17.2z" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 10.5l3.8 3.8L16 6" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="15" cy="4.5" r="2.2" />
      <circle cx="5" cy="10" r="2.2" />
      <circle cx="15" cy="15.5" r="2.2" />
      <path d="M6.9 8.8l6.2-3.3M6.9 11.2l6.2 3.3" />
    </svg>
  );
}
