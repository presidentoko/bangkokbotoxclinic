"use client";
import { useState } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

export function MobileMenuButton({
  items,
  bookLabel,
  bookHref,
}: {
  items: NavItem[];
  bookLabel: string;
  bookHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1 p-2"
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`} />
        <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
      </button>

      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 px-4 py-4 flex flex-col gap-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-slate-700 font-medium py-2 border-b border-slate-100 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={bookHref}
            onClick={() => setOpen(false)}
            className="bg-blue-600 text-white text-center font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors mt-1"
          >
            {bookLabel}
          </Link>
        </div>
      )}
    </>
  );
}
