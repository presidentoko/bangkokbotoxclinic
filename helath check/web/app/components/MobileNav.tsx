"use client";
import { useState } from "react";
import Link from "next/link";
import { SiteSearch } from "./SiteSearch";
import { SavedCount } from "./SaveButton";

interface NavItem {
  href: string;
  label: string;
}

export function MobileMenuButton({
  items,
  bookLabel,
  bookHref,
  locale,
}: {
  items: NavItem[];
  bookLabel: string;
  bookHref: string;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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
        <>
          {/* Backdrop — tapping outside the panel closes the menu */}
          <div
            className="md:hidden fixed inset-0 top-14 bg-black/20 z-40"
            onClick={close}
            aria-hidden="true"
          />
          <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50 px-4 py-4 flex flex-col gap-3">
            <SiteSearch locale={locale} />
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="text-slate-700 font-medium py-2 border-b border-slate-100 last:border-0 flex items-center"
              >
                {item.label}
                {item.href === `/${locale}/saved` && <SavedCount />}
              </Link>
            ))}
            <Link
              href={bookHref}
              onClick={close}
              className="bg-blue-600 text-white text-center font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors mt-1"
            >
              {bookLabel}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
