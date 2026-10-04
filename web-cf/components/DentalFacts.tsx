import Link from "next/link";
import type { Fact, FactLang } from "@/lib/dentalFacts";

// 덴탈 허브 "숫자로 보는 방콕 치과" — lib/dentalFacts.ts 가 계산한 답을 그대로 보여준다.
// FAQPage 스키마에 넣는 문장은 페이지에 보여야 한다(구글 구조화 데이터 지침) —
// 그래서 같은 Fact 배열을 여기서 렌더하고 page 에서 FaqJsonLd 에도 넘긴다.
const T: Record<FactLang, { head: string; sub: string }> = {
  en: { head: "Bangkok dentists by the numbers", sub: "Every figure is computed from Google reviews and listings — nothing here is paid for or estimated." },
  th: { head: "คลินิกทำฟันกรุงเทพฯ ในตัวเลข", sub: "ทุกตัวเลขคำนวณจากรีวิวและข้อมูล Google จริง ไม่มีการจ่ายเงินหรือประมาณเอง" },
};

export function DentalFacts({ facts, lang = "en" }: { facts: Fact[]; lang?: FactLang }) {
  if (!facts.length) return null;
  const t = T[lang];
  const prefix = lang === "en" ? "" : `/${lang}`;
  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-1">{t.head}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.sub}</p>
      <dl className="space-y-5">
        {facts.map((f) => (
          <div key={f.q}>
            <dt className="font-semibold">{f.q}</dt>
            <dd className="mt-1 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
              {f.a}
              {f.names && f.names.length > 0 && (
                <span className="block mt-1 text-sm">
                  {f.names.map((n, i) => (
                    <span key={n.id}>
                      {i > 0 && " · "}
                      <Link href={`${prefix}/clinic/${n.id}`} className="text-blue-700 dark:text-blue-400 hover:underline">{n.name}</Link>
                    </span>
                  ))}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
