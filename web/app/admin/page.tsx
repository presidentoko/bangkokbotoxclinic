export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { loadMasterDb } from "@/lib/data";
import { listPartners } from "@/lib/partnerStore";
import { listSponsored } from "@/lib/sponsoredStore";
import AdminView from "@/components/AdminView";
import AdminLogin from "@/components/AdminLogin";

async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const val = jar.get("admin_session")?.value ?? "";
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected || !val) return false;
  try {
    return Buffer.from(val, "base64").toString("utf-8") === expected;
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const db = await loadMasterDb();
  const [partners, sponsored] = await Promise.all([listPartners(), listSponsored()]);

  // Enrich partners with clinic name + rating from db
  const enriched = partners.map((p) => {
    const clinic = db.clinics.find((c) => c.id === p.clinic_id);
    return {
      ...p,
      clinic_name: clinic?.name ?? p.clinic_id,
      clinic_rating: clinic?.rating ?? null,
      clinic_city: clinic?.city_label ?? null,
    };
  });

  // Clinic name map for ads tab search
  const clinicNames = db.clinics.map((c) => ({ id: c.id, name: c.name, city: c.city_label }));

  // Stub clinics — lookup 으로 자동 발견된 신규 (extra_clinics.json 출처).
  // ReviewTab 에서 confidence 낮은 순으로 검토 가능. Watchdog grid 가 풍부화하면 _stub 자동 해제.
  const stubClinics = db.clinics
    .filter((c) => c._stub)
    .map((c) => ({
      id: c.id,
      name: c.name,
      rating: c.rating,
      total_reviews: c.total_reviews,
      maps_url: c.maps_url,
      _match_confidence: c._match_confidence,
      _needs_review: c._needs_review,
      _source: c._source,
    }));

  return (
    <AdminView
      db={{
        generated_at: db.generated_at,
        total_clinics: db.total_clinics,
        with_reviews_scraped: db.with_reviews_scraped,
        city_counts: db.city_counts,
      }}
      partners={enriched}
      sponsored={sponsored}
      clinicNames={clinicNames}
      stubClinics={stubClinics}
    />
  );
}
