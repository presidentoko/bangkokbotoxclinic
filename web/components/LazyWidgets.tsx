"use client";
// 모든 layout + home 의 client-only 위젯 lazy import 컬렉션.
// Next.js 16 에서 `dynamic(..., { ssr: false })` 는 server component 에서 직접
// 호출 불가 → 이 client 모듈에서 한 번에 wrap 해서 re-export.
//
// 효과: 위젯들의 HTML 이 server response 에서 빠짐 (hydration 후 client 가 mount).
// 7.7MB 홈 페이지 weight 절감 + below-fold widget 의 JS 도 lazy chunk.

import dynamic from "next/dynamic";

// ── Layout (모든 페이지) ─────────────────────────────────────
export const PersonalizationQuiz = dynamic(() => import("./PersonalizationQuiz"), { ssr: false });
export const SocialProofToasts = dynamic(() => import("./SocialProofToasts"), { ssr: false });
export const LiveChatBubble = dynamic(() => import("./LiveChatBubble"), { ssr: false });
export const CookieConsent = dynamic(() => import("./CookieConsent"), { ssr: false });
export const MobileBottomNav = dynamic(() => import("./MobileBottomNav"), { ssr: false });
export const DealsAlert = dynamic(() => import("./DealsAlert"), { ssr: false });
export const ExitIntentPopup = dynamic(() => import("./ExitIntentPopup"), { ssr: false });
export const WhatsAppCTA = dynamic(() => import("./WhatsAppCTA"), { ssr: false });
export const AccessibilityToolbar = dynamic(() => import("./AccessibilityToolbar"), { ssr: false });
export const ScrollToTopButton = dynamic(() => import("./ScrollToTopButton"), { ssr: false });
export const ReadingProgressBar = dynamic(() => import("./ReadingProgressBar"), { ssr: false });
export const NavSpacer = dynamic(() => import("./NavSpacer").then((m) => m.NavSpacer), { ssr: false });

// ── Home (below-fold + heavy interactive) ────────────────────
export const LiveTicker = dynamic(() => import("./LiveTicker"), { ssr: false });
export const ClinicSpinWheel = dynamic(() => import("./ClinicSpinWheel"), { ssr: false });
export const TrustScoreGame = dynamic(() => import("./TrustScoreGame"), { ssr: false });
export const CostCalculator = dynamic(() => import("./CostCalculator"), { ssr: false });
export const DownloadableGuide = dynamic(() => import("./DownloadableGuide"), { ssr: false });
export const MemberPerksStrip = dynamic(() => import("./MemberPerksStrip"), { ssr: false });
export const ScrollReveal = dynamic(() => import("./ScrollReveal"), { ssr: false });
