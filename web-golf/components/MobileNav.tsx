"use client";
import { useState } from "react";

const NAV = [
  { href: "/c/course", label: "Courses" },
  { href: "/c/driving_range", label: "Driving Range" },
  { href: "/c/resort", label: "Resorts" },
  { href: "/best/highly-recommended", label: "Best of" },
  { href: "/guide/booking-thai-golf", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/price-compare", label: "Price Compare" },
  { href: "/tee-times", label: "Tee Times" },
  { href: "/conditions", label: "Conditions" },
  { href: "/about", label: "About" },
  { href: "/for-courses", label: "For Golf Clubs →" },
];

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
      >
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div id="mobile-nav" className="fixed top-14 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <nav className="flex flex-col divide-y divide-gray-100">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="px-5 py-3 flex gap-3">
                <a href="/th" className="text-xs text-gray-500 hover:text-black">TH</a>
                <a href="/ko" className="text-xs text-gray-500 hover:text-black">KO</a>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
