"use client";
// Small bottom-right "↑" button that appears after scrolling past 600px.

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() { setShow(window.scrollY > 600); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="hidden sm:grid fixed bottom-6 left-24 z-30 place-items-center h-10 w-10 rounded-full bg-white border border-[rgb(var(--border))] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition print:hidden"
    >
      ↑
    </button>
  );
}
