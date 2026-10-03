// 공개된 전화번호·웹사이트가 없는 공급사 페이지에 띄우는 안내.
//
// 왜 (2026-10-03): 그런 공급사가 1,664곳이다. 바이어가 페이지에 도착해도 할 수
// 있는 게 없어서 그냥 떠난다.
//
// 지우거나 noindex 하는 쪽은 택하지 않았다. 1,664곳 중 758곳은 DBD 검증을 거쳐
// 법인명·등기번호·자본금·TSIC 를 갖고 있다 — 구글 지도에 없는 데이터이고 우리
// 등급 체계의 최상위다. 154곳은 이미 Search Console 에 노출 기록이 있다.
// 2026-09-16 에 얇아 보이는 페이지를 noindex 했다가 클릭의 17%를 잃었다.
//
// 그래서 색인이 아니라 페이지를 고친다. 연락처가 없는 페이지는 오히려 우리
// 소개 서비스가 유일한 가치를 갖는 자리다 — 다른 페이지에서는 바이어가 번호를
// 보고 직접 걸면 되지만, 여기서는 그럴 수가 없다.
import type { Supplier } from "@/lib/types";

export function NoContactNotice({ r }: { r: Supplier }) {
  const dbd = r.dbd;
  const founded = dbd?.registered_date?.slice(0, 4);
  const capitalM =
    dbd?.capital_thb && dbd.capital_thb >= 1_000_000
      ? `฿${(dbd.capital_thb / 1_000_000).toFixed(dbd.capital_thb >= 10_000_000 ? 0 : 1)}M`
      : dbd?.capital_thb
        ? `฿${dbd.capital_thb.toLocaleString()}`
        : null;

  return (
    <section className="mb-8 rounded-xl border border-stone-300 bg-stone-50 p-5">
      <h2 className="font-bold text-lg mb-2">No published phone or website</h2>
      <p className="text-sm text-stone-700 leading-relaxed mb-4">
        This factory has no phone number or website on its public business profile, so there is
        nothing for us to pass on and no number for you to call. That is a gap in the public record,
        not a judgement about the company.
      </p>

      {r.verified && dbd?.reg_no && (
        <div className="mb-4 rounded-lg border border-[var(--gold-light)] bg-white p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--gold-deep)] mb-2">
            What we can confirm instead
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            The company is registered with Thailand&apos;s Department of Business Development
            {dbd.legal_name ? <> as <strong>{dbd.legal_name}</strong></> : null}, registration{" "}
            <span className="font-mono-data">{dbd.reg_no}</span>
            {founded ? <>, since {founded}</> : null}
            {capitalM ? <>, registered capital {capitalM}</> : null}. That record is public and
            checkable — for a first order it tells you more than a phone number does.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <a
          href="#rfq"
          className="px-4 py-2 rounded-lg bg-[var(--gold-deep)] text-white text-sm font-bold hover:opacity-90 transition"
        >
          Ask us to reach them →
        </a>
        {r.maps_url && (
          <a
            href={r.maps_url}
            target="_blank"
            rel="noopener nofollow"
            className="px-4 py-2 rounded-lg border border-stone-300 bg-white text-sm font-bold hover:border-stone-600 transition"
          >
            Check Google Maps
          </a>
        )}
      </div>
      <p className="text-xs text-stone-500 mt-3 leading-relaxed">
        We contact the factory on your behalf, in Thai, and send you what comes back. Free for you —
        if an order closes, the factory pays our fee. The Maps link is there because a profile can
        gain a phone number after our last refresh.
      </p>
    </section>
  );
}
