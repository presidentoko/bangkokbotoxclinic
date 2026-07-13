// "Joined by X patients from Y countries" community-size banner.

type Lang = "en" | "ko" | "th";
const COPY: Record<Lang, { patients: string; countries: string; tracked: string; yr: string }> = {
  en: { patients: "Patients routed", countries: "Countries served", tracked: "Tracked outcomes", yr: "yr" },
  ko: { patients: "연결된 환자 수", countries: "서비스 국가 수", tracked: "결과 추적 기간", yr: "년" },
  th: { patients: "ผู้ป่วยที่ส่งต่อ", countries: "ประเทศที่ให้บริการ", tracked: "ติดตามผลลัพธ์", yr: "ปี" },
};

export default function PatientCommunityCount({
  totalPatients = 4_200,
  totalCountries = 24,
  cuYearsTracked = 5,
  lang = "en",
}: {
  totalPatients?: number;
  totalCountries?: number;
  cuYearsTracked?: number;
  lang?: Lang;
}) {
  const t = COPY[lang] ?? COPY.en;
  return (
    <section className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5">
      <div className="grid sm:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-3xl font-black tabular-nums text-violet-900">{totalPatients.toLocaleString()}+</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">{t.patients}</div>
        </div>
        <div className="sm:border-x border-violet-200">
          <div className="text-3xl font-black tabular-nums text-violet-900">{totalCountries}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">{t.countries}</div>
        </div>
        <div>
          <div className="text-3xl font-black tabular-nums text-violet-900">{cuYearsTracked}{t.yr}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mt-1">{t.tracked}</div>
        </div>
      </div>
    </section>
  );
}
