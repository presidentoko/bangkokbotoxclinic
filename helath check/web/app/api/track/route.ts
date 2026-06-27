import { NextRequest, NextResponse } from "next/server";

// Click-tracking endpoint for affiliate outlinks.
// Logs the click and redirects to the destination URL.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const pkgId = searchParams.get("pkg") ?? "";
  const dest = searchParams.get("url") ?? "";

  if (!dest) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Validate that url starts with https:// to prevent open redirect abuse
  let parsed: URL;
  try {
    parsed = new URL(dest);
    if (parsed.protocol !== "https:") throw new Error("non-https");
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  // Log to console (replace with DB insert or analytics if needed)
  console.log(`[track] pkg=${pkgId} → ${parsed.href} ip=${request.headers.get("x-forwarded-for") ?? "unknown"}`);

  // Append UTM tracking so we can measure outbound conversion
  const source = searchParams.get("src") ?? "bangkoktopclinic";
  parsed.searchParams.set("utm_source", source);
  parsed.searchParams.set("utm_medium", "referral");
  parsed.searchParams.set("utm_campaign", "healthcheck");
  if (pkgId) parsed.searchParams.set("utm_content", `pkg_${pkgId}`);

  return NextResponse.redirect(parsed.href, { status: 302 });
}
