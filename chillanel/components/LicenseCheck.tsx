// "Is this shop licensed?" — the one fact on a place page that a Google listing
// cannot also show. Server component, zero JS.
//
// Rendered only when scripts/match_spa_licenses.py matched the place to a row of
// the Department of Health Service Support register. There is deliberately no
// "not found" state: the register lists Thai registered names and most Google
// names are English, so a missing match says nothing about the shop — printing
// "not in the register" beside a real business would be wrong and damaging.
import data from "@/data/spa-licenses.json";
import type { Lang } from "@/lib/site";

interface SpaLicense {
  license_no: string;
  registered_name: string;
  service_type: "spa" | "massage";
  province: string;
}

const file = data as {
  source: string;
  register_as_of: string;
  licenses: Record<string, SpaLicense>;
};

const COPY: Record<Lang, {
  heading: string; lede: string; licenceNo: string; registeredAs: string; type: string;
  spa: string; massage: string; matched: string; lookup: string; asOf: string; caveat: string; seeAll: string;
}> = {
  en: {
    heading: "Licensed by Thailand's Ministry of Public Health",
    lede: "Spas and massage shops in Thailand need a health-establishment licence under the Health Establishment Act B.E. 2559.",
    licenceNo: "Licence number",
    registeredAs: "Registered name",
    type: "Licensed as",
    spa: "Spa",
    massage: "Health massage",
    matched: "Matched by Thai name and province against",
    lookup: "the Department of Health Service Support's open register",
    asOf: "register dated",
    caveat: "A licence can lapse or move after the register date — ask to see it on the wall.",
    seeAll: "All licensed spas & massage shops",
  },
  th: {
    heading: "ได้รับอนุญาตจากกระทรวงสาธารณสุข",
    lede: "สปาและร้านนวดในไทยต้องมีใบอนุญาตประกอบกิจการสถานประกอบการเพื่อสุขภาพ ตาม พ.ร.บ.สถานประกอบการเพื่อสุขภาพ พ.ศ. 2559",
    licenceNo: "เลขที่ใบอนุญาต",
    registeredAs: "ชื่อที่จดทะเบียน",
    type: "ประเภท",
    spa: "สปา",
    massage: "นวดเพื่อสุขภาพ",
    matched: "จับคู่จากชื่อภาษาไทยและจังหวัดกับ",
    lookup: "ข้อมูลเปิดของกรมสนับสนุนบริการสุขภาพ",
    asOf: "ข้อมูล ณ",
    caveat: "ใบอนุญาตอาจหมดอายุหรือเปลี่ยนแปลงหลังวันที่ของข้อมูล — ขอดูใบอนุญาตที่ติดในร้านได้",
    seeAll: "ดูร้านที่ได้รับอนุญาตทั้งหมด",
  },
  ko: {
    heading: "태국 보건부 허가 업소",
    lede: "태국의 스파·마사지 업소는 보건업소법(B.E. 2559)에 따라 보건업소 허가를 받아야 합니다.",
    licenceNo: "허가 번호",
    registeredAs: "등록 상호",
    type: "허가 종류",
    spa: "스파",
    massage: "건강 마사지",
    matched: "태국어 상호와 주(州)로 대조한 출처:",
    lookup: "태국 보건서비스지원국 공개 명단",
    asOf: "명단 기준",
    caveat: "명단 날짜 이후 허가가 만료되거나 바뀌었을 수 있습니다 — 매장에 걸린 허가증을 확인하세요.",
    seeAll: "허가 확인된 업소 전체 보기",
  },
};

export function hasSpaLicense(placeId: string): boolean {
  return placeId in file.licenses;
}

export function spaLicenseFor(placeId: string): SpaLicense | undefined {
  return file.licenses[placeId];
}

export const SPA_LICENSE_SOURCE = { url: file.source, asOf: file.register_as_of };

export default function LicenseCheck({ placeId, lang }: { placeId: string; lang: Lang }) {
  const lic = file.licenses[placeId];
  if (!lic) return null;
  const t = COPY[lang] ?? COPY.en;
  return (
    <section className="rounded-2xl border border-emerald-600/30 bg-emerald-600/[0.06] p-4 sm:p-5 mb-8">
      <h2 className="font-bold text-lg mb-1">✅ {t.heading}</h2>
      <p className="text-xs text-muted mb-3">{t.lede}</p>
      <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-muted">{t.licenceNo}</dt>
        <dd className="font-mono font-semibold">{lic.license_no}</dd>
        <dt className="text-muted">{t.type}</dt>
        <dd>{lic.service_type === "spa" ? t.spa : t.massage}</dd>
        <dt className="text-muted">{t.registeredAs}</dt>
        <dd lang="th">{lic.registered_name}</dd>
      </dl>
      <p className="mt-3 text-[11px] text-muted leading-relaxed">
        {t.matched}{" "}
        <a href={file.source} target="_blank" rel="noopener noreferrer" className="underline">
          {t.lookup}
        </a>{" "}
        · {t.asOf} {file.register_as_of}. {t.caveat}
      </p>
      <a href={`/${lang}/licensed`} className="mt-2 inline-block text-xs font-semibold text-accent hover:underline">
        {t.seeAll} →
      </a>
    </section>
  );
}
