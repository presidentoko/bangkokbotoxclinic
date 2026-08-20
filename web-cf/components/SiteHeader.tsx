"use client";
// URL 기반 언어 인식 헤더. /ko/* → 한국어, /th/* → 태국어, 그 외 → 영어.
// 모바일: 햄버거 메뉴. 데스크탑: 풀 네비.

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

type SiteFocus = "all" | "botox" | "filler" | "hifu" | "facial" | "laser" | "dental" | "hair";

type Lang = "en" | "ko" | "th";

const STRINGS: Record<Lang, {
  topClinics: string;
  byService: string;
  bestOf: string;
  about: string;
  forClinics: string;
  current_lang_label: string;
}> = {
  en: {
    topClinics: "Top Clinics",
    byService: "By Service",
    bestOf: "Best of",
    about: "About",
    forClinics: "For clinics →",
    current_lang_label: "EN",
  },
  ko: {
    topClinics: "추천 클리닉",
    byService: "시술별",
    bestOf: "베스트",
    about: "소개",
    forClinics: "클리닉 등록 →",
    current_lang_label: "한국어",
  },
  th: {
    topClinics: "คลินิกแนะนำ",
    byService: "ตามบริการ",
    bestOf: "ดีที่สุด",
    about: "เกี่ยวกับเรา",
    forClinics: "สำหรับคลินิก →",
    current_lang_label: "ไทย",
  },
};

function detectLang(pathname: string): Lang {
  if (pathname.startsWith("/ko")) return "ko";
  if (pathname.startsWith("/th")) return "th";
  return "en";
}

// 실제로 로케일 변형이 존재하는 라우트만 나열 — 이 목록에 없는 페이지에서
// prefix만 바꾸면 404 (예: /th/d/pathum-wan, /th/best/highly-recommended는
// 존재하지 않음). 2026-07-31 감사 전에는 홈 아닌 모든 페이지가 무조건 해당
// 언어의 홈으로 튕겨서, 태국어로 클리닉 상세를 읽던 사용자가 클리닉 카드를
// 누르는 순간 실수로라도 다른 언어 버전에 못 머무르는 구조였음.
const LOCALIZED_ROUTE_PATTERNS: { pattern: RegExp; langs: Lang[] }[] = [
  { pattern: /^\/clinic\/[^/]+\/?$/, langs: ["th", "ko"] },
  // 2026-08-20: /th/c/[service] 는 2026-08-06 에 생겼는데 이 목록이 안 따라와서,
  // 태국어로 보던 사용자가 시술 허브에서 언어를 바꾸면 계속 홈으로 튕겼다.
  { pattern: /^\/c\/[^/]+\/?$/, langs: ["th", "ko"] },
];

/** 같은 페이지의 다른 언어 버전 URL. 실제로 존재하는 로케일 변형만 경로를
 * 유지하고, 없는 조합은 안전하게 그 언어의 홈으로 보낸다. */
function langSwitchHref(pathname: string, target: Lang): string {
  const stripped = pathname.replace(/^\/(ko|th)(?=\/|$)/, "") || "/";
  if (target === "en") return stripped;
  if (stripped === "/") return `/${target}`;
  const hasVariant = LOCALIZED_ROUTE_PATTERNS.some(
    ({ pattern, langs }) => pattern.test(stripped) && langs.includes(target)
  );
  return hasVariant ? `/${target}${stripped}` : `/${target}`;
}

export function SiteHeader({ focus, accent }: { focus: SiteFocus; accent: string }) {
  const pathname = usePathname() || "/";
  const lang = detectLang(pathname);
  const t = STRINGS[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  // 카테고리 메뉴 (focus="all" 일 때만)
  const categoryLinks = focus === "all"
    ? [
        { label: "Botox", href: "/c/botox" },
        { label: "Filler", href: "/c/filler" },
        { label: "HIFU", href: "/c/hifu" },
        { label: "Facial", href: "/c/facial" },
        { label: "Laser", href: "/c/laser" },
      ]
    : [];

  const focusedLinks = focus !== "all"
    ? [
        { label: t.topClinics, href: "/" },
        { label: t.byService, href: `/c/${focus}` },
      ]
    : [];

  return (
    <header className="border-b border-[var(--border)] bg-white sticky top-0 z-30 backdrop-blur-sm bg-white/95">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href={lang === "en" ? "/" : `/${lang}`} className="flex items-center hover:opacity-80 transition shrink-0">
          <Logo accent={accent} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex text-sm gap-4 text-[var(--muted)] items-center">
          {categoryLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-black">{l.label}</a>
          ))}
          {focusedLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-black">{l.label}</a>
          ))}
          <a href="/best/genuine-brand" className="hover:text-black">{t.bestOf}</a>
          <a href="/about" className="hover:text-black">{t.about}</a>
          <a href="/for-clinics" className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold whitespace-nowrap">
            {t.forClinics}
          </a>
          <LangSwitch lang={lang} pathname={pathname} />
        </nav>

        {/* Mobile right side: lang + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {/* inline-flex items-center — globals.css의 min-height:44px 규칙은 인라인
              박스엔 안 먹어서(이 헤더의 유일한 모바일 CTA인데도) 실제 높이가
              ~25px였음. flex로 블록화해야 규칙이 실제로 적용된다 (2026-07-28 감사). */}
          <a href="/for-clinics" className="inline-flex items-center px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-bold whitespace-nowrap">
            {t.forClinics}
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            <Hamburger open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 space-y-1 text-sm">
            {categoryLinks.map((l) => (
              <a key={l.href} href={l.href} className="block py-2 hover:text-[var(--accent)]" onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            {focusedLinks.map((l) => (
              <a key={l.href} href={l.href} className="block py-2 hover:text-[var(--accent)]" onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
            <a href="/best/genuine-brand" className="block py-2 hover:text-[var(--accent)]" onClick={() => setMobileOpen(false)}>{t.bestOf}</a>
            <a href="/about" className="block py-2 hover:text-[var(--accent)]" onClick={() => setMobileOpen(false)}>{t.about}</a>
            <div className="border-t border-[var(--border)] pt-3 mt-3">
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2">Language</div>
              <div className="flex gap-2">
                {(["en", "th", "ko"] as Lang[]).map((target) => (
                  <a
                    key={target}
                    href={langSwitchHref(pathname, target)}
                    onClick={() => setMobileOpen(false)}
                    className={`flex-1 text-center py-2 rounded-lg text-xs font-bold border transition ${
                      lang === target
                        ? "bg-black text-white border-black"
                        : "bg-white text-[var(--fg)] border-[var(--border)] hover:border-black"
                    }`}
                  >
                    {STRINGS[target].current_lang_label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LangSwitch({ lang, pathname }: { lang: Lang; pathname: string }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      {(["en", "th", "ko"] as Lang[]).map((target, i) => (
        <span key={target} className="flex items-center gap-1">
          <a
            href={langSwitchHref(pathname, target)}
            className={`px-1.5 py-0.5 rounded transition ${
              lang === target
                ? "bg-black text-white font-bold"
                : "text-[var(--muted)] hover:text-black"
            }`}
          >
            {target.toUpperCase()}
          </a>
          {i < 2 && <span className="text-[var(--muted)]" aria-hidden>·</span>}
        </span>
      ))}
    </div>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-[var(--fg)]">
      {open ? (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </>
      )}
    </svg>
  );
}
