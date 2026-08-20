import type { PublishedPriceItem } from "@/lib/publishedPrices";
import { comparedToMarket, getBenchmark } from "@/lib/publishedPrices";

/**
 * 클리닉이 자기 홈페이지에 공개한 가격표.
 *
 * 리뷰 추정치(ClinicPriceBlock)와 **분리해서** 보여준다. 출처가 다르고 신뢰도도
 * 다르기 때문이다. 여기 값은 클리닉 공식 페이지에서 온 것이라 항목마다 원문
 * 링크를 단다 — 가격 이의가 들어오면 그 링크가 근거가 된다.
 */
export function PublishedPriceTable({
  items,
  domain,
  generatedAt,
}: {
  items: PublishedPriceItem[];
  domain: string | null;
  generatedAt: string;
}) {
  if (items.length === 0) return null;

  const fmt = (n: number) => `฿${n.toLocaleString()}`;
  const sourceUrl = items[0]?.sourceUrl;

  return (
    <section className="bg-[var(--bg-elev,#fff)] border border-[var(--border,#e5e7eb)] rounded-xl p-5">
      <h2 className="text-sm font-semibold mb-1 flex items-center gap-2">
        🏷️ Prices published by this clinic
      </h2>
      <p className="text-xs text-[var(--muted,#6b7280)] mb-3">
        Taken from the clinic&apos;s own price page{domain ? ` (${domain})` : ""}.
        Prices can change — always confirm with the clinic.
      </p>

      {/* 넓은 표는 가로 스크롤로 가둔다 — 360px 화면에서 페이지가 밀리면 안 된다 */}
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-[var(--muted,#6b7280)]">
              <th className="py-2 pr-3 font-medium">Treatment</th>
              <th className="py-2 pr-3 font-medium whitespace-nowrap">Price</th>
              <th className="py-2 font-medium whitespace-nowrap">vs Bangkok</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const cmp = comparedToMarket(it.procedure, it.min);
              const b = getBenchmark(it.procedure);
              return (
                <tr
                  key={it.procedure}
                  className="border-t border-[var(--border,#e5e7eb)] align-top"
                >
                  <td className="py-2 pr-3">
                    <span className="font-medium">{it.label}</span>
                    {it.unit ? (
                      <span className="block text-xs text-[var(--muted,#6b7280)]">
                        {it.unit}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap tabular-nums font-medium">
                    {it.min === it.max ? fmt(it.min) : `${fmt(it.min)} – ${fmt(it.max)}`}
                  </td>
                  <td className="py-2 whitespace-nowrap text-xs">
                    {cmp && b ? (
                      <span
                        className={
                          cmp === "below"
                            ? "text-emerald-700"
                            : cmp === "above"
                              ? "text-amber-700"
                              : "text-[var(--muted,#6b7280)]"
                        }
                        title={`Bangkok median ฿${b.median.toLocaleString()} (${b.clinics} clinics)`}
                      >
                        {cmp === "below"
                          ? "Below average"
                          : cmp === "above"
                            ? "Above average"
                            : "Typical"}
                      </span>
                    ) : (
                      <span className="text-[var(--muted,#6b7280)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--muted,#6b7280)] mt-3">
        Collected {generatedAt}
        {sourceUrl ? (
          <>
            {" · "}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2"
            >
              View clinic price page
            </a>
          </>
        ) : null}
      </p>
    </section>
  );
}
