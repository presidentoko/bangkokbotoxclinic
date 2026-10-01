import { getClinicLicense, licenseStanding, LICENSE_SOURCE } from "@/lib/licenses";

/**
 * "Is this clinic licensed, and until when?"
 *
 * Rendered only when the clinic matched a record in the Department of Health
 * Service Support register. There is deliberately no "not found" state: the
 * register is searched by registered name, which is frequently a company name
 * or a different spelling, so a missing match says nothing about the clinic —
 * and printing "not in the register" beside a real business would be both wrong
 * and damaging. See lib/licenses.ts.
 *
 * The expiry is shown as read on a stated date, not as a claim about today. A
 * licence renewed since our snapshot would still look expired here, so the
 * wording points at the official lookup rather than drawing the conclusion.
 */

const COPY = {
  en: {
    heading: "Listed in the Ministry of Public Health clinic register",
    lede: "Every private clinic in Thailand operates under a licence issued under the Sanatorium Act B.E. 2541.",
    licenceNo: "Licence number",
    validUntil: "Valid until",
    registeredAs: "Registered name",
    current: "Current when we checked",
    expired: "This licence had passed its expiry date when we read the register — ask the clinic, or search the official lookup, before assuming it lapsed.",
    matched: "Matched by Thai name and province against",
    lookup: "the department's public lookup",
    checked: "read on",
    report: "Something wrong?",
    what: "What a clinic must show you",
  },
  th: {
    heading: "พบในทะเบียนสถานพยาบาลของกระทรวงสาธารณสุข",
    lede: "คลินิกเอกชนทุกแห่งในไทยต้องมีใบอนุญาตประกอบกิจการสถานพยาบาลตาม พ.ร.บ.สถานพยาบาล พ.ศ. 2541",
    licenceNo: "เลขที่ใบอนุญาต",
    validUntil: "ใช้ได้ถึงวันที่",
    registeredAs: "ชื่อที่จดทะเบียน",
    current: "ยังไม่หมดอายุ ณ วันที่เราตรวจสอบ",
    expired: "วันหมดอายุผ่านไปแล้ว ณ วันที่เราอ่านทะเบียน — อาจต่ออายุแล้วก็ได้ ควรสอบถามคลินิกหรือค้นจากระบบของกรมฯ ก่อนสรุป",
    matched: "จับคู่จากชื่อภาษาไทยและจังหวัดกับ",
    lookup: "ระบบตรวจสอบสถานพยาบาลของกรมสนับสนุนบริการสุขภาพ",
    checked: "ดึงข้อมูลเมื่อ",
    report: "ข้อมูลไม่ตรง?",
    what: "สิ่งที่คลินิกต้องแสดงตามกฎหมาย",
  },
};

export function LicenseCheck({ clinicId, lang = "en" }: { clinicId: string; lang?: "en" | "th" | "ko" }) {
  const lic = getClinicLicense(clinicId);
  if (!lic) return null;
  const t = COPY[lang === "th" ? "th" : "en"];
  const standing = licenseStanding(lic);

  return (
    <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <h2 className="text-lg font-bold text-emerald-900 mb-1">✅ {t.heading}</h2>
      <p className="text-xs text-emerald-800 mb-4">{t.lede}</p>

      <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-[var(--muted)]">{t.licenceNo}</dt>
        <dd className="font-mono font-semibold">{lic.license_no}</dd>
        <dt className="text-[var(--muted)]">{t.validUntil}</dt>
        <dd className={standing === "expired_at_check" ? "font-semibold text-amber-700" : "font-semibold"}>
          {lic.valid_until}
          {standing === "current" && <span className="ml-2 text-xs font-normal text-emerald-700">· {t.current}</span>}
        </dd>
        <dt className="text-[var(--muted)]">{t.registeredAs}</dt>
        <dd>{lic.registered_name}</dd>
      </dl>

      {standing === "expired_at_check" && (
        <p className="mt-3 text-sm text-amber-800 leading-relaxed">⚠️ {t.expired}</p>
      )}

      <p className="mt-4 text-[11px] text-[var(--muted)] leading-relaxed">
        {t.matched}{" "}
        <a href={LICENSE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
          {t.lookup}
        </a>{" "}
        · {t.checked} {LICENSE_SOURCE.retrieved} ·{" "}
        <a href="/verify" className="underline">{t.what}</a> ·{" "}
        <a href="/corrections" className="underline">{t.report}</a>
      </p>
    </section>
  );
}
