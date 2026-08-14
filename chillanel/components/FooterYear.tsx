"use client";

import { useEffect, useState } from "react";

// Footer.tsx is a statically-generated server component cached until the
// next deploy -- new Date().getFullYear() there froze at build time and
// would show the wrong year for however long the site goes between deploys
// after a Jan 1 rollover (now up to 24h at minimum, more if scraping is
// quiet -- see scripts/refresh-and-deploy.mjs). This corrects it
// client-side after mount; the build-time value is still the SSR/no-JS
// fallback, so suppressHydrationWarning is safe here since a mismatch only
// ever means "one year stale on the one day a year it could differ", not a
// real content bug.
export function FooterYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span suppressHydrationWarning>{year}</span>;
}
