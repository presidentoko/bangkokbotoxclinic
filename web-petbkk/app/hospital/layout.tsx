/**
 * Deliberately metadata-free.
 *
 * This layout used to carry both the /hospital page metadata and a hardcoded
 * FAQPage block. A layout wraps every route beneath it, so that FAQ was being
 * injected into all 503 `/hospital/[slug]` pages as well — each detail page
 * shipped two competing FAQPage blocks, one of them about a different subject.
 *
 * The answers were also fabricated: they named โรงพยาบาลสัตว์เกษตรศาสตร์,
 * จุฬาลงกรณ์ and Animal Medical Center (none of which exist in hospitals.json),
 * claimed "กว่า 30" 24-hour clinics against an actual 79, and quoted a
 * 200–800 baht consultation range while `price_consult` is null on all 503
 * records. Both the metadata and a data-derived FAQ now live in page.tsx, which
 * scopes them to the hub page alone.
 */
export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
