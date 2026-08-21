"use client";

import { useState, useEffect } from "react";
import { detectLang, switchLangHref, type Lang } from "@/lib/localeRoutes";

// 헤더 네비 — 모바일 햄버거 + 언어 스위처 통합.
// 언어 스위처: 현재 path 보존하면서 prefix 만 변경 (/about → /ko/about → /th/about).

const NAV = [
  { en: "Manufacturers",      ko: "제조사",          th: "ผู้ผลิต",          href: "/c/manufacturer", hrefKo: "/ko/c/manufacturer", hrefTh: "/th/c/manufacturer" },
  { en: "Auto Parts",         ko: "자동차 부품",     th: "ชิ้นส่วนยานยนต์",  href: "/c/auto_parts",   hrefKo: "/ko/c/auto_parts",   hrefTh: "/th/c/auto_parts" },
  { en: "Industrial Estates", ko: "산업단지",        th: "นิคมอุตสาหกรรม",   href: "/c/industrial_estate", hrefKo: "/ko/c/industrial_estate", hrefTh: "/th/c/industrial_estate" },
  { en: "Warehouses",         ko: "창고",            th: "คลังสินค้า",       href: "/c/warehouse",    hrefKo: "/ko/c/warehouse",    hrefTh: "/th/c/warehouse" },
  { en: "Compare",            ko: "비교하기",        th: "เปรียบเทียบ",      href: "/compare",        hrefKo: "/compare",           hrefTh: "/compare" },
  { en: "Guides",             ko: "가이드",          th: "คู่มือ",           href: "/guide",          hrefKo: "/ko/guide",          hrefTh: "/th/guide" },
  { en: "Blog",               ko: "블로그",          th: "บล็อก",            href: "/blog",           hrefKo: "/ko/blog",           hrefTh: "/th/blog" },
  { en: "For Buyers",         ko: "바이어용",        th: "สำหรับผู้ซื้อ",     href: "/for-buyers",     hrefKo: "/ko/for-buyers",     hrefTh: "/th/for-buyers" },
  { en: "Best of",            ko: "테마별 추천",     th: "Best of",          href: "/best", hrefKo: "/best", hrefTh: "/best" },
  { en: "Community",          ko: "커뮤니티",        th: "คอมมูนิตี้",        href: "/community",      hrefKo: "/community",         hrefTh: "/community" },
  { en: "About",              ko: "소개",            th: "เกี่ยวกับ",        href: "/about",          hrefKo: "/ko/about",          hrefTh: "/th/about" },
];

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(window.location.pathname || "/");
  }, []);

  const lang = detectLang(path);
  const hrefForLang = (item: typeof NAV[number]) =>
    lang === "ko" ? item.hrefKo : lang === "th" ? item.hrefTh : item.href;
  const labelForLang = (item: typeof NAV[number]) =>
    lang === "ko" ? item.ko : lang === "th" ? item.th : item.en;

  // ESC + body scroll lock when open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex text-sm gap-4 lg:gap-5 text-[var(--muted)] items-center">
        {NAV.slice(0, 8).map((item) => (
          <a key={item.href} href={hrefForLang(item)} className="hover:text-black whitespace-nowrap">
            {labelForLang(item)}
          </a>
        ))}
        <a
          href={lang === "ko" ? "/ko/for-suppliers" : lang === "th" ? "/th/for-suppliers" : "/for-suppliers"}
          className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold whitespace-nowrap"
        >
          {lang === "ko" ? "공급사 등록 →" : lang === "th" ? "ลงประกาศ →" : "For suppliers →"}
        </a>
        <LangSwitcher path={path} current={lang} />
      </nav>

      {/* Mobile burger */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className="md:hidden p-3 -mr-1 rounded hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[88%] max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <span className="font-bold text-base">
                {lang === "ko" ? "메뉴" : lang === "th" ? "เมนู" : "Menu"}
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-3 -mr-1 rounded hover:bg-gray-100"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-5 py-4">
              <ul className="space-y-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={hrefForLang(item)}
                      onClick={() => setOpen(false)}
                      className="block py-3 px-3 rounded-lg hover:bg-gray-50 font-medium text-base"
                    >
                      {labelForLang(item)}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={lang === "ko" ? "/ko/for-suppliers" : lang === "th" ? "/th/for-suppliers" : "/for-suppliers"}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-3 mt-3 rounded-lg bg-black text-white font-bold text-center"
                  >
                    {lang === "ko" ? "공급사 등록 →" : lang === "th" ? "ลงประกาศ →" : "For suppliers →"}
                  </a>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold mb-3">
                  Language
                </div>
                <div className="flex gap-2">
                  <LangPill path={path} target="en" current={lang} label="English" onClick={() => setOpen(false)} />
                  <LangPill path={path} target="ko" current={lang} label="한국어" onClick={() => setOpen(false)} />
                  <LangPill path={path} target="th" current={lang} label="ภาษาไทย" onClick={() => setOpen(false)} />
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function LangSwitcher({ path, current }: { path: string; current: Lang }) {
  return (
    <div className="flex items-center gap-1 ml-1 text-xs">
      <LangLink path={path} target="en" current={current} label="EN" />
      <span className="text-[var(--muted)]">·</span>
      <LangLink path={path} target="ko" current={current} label="KO" />
      <span className="text-[var(--muted)]">·</span>
      <LangLink path={path} target="th" current={current} label="TH" />
    </div>
  );
}

function LangLink({ path, target, current, label }: { path: string; target: Lang; current: Lang; label: string }) {
  const active = current === target;
  if (active) {
    return <span className="font-bold text-black">{label}</span>;
  }
  return (
    <a href={switchLangHref(path, target)} className="hover:text-black">{label}</a>
  );
}

function LangPill({ path, target, current, label, onClick }: { path: string; target: Lang; current: Lang; label: string; onClick: () => void }) {
  const active = current === target;
  if (active) {
    return (
      <span className="px-3 py-1.5 rounded-full bg-black text-white text-sm font-bold">{label}</span>
    );
  }
  return (
    <a
      href={switchLangHref(path, target)}
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm hover:border-black hover:bg-gray-50"
    >
      {label}
    </a>
  );
}
