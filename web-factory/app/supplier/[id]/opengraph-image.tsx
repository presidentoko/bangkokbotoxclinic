import { ImageResponse } from "next/og";
import { loadMasterDb, getSupplierById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { computeTrustScore } from "@/lib/trustScore";

export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Thai Supply Hub — verified B2B supplier profile";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return db.suppliers.map((r) => ({ id: r.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getSupplierById(db.suppliers, id);

  const name = r?.name ?? "Thai Supplier";
  const loc = (r && [r.district, r.city_label].filter(Boolean).join(", ")) || "Thailand";
  const primaryCat = r?.categories?.[0];
  const catLabel = primaryCat ? CATEGORY_LABELS[primaryCat] ?? primaryCat : "B2B Supplier";
  const catIcon = (primaryCat && CATEGORY_ICONS[primaryCat]) || "🏭";
  const trust = r ? computeTrustScore(r) : null;
  const verified = !!r?.verified;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex",
          background: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Left content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "64px 56px",
            borderLeft: "10px solid #0f766e",
          }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {verified && (
              <div
                style={{
                  background: "#ecfdf5", color: "#065f46",
                  fontSize: 20, fontWeight: 800, letterSpacing: 1,
                  padding: "6px 18px", borderRadius: 100,
                  border: "1.5px solid #6ee7b7",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                ✓ DBD-VERIFIED
              </div>
            )}
            <div
              style={{
                background: "#f0fdfa", color: "#0f766e",
                fontSize: 20, fontWeight: 800,
                padding: "6px 18px", borderRadius: 100,
                border: "1.5px solid #99f6e4",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {catIcon} {catLabel}
            </div>
          </div>

          <div
            style={{
              fontSize: name.length > 40 ? 46 : 58,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: "#0a0a0a",
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {name}
          </div>

          <div style={{ display: "flex", fontSize: 26, color: "#525252", marginBottom: 32 }}>
            📍 {loc}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#737373",
              fontSize: 22,
            }}
          >
            <span style={{ fontWeight: 800, color: "#0f766e" }}>thaisupplyhub.com</span>
            <span>Ranked by real Google reviews</span>
          </div>
        </div>

        {/* Right panel — Trust Score */}
        <div
          style={{
            width: 300,
            background: "linear-gradient(160deg, #0f766e 0%, #065f46 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {trust ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", color: "#d1fae5", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
                TRUST SCORE
              </div>
              <div style={{ display: "flex", color: "white", fontSize: 96, fontWeight: 900, lineHeight: 1 }}>
                {trust.overall}
              </div>
              <div style={{ display: "flex", color: "white", fontSize: 22, fontWeight: 800, textAlign: "center" }}>
                {trust.tier}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 80 }}>🏭</div>
          )}
        </div>
      </div>
    ),
    size,
  );
}
