import type { Lang, Clinic } from "@/lib/types";
import { SITE } from "@/lib/i18n";
import Link from "next/link";
import LiveTicker from "./LiveTicker";

const SUB: Record<Lang, string> = {
  en: "Six independent data sources verify every hair-transplant clinic in Thailand. Real reviews. Real before-after photos. Real Trust Scores.",
  ko: "태국 모발이식 클리닉 6개 출처 통합 검증. 진짜 후기. 진짜 비포애프터 사진. 진짜 신뢰 점수.",
  th: "เรารวบรวมข้อมูลจาก 6 แหล่งอิสระเพื่อยืนยันคลินิกปลูกผมทุกแห่งในไทย",
  zh: "整合 6 个独立数据源验证泰国每一家植发诊所。真实评价、真实对比照片、真实信任评分。",
  ar: "نتحقق من كل عيادة زراعة شعر في تايلاند عبر 6 مصادر مستقلة.",
};

const CTA_PRIMARY: Record<Lang, string> = {
  en: "Browse all clinics",
  ko: "전체 클리닉 보기",
  th: "ดูคลินิกทั้งหมด",
  zh: "浏览所有诊所",
  ar: "تصفح جميع العيادات",
};

const CTA_SECONDARY: Record<Lang, string> = {
  en: "How we score",
  ko: "신뢰점수 산정 방식",
  th: "วิธีคำนวณคะแนน",
  zh: "评分方法",
  ar: "كيفية التقييم",
};

export default function Hero({
  lang, total, avgTrust, photoClinics,
}: {
  lang: Lang;
  total: number;
  avgTrust: number;
  photoClinics?: Pick<Clinic, "top_photo_url" | "name">[];
}) {
  const photos = (photoClinics || []).filter((c) => c.top_photo_url).slice(0, 5);

  return (
    <section className="relative overflow-hidden rounded-[2rem]">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950" aria-hidden />
      <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
      <div className="blob -top-32 -left-32 h-96 w-96 bg-gold-500/30" aria-hidden />
      <div className="blob -bottom-40 -right-32 h-[28rem] w-[28rem] bg-navy-400/30" aria-hidden style={{ animationDelay: "-5s" }} />

      <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:py-20">
        {/* Left: copy */}
        <div className="text-white">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-300">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              6 sources · {total} verified · trust {avgTrust}/100
            </div>
            <LiveTicker />
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tighter-display sm:text-5xl lg:text-[3.6rem]">
            <span className="block text-white">Thailand's verified</span>
            <span className="block text-gold-300">hair-transplant directory</span>
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-gold-400/80">
            By Thai Facial Clinic <span className="opacity-50 mx-1">·</span> Hair · Botox · Filler · HIFU group
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {SUB[lang]}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#directory" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 shadow-xl shadow-black/20 transition hover:translate-y-[-1px]">
              {CTA_PRIMARY[lang]}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
              {CTA_SECONDARY[lang]}
            </Link>
          </div>

          {/* Source badges + country flags strip */}
          <div className="mt-10 space-y-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-navy-200/80">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Data from</span>
              {["Google", "Bookimed", "Reddit", "Naver", "YouTube", "Pantip"].map((s) => (
                <span key={s} className="font-bold text-white/90">{s}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-navy-200/80">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Visitors from</span>
              <span className="text-base">🇰🇷</span>
              <span className="text-base">🇸🇦</span>
              <span className="text-base">🇦🇪</span>
              <span className="text-base">🇸🇬</span>
              <span className="text-base">🇲🇾</span>
              <span className="text-base">🇭🇰</span>
              <span className="text-base">🇺🇸</span>
              <span className="text-base">🇬🇧</span>
              <span className="text-base">🇦🇺</span>
              <span className="text-base">🇨🇳</span>
              <span className="text-base">🇯🇵</span>
              <span className="text-base">🇩🇪</span>
              <span className="font-bold text-white/90 ml-1">+18 countries</span>
            </div>
          </div>
        </div>

        {/* Right: photo collage + trust ring */}
        <div className="relative hidden lg:block">
          <div className="relative aspect-[5/6] w-full">
            {/* Large back card */}
            {photos[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0].top_photo_url || ""} alt={photos[0].name}
                className="absolute right-4 top-0 h-[60%] w-[70%] rounded-2xl object-cover shadow-premium-lg ring-1 ring-white/10"
                referrerPolicy="no-referrer" loading="eager" />
            )}
            {/* Front mid card */}
            {photos[1] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[1].top_photo_url || ""} alt={photos[1].name}
                className="absolute left-0 top-[35%] h-[45%] w-[55%] rounded-2xl object-cover shadow-premium-lg ring-1 ring-white/10 animate-float"
                style={{ animationDelay: "-2s" }}
                referrerPolicy="no-referrer" loading="eager" />
            )}
            {/* Small thumb */}
            {photos[2] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[2].top_photo_url || ""} alt={photos[2].name}
                className="absolute bottom-0 right-0 h-[30%] w-[40%] rounded-2xl object-cover shadow-premium ring-1 ring-white/10"
                referrerPolicy="no-referrer" loading="eager" />
            )}

            {/* Floating stat card */}
            <div className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-2 shadow-premium backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-mint-100 text-mint-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-mint-700">Verified</div>
                  <div className="text-[11px] font-semibold text-navy-900">{total} clinics</div>
                </div>
              </div>
            </div>

            {/* Floating trust score card */}
            <div className="absolute -bottom-4 left-4 rounded-xl bg-white/95 px-4 py-3 shadow-premium-lg backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gold-700">Average trust</div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold tabular-nums text-navy-900">{avgTrust}</span>
                <span className="text-xs muted">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile photo strip */}
        <div className="-mx-2 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {photos.map((p, i) => p.top_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p.top_photo_url} alt={p.name} loading="lazy" referrerPolicy="no-referrer"
              className="h-24 w-32 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
          ))}
        </div>
      </div>
    </section>
  );
}
