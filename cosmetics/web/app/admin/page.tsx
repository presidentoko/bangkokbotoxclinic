import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout, setFeatured, clearFeatured, saveBanner } from "./actions";
import { getFeaturedMap, getBanner, kvAvailable } from "@/lib/adminData";
import { CONCERNS, allProducts, getProduct, productSlug, siteStats } from "@/lib/data";
import { concernLabel } from "@/lib/i18n";
import Link from "next/link";
import { getLinkHealth } from "@/lib/link-health";
import { kvGet } from "@/lib/kv";

export const metadata = { title: "Admin — BangkokFillers", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jar = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || jar.get("admin_s")?.value !== expected) redirect("/admin/login");

  const featured = await getFeaturedMap();
  const banner = await getBanner();
  const stats = siteStats();
  const kvOk = kvAvailable();
  const linkHealth = await getLinkHealth();
  const deadLinks = allProducts()
    .filter((p) => linkHealth[p.product_id] && !linkHealth[p.product_id].ok)
    .slice(0, 50);
  const lastChecked = Object.values(linkHealth)[0]?.checkedAt ?? null;
  const leadsRaw = await kvGet("leads");
  const leads: { email: string; skin: string; concern: string; budget: string; ts: string }[] =
    leadsRaw ? JSON.parse(leadsRaw as string) : [];

  return (
    <div className="min-h-screen bg-[#fbf4f1]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#efe1db] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif-display font-semibold text-[#2b2222]">BangkokFillers</span>
          <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/th" target="_blank" className="text-xs text-neutral-400 hover:text-rose-500 transition-colors">
            View site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-neutral-400 hover:text-rose-500 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* KV setup warning */}
        {!kvOk && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-800">⚠️ Vercel KV not configured — changes won't persist</p>
            <p className="text-xs text-amber-700">
              Vercel dashboard → Storage → KV → Create store → Connect to project.<br />
              Then redeploy. Until then, only static <code>lib/featured.ts</code> is used.
            </p>
          </div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { v: stats.products.toLocaleString(), l: "Products" },
            { v: stats.reviews.toLocaleString(), l: "Reviews" },
            { v: CONCERNS.length.toString(), l: "Concerns" },
          ].map(({ v, l }) => (
            <div key={l} className="bg-white rounded-2xl border border-[#efe1db] p-4 text-center">
              <p className="font-serif-display text-2xl font-black text-rose-500">{v}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{l}</p>
            </div>
          ))}
        </section>

        {/* Site Banner */}
        <section className="bg-white rounded-2xl border border-[#efe1db] p-5 space-y-4">
          <h2 className="font-semibold text-sm text-[#2b2222]">Site Banner</h2>
          <form action={saveBanner} className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                id="banner_active"
                defaultChecked={banner?.active ?? false}
                className="w-4 h-4 accent-rose-500"
              />
              <label htmlFor="banner_active" className="text-sm text-neutral-700">Show banner</label>
            </div>
            <input
              type="text"
              name="text"
              defaultValue={banner?.text ?? ""}
              placeholder="Banner message (e.g. 🎉 New: 2,207 Beautrium products added!)"
              className="w-full rounded-xl border border-[#efe1db] px-3 py-2 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
            <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl px-4 py-2 transition-colors">
              Save banner
            </button>
          </form>
        </section>

        {/* Sponsored slots */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[#2b2222]">Sponsored slots</h2>
            <p className="text-xs text-neutral-400">Shows at top of each concern page</p>
          </div>
          <div className="space-y-2">
            {CONCERNS.map((concern) => {
              const pid = featured[concern];
              const product = pid ? getProduct(pid) : null;
              return (
                <div key={concern} className="bg-white rounded-2xl border border-[#efe1db] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#2b2222]">{concernLabel("en", concern)}</span>
                    {product ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs bg-neutral-100 text-neutral-400 px-2 py-0.5 rounded-full">None</span>
                    )}
                  </div>

                  {product && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fffbf5] border border-[#c9a86a]/30">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 object-contain rounded-lg border border-[#efe1db] bg-white p-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2b2222] truncate">{product.brand} {product.name}</p>
                        <p className="text-xs text-neutral-400">฿{Math.round(product.price_thb).toLocaleString()} · ID: {pid}</p>
                      </div>
                      <Link
                        href={`/th/product/${productSlug(product)}`}
                        target="_blank"
                        className="text-xs text-rose-400 hover:text-rose-600 shrink-0"
                      >
                        ↗
                      </Link>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <form action={setFeatured} className="flex gap-2 flex-1">
                      <input type="hidden" name="concern" value={concern} />
                      <input
                        type="text"
                        name="product_id"
                        placeholder="Product ID (e.g. 12345 or bt_29472)"
                        defaultValue={pid ?? ""}
                        className="flex-1 rounded-xl border border-[#efe1db] px-3 py-2 text-xs focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 min-w-0"
                      />
                      <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl px-3 py-2 transition-colors whitespace-nowrap">
                        Set
                      </button>
                    </form>
                    {pid && (
                      <form action={clearFeatured}>
                        <input type="hidden" name="concern" value={concern} />
                        <button type="submit" className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-semibold rounded-xl px-3 py-2 transition-colors">
                          Clear
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dead affiliate links */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-1">
            Dead Affiliate Links{" "}
            <span className="text-sm font-normal text-gray-500">
              ({deadLinks.length} dead
              {lastChecked ? ` · checked ${new Date(lastChecked).toLocaleDateString("th-TH")}` : " · never checked"})
            </span>
          </h2>
          {deadLinks.length === 0 ? (
            <p className="text-sm text-gray-500">All links OK {lastChecked ? "✓" : "(run cron first)"}</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-64 overflow-y-auto border rounded p-2">
              {deadLinks.map((p) => (
                <li key={p.product_id} className="flex gap-2 items-center">
                  <span className="text-red-600 font-mono">{linkHealth[p.product_id].status ?? "ERR"}</span>
                  <span className="truncate">{p.name}</span>
                  <a href={p.url} target="_blank" rel="noopener" className="text-blue-500 underline text-xs shrink-0">
                    {p.url.slice(0, 40)}…
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Email Leads */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-1">
            Email Leads <span className="text-sm font-normal text-gray-500">({leads.length} total)</span>
          </h2>
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500">No leads yet</p>
          ) : (
            <ul className="text-sm space-y-1 max-h-48 overflow-y-auto border rounded p-2 font-mono">
              {[...leads].reverse().map((l, i) => (
                <li key={i}>{l.email} · {l.concern} · {l.skin} · {new Date(l.ts).toLocaleDateString("th-TH")}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Product search helper */}
        <ProductSearch />
      </main>
    </div>
  );
}

function ProductSearch() {
  const products = allProducts()
    .sort((a, b) => (b.konvy_review_count ?? 0) - (a.konvy_review_count ?? 0))
    .slice(0, 200);

  return (
    <section className="bg-white rounded-2xl border border-[#efe1db] p-5 space-y-3">
      <h2 className="font-semibold text-sm text-[#2b2222]">Product ID lookup</h2>
      <p className="text-xs text-neutral-400">Top 200 by review count. Use ID in sponsored slot above.</p>
      <div className="max-h-60 overflow-y-auto space-y-1 rounded-xl border border-[#efe1db] p-2">
        {products.map((p) => (
          <div key={p.product_id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#2b2222] truncate">{p.brand} — {p.name}</p>
              <p className="text-[10px] text-neutral-400">฿{Math.round(p.price_thb).toLocaleString()} · ★{p.konvy_rating?.toFixed(1)} · {p.konvy_review_count} reviews</p>
            </div>
            <code className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded font-mono shrink-0 select-all">{p.product_id}</code>
          </div>
        ))}
      </div>
    </section>
  );
}
