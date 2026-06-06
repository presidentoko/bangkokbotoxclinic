import type { Clinic, Lang } from "@/lib/types";
import ClinicCard from "./ClinicCard";
import { isPaidPartner } from "@/lib/partnerCheck";
import Link from "next/link";

const TITLE: Record<Lang, string> = {
  en: "Top-trusted this month",
  ko: "이달의 신뢰 클리닉",
  th: "อันดับสูงสุดประจำเดือนนี้",
  zh: "本月最受信任",
  ar: "الأكثر ثقة هذا الشهر",
};

const SUB: Record<Lang, string> = {
  en: "Ranked by Trust Score · partner clinics highlighted",
  ko: "신뢰 점수 순 · 파트너 클리닉 강조",
  th: "จัดอันดับตามคะแนนความน่าเชื่อถือ",
  zh: "按信任分数排序",
  ar: "مرتبة حسب درجة الثقة",
};

export default function FeaturedClinics({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  // Show partners first, then top trust scores
  const partners = clinics.filter(isPaidPartner);
  const others = clinics.filter((c) => !isPaidPartner(c) && c.is_hair_relevant);
  const featured = [...partners, ...others].slice(0, 6);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="eyebrow">Featured</div>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">{TITLE[lang]}</h2>
          <p className="mt-1 text-sm muted">{SUB[lang]}</p>
        </div>
        <Link href="#directory" className="text-sm font-bold text-navy-700 dark:text-gold-400 hover:underline">
          View all 230 clinics →
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
      </div>
    </section>
  );
}
