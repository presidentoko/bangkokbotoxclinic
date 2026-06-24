"use client";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-20 sm:bottom-6 right-4 z-50 w-10 h-10 rounded-full bg-[var(--fg)] text-white flex items-center justify-center shadow-lg hover:opacity-80 transition text-sm"
    >
      ↑
    </button>
  );
}
