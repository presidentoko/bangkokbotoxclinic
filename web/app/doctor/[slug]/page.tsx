import { notFound } from "next/navigation";
import { loadMasterDb, getAllDoctors, getDoctorByCompositeSlug, makeCompositeDoctorSlug } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { LineButton } from "@/components/LineButton";
import { BookingForm } from "@/components/BookingForm";
import { getSiteUrl, getSiteConfig, applySiteFilter, resolveOwnerUrl, FOCUS_VALID } from "@/lib/site";
import type { Metadata } from "next";

// JSON-LD must use the deployed origin, not the botox-site default — otherwise the
// dental deploy emits aesthetic-site URLs to Google.
const SITE = getSiteUrl();

// 전량 프리렌더 + dynamicParams=false — clinic/[id]와 동일 이유(Hobby ISR
// Writes 200K/월 한도를 봇의 무작위 slug 크롤이 소진, 2026-07-10 감사).
// 30일로 연장 — 데이터는 배포 시에만 바뀜 (2026-07-17 감사).
export const revalidate = 2592000;
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  // 이 사이트 소관 클리닉의 의사만 pre-build — 다른 버티컬(예: 덴탈 사이트에
  // 보톡스 의사) 대량 pre-render 후 noindex 처리하는 낭비 방지 (clinic/[id]와
  // 동일 이슈, 2026-07-10 감사).
  const docs = getAllDoctors(db.clinics).filter((d) => applySiteFilter([d.clinic], cfg).length > 0);
  return docs.map((d) => ({ slug: d.composite_slug! }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const db = await loadMasterDb();
  const d = getDoctorByCompositeSlug(db.clinics, slug);
  if (!d) return { title: "Doctor not found" };

  const c = d.clinic;
  const specialty = c.categories.map((cat) => CATEGORY_LABELS[cat] ?? cat).slice(0, 3).join(", ");
  const langs = languageList(d.language_count);
  const title = `Dr. ${d.name} at ${c.name} — Reviews & Trust`;
  const description = `Dr. ${d.name}: ${d.mentions} patient mentions, ★${d.rating_avg.toFixed(1)} average. ${specialty || "Aesthetic medicine"} at ${c.name}${c.district ? ", " + c.district : ""}. Patients praise in ${langs}.`;

  // clinic/[id] 와 동일 가드 — 이 사이트 소관이 아닌 의사(예: 덴탈 도메인에 뜬
  // 보톡스 전용 의사)면 진짜 소유 도메인을 절대 캐노니컬로 지정 + noindex.
  const cfg = getSiteConfig();
  const inSite = applySiteFilter([c], cfg).length > 0;
  const ownerUrl = !inSite ? resolveOwnerUrl(c.categories) : null;
  const canonical = ownerUrl ? `${ownerUrl}/doctor/${slug}` : `/doctor/${slug}`;

  return {
    title,
    description,
    ...(!inSite && { robots: { index: false, follow: true } }),
    alternates: { canonical },
    openGraph: { title, description, url: `/doctor/${slug}`, type: "profile" },
  };
}

function languageList(lc: Record<string, number>): string {
  const labels: Record<string, string> = { th: "Thai", en: "English", ko: "Korean", ja: "Japanese", other: "" };
  const entries = Object.entries(lc).filter(([k, v]) => v > 0 && k !== "other");
  entries.sort((a, b) => b[1] - a[1]);
  return entries.map(([k]) => labels[k] || k).slice(0, 3).join(" + ") || "multiple languages";
}

export default async function DoctorPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const d = getDoctorByCompositeSlug(db.clinics, slug);
  if (!d) notFound();

  const c = d.clinic;
  const specialty = c.categories.map((cat) => CATEGORY_LABELS[cat] ?? cat).slice(0, 3).join(", ") || "Aesthetic medicine";
  const langs = languageList(d.language_count);
  const langSegments = Object.entries(d.language_count).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);

  // 같은 클리닉 다른 의사들
  const colleagues = (c.doctor_stats ?? []).filter((x) => x.slug !== d.slug).slice(0, 5);

  // 겸업 클리닉의 focus 밖 카테고리는 /c/{cat} 링크가 404 나므로 제외 (2026-07-17 감사).
  const focusValidCats = FOCUS_VALID[cfg.focus];
  const focusCategories = focusValidCats
    ? c.categories.filter((cat) => focusValidCats.has(cat))
    : c.categories;

  // 같은 district + category 다른 의사들 (cross-link) — 이 사이트 소관만,
  // 아니면 doctor/[slug]가 prerender 안 해서 404 (2026-07-17 감사).
  const peerDoctors = getAllDoctors(applySiteFilter(db.clinics, cfg))
    .filter((x) =>
      x.clinic.id !== c.id &&
      x.mentions >= 3 &&
      (x.clinic.district === c.district || x.clinic.categories.some((cat) => c.categories.includes(cat)))
    )
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/doctors" className="hover:text-[var(--fg)]">Doctors</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">Dr. {d.name}</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
              Specialist physician · {specialty}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Dr. {d.name}
            </h1>
            <p className="text-[var(--muted)] flex items-center gap-2 flex-wrap">
              <span>at</span>
              <a href={`/clinic/${c.id}`} className="font-bold text-[var(--accent)] hover:underline">
                {c.name}
              </a>
              {c.district && (
                <>
                  <span>·</span>
                  <span>📍 {c.district}</span>
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yellow-50 text-yellow-900 px-4 py-2 rounded-lg text-2xl font-bold">
              ★ {d.rating_avg.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {d.mentions} patient mentions
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
            🌍 {langs}
          </span>
          {focusCategories.slice(0, 4).map((cat) => (
            <a key={cat} href={`/c/${cat}`} className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full hover:bg-purple-100">
              {CATEGORY_LABELS[cat] ?? cat}
            </a>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor stats */}
          <section className="bg-white border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-lg font-bold mb-3">Practice signals</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <Stat label="Mentions" value={String(d.mentions)} sub="in patient reviews" />
              <Stat label="Avg rating" value={`★${d.rating_avg.toFixed(2)}`} sub="from naming reviewers" />
              <Stat label="Primary language" value={d.primary_lang.toUpperCase()} sub={`${d.language_count[d.primary_lang as keyof typeof d.language_count] || 0} reviews`} />
            </div>
          </section>

          {/* Procedures performed */}
          {(d.procedures ?? []).length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h2 className="text-lg font-bold mb-1">What Dr. {d.name} is known for</h2>
              <p className="text-xs text-[var(--muted)] mb-4">
                Procedures mentioned alongside Dr. {d.name} in patient reviews.
              </p>
              <div className="space-y-2">
                {(() => {
                  const procs = d.procedures!;
                  const max = Math.max(1, ...procs.map((p) => p.review_count));
                  return procs.map((p) => {
                    const pct = (p.review_count / max) * 100;
                    const label = CATEGORY_LABELS[p.service] ?? p.service;
                    return (
                      <div key={p.service}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{label}</span>
                          <span className="tabular-nums">
                            <strong>{p.review_count}</strong> reviews
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>
          )}

          {/* Experience signals */}
          {(d.experience_signals ?? []).length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h2 className="text-lg font-bold mb-1">Practice background signals</h2>
              <p className="text-xs text-[var(--muted)] mb-3">
                Credential + training mentions extracted from patient reviews.
              </p>
              <div className="flex flex-wrap gap-2">
                {(d.experience_signals ?? []).map((sig) => (
                  <span
                    key={sig}
                    className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium capitalize"
                  >
                    ✓ {sig}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[var(--muted)] mt-3 italic">
                These phrases were mentioned by 2+ patients. Treat as patient-reported signals, not verified credentials.
              </p>
            </section>
          )}

          {/* Patient language breakdown */}
          <section className="bg-white border border-[var(--border)] rounded-xl p-5">
            <h2 className="text-lg font-bold mb-3">Patients who named Dr. {d.name}</h2>
            <div className="space-y-2">
              {langSegments.map(([lang, count]) => {
                const pct = (count / d.mentions) * 100;
                const colors: Record<string, string> = { th: "#dc2626", en: "#2563eb", ko: "#7c3aed", ja: "#ec4899", other: "#737373" };
                const labels: Record<string, string> = { th: "Thai patients", en: "English-speaking", ko: "Korean patients", ja: "Japanese patients", other: "Other" };
                return (
                  <div key={lang}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{labels[lang] || lang}</span>
                      <span className="tabular-nums"><strong>{count}</strong> · {pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[lang] || "#737373" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sample reviews mentioning this doctor */}
          {d.samples.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h2 className="text-lg font-bold mb-3">What patients say about Dr. {d.name}</h2>
              <div className="space-y-3">
                {d.samples.map((s, i) => (
                  <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-gray-50 px-4 py-3 rounded-r">
                    <p className="text-sm leading-relaxed">{s.text}</p>
                    <footer className="mt-2 text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="text-yellow-700">★ {s.rating}</span>
                      <span>·</span>
                      <span className="uppercase">{s.lang}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* Colleagues at same clinic */}
          {colleagues.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h2 className="text-lg font-bold mb-1">Other doctors at {c.name}</h2>
              <p className="text-xs text-[var(--muted)] mb-3">Same clinic, different specialists.</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {colleagues.map((col) => (
                  <a
                    key={col.slug}
                    href={`/doctor/${makeCompositeDoctorSlug(col, c)}`}
                    className="block px-3 py-2 rounded-lg border border-[var(--border)] hover:border-black hover:shadow-sm transition"
                  >
                    <div className="font-medium text-sm truncate">Dr. {col.name}</div>
                    <div className="text-xs text-[var(--muted)] tabular-nums">
                      ★ {col.rating_avg.toFixed(1)} · {col.mentions} mentions
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-xl p-4">
            <LineButton clinicName={c.name} phone={c.phone} size="lg" />
            <p className="text-[11px] text-[var(--muted)] mt-2 text-center">
              Specifically request <strong>Dr. {d.name}</strong> when booking.
            </p>
          </div>

          <BookingForm clinicId={c.id} clinicName={c.name} />

          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            {d.clinic_doctor_url && (
              <a
                href={d.clinic_doctor_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-emerald-700 text-sm"
              >
                → Official bio at {c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name}
              </a>
            )}
            <a
              href={`/clinic/${c.id}`}
              className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              View {c.name} →
            </a>
            <a
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
            >
              Open in Google Maps
            </a>
          </div>

          {peerDoctors.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar doctors nearby
              </h3>
              <div className="space-y-2">
                {peerDoctors.map((p) => (
                  <a key={p.composite_slug} href={`/doctor/${p.composite_slug}`} className="block group">
                    <div className="font-medium text-sm group-hover:text-[var(--accent)] truncate transition">
                      Dr. {p.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] truncate">
                      {p.clinic.name} · ★ {p.rating_avg.toFixed(1)} · {p.mentions}m
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* schema.org Physician + Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Physician",
          name: `Dr. ${d.name}`,
          memberOf: {
            "@type": "MedicalBusiness",
            name: c.name,
            address: c.address || undefined,
            url: `${SITE}/clinic/${c.id}`,
          },
          medicalSpecialty: c.categories.map((cat) => CATEGORY_LABELS[cat] ?? cat),
          aggregateRating: d.mentions >= 3 ? {
            "@type": "AggregateRating",
            ratingValue: d.rating_avg,
            reviewCount: d.mentions,
          } : undefined,
          knowsLanguage: Object.entries(d.language_count)
            .filter(([k, v]) => v > 0 && k !== "other")
            .map(([k]) => ({ th: "Thai", en: "English", ko: "Korean", ja: "Japanese" }[k as "th" | "en" | "ko" | "ja"] || k)),
          url: `${SITE}/doctor/${d.composite_slug}`,
          // d.name 은 구글 리뷰 원문에서 추출된 값(누구나 작성 가능) — "<" 이스케이프 필수.
        }).replace(/</g, "\\u003c") }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
        { name: `Dr. ${d.name}`, url: `/doctor/${d.composite_slug}` },
      ]} />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{label}</div>
      <div className="text-xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] text-[var(--muted)] mt-1">{sub}</div>
    </div>
  );
}
