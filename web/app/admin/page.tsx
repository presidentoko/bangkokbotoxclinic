export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { loadMasterDb } from "@/lib/data";
import { allPartners } from "@/lib/partners";
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
  const partners = allPartners();

  const sponsoredEnv = {
    editors_pick: process.env.SPONSORED_EDITORS_PICK ?? "",
    recommended: process.env.SPONSORED_RECOMMENDED ?? "",
    featured: process.env.SPONSORED_FEATURED ?? "",
  };

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

  return (
    <AdminView
      db={{
        generated_at: db.generated_at,
        total_clinics: db.total_clinics,
        with_reviews_scraped: db.with_reviews_scraped,
        city_counts: db.city_counts,
      }}
      partners={enriched}
      sponsoredEnv={sponsoredEnv}
      clinicNames={clinicNames}
    />
  );
}
