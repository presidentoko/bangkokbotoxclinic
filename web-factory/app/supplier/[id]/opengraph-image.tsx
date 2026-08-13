import { ImageResponse } from "next/og";
import { loadMasterDb, getSupplierById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { computeTrustScore } from "@/lib/trustScore";
import { isIndexable } from "@/lib/supplierTier";

export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Thai Supply Hub — verified B2B supplier profile";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  // 색인되는 supplier 만 전용 카드를 굽는다.
  //
  // Cloudflare Pages 배포는 20,000 파일이 한도인데 supplier 한 곳이 HTML 1 + OG 1
  // 로 두 개를 먹는다. 전량 생성하면 19,458/20,000 — 다음 스크랩 배치를 못 올린다.
  // OG 이미지가 그 절반이고, 그중 4,100 개는 lib/supplierTier.ts 에서 noindex 로
  // 분류된 페이지 것이다. 검색에 안 나오는 페이지의 전용 공유 카드다.
  //
  // 빠진 id 도 페이지 메타에는 og:image URL 이 그대로 박힌다 (Next 는 이 목록과
  // 무관하게 URL 을 emit 한다 — 실측 확인). 그 404 는
  // functions/supplier/_middleware.ts 가 사이트 공용 카드로 302 시킨다.
  return db.suppliers.filter(isIndexable).map((r) => ({ id: r.id }));
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
                {/* 체크마크는 글리프가 아니라 도형으로 그린다. U+2713 을 쓰면
                    ImageResponse 가 그 문자를 덮는 폰트를 원격으로 받으려 하고,
                    그 요청이 400 으로 실패해 빌드마다 414 번 에러를 뱉으면서
                    verified supplier 의 공유 카드가 깨진 글리프로 나갔다. */}
                <div
                  style={{
                    display: "flex", width: 13, height: 8,
                    borderLeft: "3px solid #065f46",
                    borderBottom: "3px solid #065f46",
                    transform: "rotate(-45deg)",
                    marginBottom: 4,
                  }}
                />
                DBD-VERIFIED
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
