// DBD 등기 사실만 모아 보여주는 표.
//
// 이 사이트가 가진 것 중 다른 디렉토리가 못 가진 게 이거 하나다. Google Maps 를
// 다시 포장한 부분은 누구나 만들 수 있지만, 태국 상무부 DBD DataWarehouse+ 에
// 매칭해 둔 법인명·13자리 등록번호·등록자본금·설립일·TSIC 코드는 없다.
//
// 카테고리 페이지에 붙이는 이유가 두 가지다.
//
//  1) 검색. Search Console 상위 쿼리에 "บจก. โอ อิเล็กทรอนิกส์ อำเภอเมืองปทุมธานี"
//     처럼 태국어 법인명을 그대로 친 것이 41 노출로 잡힌다. 그 이름들은 지금
//     supplier 상세에만 있는데, 그 페이지들이 색인이 안 되고 있다. 크롤이 확실한
//     카테고리 페이지에 올려 두면 색인된 표면에서 잡힌다.
//
//  2) AEO. 답변 엔진은 출처가 분명하고 표 형태로 정리된 사실을 인용한다.
//     "등록자본금 상위 태국 물류회사" 같은 질문에 통째로 대응되는 모양이다.
//
// 카드 그리드와 중복되지 않는다 — 카드는 평점·리뷰·연락처를 보여주고, 여긴
// 등기부 사실만 다룬다.
import type { Supplier } from "@/lib/types";

/** 표를 띄울 최소 회사 수. 이보다 적으면 표라기보다 목록이라 안 띄운다. */
const MIN_ROWS = 5;
const MAX_ROWS = 25;

// CSV 를 거치면서 "52291" 이 float 로 파싱돼 "52291.0" 으로 굳은 행이 있다.
// 표에 소수점 붙은 산업분류 코드가 나가면 그대로 틀린 정보다.
function tsic(code: string | null | undefined): string {
  if (!code) return "—";
  return code.replace(/\.0+$/, "");
}

function baht(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1_000_000_000) return `฿${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  return `฿${(n / 1000).toFixed(0)}K`;
}

export function DbdRegistryTable({
  suppliers,
  label,
  locale = "en",
}: {
  suppliers: Supplier[];
  label: string;
  locale?: "en" | "ko" | "th";
}) {
  const matched = suppliers.filter((s) => s.verified && s.dbd?.reg_no);
  const rows = [...matched]
    .sort((a, b) => (b.dbd?.capital_thb ?? 0) - (a.dbd?.capital_thb ?? 0))
    .slice(0, MAX_ROWS);

  if (rows.length < MIN_ROWS) return null;
  // 표에 보이는 건 상위 MAX_ROWS 개지만, 매칭된 회사 수는 그보다 많을 수 있다.
  // 리드 문장에는 실제 매칭 수를 쓰고 잘라 보여준다는 사실을 함께 밝힌다.
  const shown = rows.length < matched.length ? rows.length : 0;

  const t = {
    en: {
      heading: `${label} — DBD registry records`,
      lede: `${matched.length} of these companies are matched to Thailand's Department of Business Development registry${shown ? `; the ${shown} largest by registered capital are listed here` : ""}. Registered capital, incorporation date and TSIC industry code come straight from the filing — not from a business profile.`,
      company: "Company", legal: "Registered name (Thai)", reg: "Registration no.",
      capital: "Capital", founded: "Founded", tsic: "TSIC", province: "Province",
    },
    ko: {
      heading: `${label} — DBD 등기 기록`,
      lede: `이 중 ${matched.length}개 회사가 태국 상무부(DBD) 기업등록부와 매칭됐습니다${shown ? ` — 등록자본금 상위 ${shown}개를 표시합니다` : ""}. 등록자본금·설립일·TSIC 산업코드는 등기 원문에서 가져온 값입니다.`,
      company: "회사", legal: "법인명 (태국어)", reg: "등록번호",
      capital: "자본금", founded: "설립", tsic: "TSIC", province: "도",
    },
    th: {
      heading: `${label} — ข้อมูลจดทะเบียน DBD`,
      lede: `บริษัท ${matched.length} แห่งตรงกับทะเบียนกรมพัฒนาธุรกิจการค้า (DBD)${shown ? ` แสดง ${shown} อันดับแรกตามทุนจดทะเบียน` : ""} ทุนจดทะเบียน วันจดทะเบียน และรหัส TSIC มาจากข้อมูลจดทะเบียนโดยตรง`,
      company: "บริษัท", legal: "ชื่อจดทะเบียน", reg: "เลขทะเบียน",
      capital: "ทุนจดทะเบียน", founded: "จดทะเบียน", tsic: "TSIC", province: "จังหวัด",
    },
  }[locale];

  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-2">{t.heading}</h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 max-w-3xl">{t.lede}</p>

      {/* 표가 좁은 화면에서 본문을 밀어내지 않도록 자기 안에서만 가로 스크롤 */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-sm border-collapse min-w-[720px]">
          <thead>
            <tr className="text-left border-b-2 border-[var(--border)]">
              <th scope="col" className="py-2 pr-3 font-semibold">{t.company}</th>
              <th scope="col" className="py-2 pr-3 font-semibold">{t.legal}</th>
              <th scope="col" className="py-2 pr-3 font-semibold whitespace-nowrap">{t.reg}</th>
              <th scope="col" className="py-2 pr-3 font-semibold text-right">{t.capital}</th>
              <th scope="col" className="py-2 pr-3 font-semibold text-right">{t.founded}</th>
              <th scope="col" className="py-2 pr-3 font-semibold">{t.tsic}</th>
              <th scope="col" className="py-2 font-semibold">{t.province}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-[var(--border)] hover:bg-[var(--gold-bg)]/30">
                <td className="py-2 pr-3">
                  <a href={`${prefix}/supplier/${s.id}`} className="font-medium hover:text-[var(--gold-deep)] hover:underline">
                    {s.name}
                  </a>
                </td>
                <td className="py-2 pr-3 text-[var(--muted)]">{s.dbd?.legal_name ?? "—"}</td>
                <td className="py-2 pr-3 tabular-nums text-[var(--muted)] whitespace-nowrap">{s.dbd?.reg_no}</td>
                <td className="py-2 pr-3 tabular-nums text-right font-medium">{baht(s.dbd?.capital_thb)}</td>
                <td className="py-2 pr-3 tabular-nums text-right text-[var(--muted)]">
                  {s.dbd?.registered_date?.slice(0, 4) ?? "—"}
                </td>
                <td className="py-2 pr-3 tabular-nums text-[var(--muted)]">{tsic(s.dbd?.tsic_code)}</td>
                <td className="py-2 text-[var(--muted)] whitespace-nowrap">{s.province_en || s.city_label || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
