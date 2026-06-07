// web-golf/app/price-compare/page.tsx
import { loadMasterDb, getCourseById } from "@/lib/data";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thailand Golf Price Compare — 찐 총액 그린피+캐디+카트",
  description:
    "방콕 골프장 그린피+캐디피+카트비 찐 총액 비교. 에이전시 마크업 빼고 진짜 내 지갑에서 나가는 금액 기준 정렬.",
  alternates: { canonical: "/price-compare" },
};

export default async function PriceComparePage() {
  const [db, matrix] = await Promise.all([loadMasterDb(), loadPriceMatrix()]);
  const rows = toPriceRows(matrix);

  const sorted = [...rows].sort((a, b) => {
    const ta = a.weekend_morning_total ?? a.weekday_morning_total ?? Infinity;
    const tb = b.weekend_morning_total ?? b.weekday_morning_total ?? Infinity;
    return ta - tb;
  });

  const hasPrices = sorted.filter((r) => r.weekend_morning_total !== null);
  const noPrices = sorted.filter((r) => r.weekend_morning_total === null);
  const scraped_at = matrix[0]?.scraped_at
    ? new Date(matrix[0].scraped_at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Price Compare</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          찐 총액 가격 비교
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          그린피 + 캐디피 + 카트비 합산 기준 정렬. 에이전시 광고 가격 아닌 최종 결제 금액.
        </p>
        {scraped_at && (
          <p className="text-xs text-[var(--muted)] mt-2">마지막 업데이트: {scraped_at}</p>
        )}
      </header>

      {hasPrices.length === 0 && (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          가격 데이터 수집 중입니다. 스크래퍼 첫 실행 후 표시됩니다.
        </div>
      )}

      {hasPrices.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-emerald-50 text-left">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">코스</th>
                <th className="px-4 py-3 font-bold text-right">그린피</th>
                <th className="px-4 py-3 font-bold text-right">캐디</th>
                <th className="px-4 py-3 font-bold text-right">카트</th>
                <th className="px-4 py-3 font-bold text-right bg-emerald-100">찐 총액 ฿</th>
                <th className="px-4 py-3 font-bold">에이전시</th>
              </tr>
            </thead>
            <tbody>
              {hasPrices.map((row, i) => {
                const course = getCourseById(db.restaurants, row.course_id);
                const slot = row.weekend_morning_slot ?? row.weekday_morning_slot!;
                const total = row.weekend_morning_total ?? row.weekday_morning_total!;
                return (
                  <tr key={row.course_id} className="border-t border-[var(--border)] hover:bg-emerald-50/30 transition">
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a href={`/course/${row.course_id}`} className="font-medium hover:text-emerald-700 hover:underline">
                        {course?.name ?? row.course_id}
                      </a>
                      <div className="text-xs text-[var(--muted)]">{course?.district || course?.city_label}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.greenfee.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.caddy.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{slot.cart.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-black text-emerald-700 bg-emerald-50">
                      {total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={row.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 hover:underline font-medium"
                      >
                        {row.source_agency} →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {noPrices.length > 0 && (
        <div className="mt-6 text-sm text-[var(--muted)]">
          가격 미확인: {noPrices.length}개 코스
        </div>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Price Compare", url: "/price-compare" },
      ]} />
    </div>
  );
}
