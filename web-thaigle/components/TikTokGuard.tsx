"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TikTokBanner() {
  const params = useSearchParams();
  if (params.get("src") !== "tiktok") return null;
  return (
    <div className="bg-black text-white text-xs font-bold text-center py-2 tracking-wide">
      📱 Via TikTok · Real Reviews · No Ads
    </div>
  );
}

export function TikTokGuard() {
  return (
    <Suspense>
      <TikTokBanner />
    </Suspense>
  );
}
