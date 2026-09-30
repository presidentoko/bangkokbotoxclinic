import data from "../data/clinic-licenses.json";

/**
 * Operating licences from the Department of Health Service Support (สบส.).
 *
 * Every private clinic in Thailand holds a licence under the Sanatorium Act
 * B.E. 2541, and the department publishes a lookup at hosp.hss.moph.go.th.
 * bangkok_clinics/hss_registry.py collects it; match_hss.py attaches a record
 * to a directory entry only when the Thai name and the province agree and the
 * result is unambiguous.
 *
 * This is the one thing on a clinic page that is not a restatement of its
 * Google listing — and for dentistry, where unlicensed operators are a
 * recurring news story in Thailand, it is the fact a patient is actually asking
 * about.
 *
 * A clinic with no entry here is NOT unlicensed. The register is searched by
 * registered name, which is often a company name or a spelling that differs
 * from the shopfront; the matcher leaves anything ambiguous alone. Nothing in
 * the UI may say or imply otherwise.
 */

export interface ClinicLicense {
  license_no: string;
  /** Thai Buddhist-era date the licence runs to, as printed by the register. */
  valid_until: string;
  registered_name: string;
}

interface LicenseFile {
  source: string;
  publisher: string;
  retrieved: string;
  licenses: Record<string, ClinicLicense>;
}

const file = data as LicenseFile;

export const LICENSE_SOURCE = {
  url: file.source,
  publisher: file.publisher,
  retrieved: file.retrieved,
};

export function getClinicLicense(clinicId: string): ClinicLicense | null {
  return file.licenses[clinicId] ?? null;
}

export function licensedClinicCount(): number {
  return Object.keys(file.licenses).length;
}

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

/**
 * The register prints "31 ธันวาคม 2575". Parsed so the page can say whether
 * that date has passed *as of the day we read the register* — never as a claim
 * about today, because a licence renewed since would still look expired here.
 */
export function parseThaiDate(s: string): Date | null {
  const m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec((s ?? "").trim());
  if (!m) return null;
  const month = THAI_MONTHS.indexOf(m[2]);
  if (month < 0) return null;
  return new Date(Number(m[3]) - 543, month, Number(m[1]));
}

export type LicenseStanding = "current" | "expired_at_check" | "unknown";

export function licenseStanding(lic: ClinicLicense): LicenseStanding {
  const until = parseThaiDate(lic.valid_until);
  if (!until) return "unknown";
  const checked = new Date(LICENSE_SOURCE.retrieved);
  if (isNaN(checked.getTime())) return "unknown";
  return until >= checked ? "current" : "expired_at_check";
}
