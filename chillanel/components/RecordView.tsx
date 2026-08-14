"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/recently-viewed";

// Invisible -- just a side-effect on mount. Lives as its own tiny client
// component so place/[id]/page.tsx (a Server Component) doesn't need to
// become "use client" just to write one localStorage entry.
export function RecordView({ placeId }: { placeId: string }) {
  useEffect(() => {
    recordView(placeId);
  }, [placeId]);
  return null;
}
