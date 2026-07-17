"use client";
import { useEffect, useState } from "react";
import { usePlanner } from "@/components/PlannerContext";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { plan } = usePlanner();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  // Clear PlannerBar's full-width bar (which sits at bottom-16 on mobile)
  // instead of floating over its label text at the default bottom-20.
  const bottomClass = plan.items.length > 0 ? "bottom-[9rem] md:bottom-20" : "bottom-20";

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed ${bottomClass} right-4 z-40 w-10 h-10 rounded-full bg-white border border-[var(--border)] shadow-lg flex items-center justify-center text-[var(--muted)] hover:text-orange-600 hover:border-orange-400 hover:shadow-orange-100 transition-all duration-200`}
    >
      ↑
    </button>
  );
}
