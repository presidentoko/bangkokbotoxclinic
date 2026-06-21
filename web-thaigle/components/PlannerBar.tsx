"use client";

import Link from "next/link";
import { usePlanner } from "@/components/PlannerContext";

export function PlannerBar() {
  const { plan } = usePlanner();
  if (plan.items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white px-4 py-3 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <span className="text-lg">🗺️</span>
        <div>
          <div className="font-bold text-sm">{plan.title}</div>
          <div className="text-xs text-gray-400">{plan.items.length}곳 저장됨</div>
        </div>
      </div>
      <Link
        href="/plan"
        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full transition"
      >
        플래너 보기 →
      </Link>
    </div>
  );
}
