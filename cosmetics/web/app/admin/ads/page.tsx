import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdSlots, saveAdSlots, makeAdId } from "@/lib/ads";
import type { AdType, AdSlot } from "@/lib/ads";
import { revalidateForSlots } from "@/lib/ad-revalidate";
import { requireAuth } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: "noindex" };

const CONCERNS = ["acne", "whitening", "antiaging", "pores", "oilcontrol", "sensitive"];
const AD_TYPES = [
  { value: "homepage_featured", label: "Homepage Featured" },
  { value: "category_takeover", label: "Category Takeover" },
  { value: "editors_pick", label: "Editor's Pick" },
  { value: "quiz_result", label: "Quiz Result" },
  { value: "sponsored_review", label: "Sponsored Review" },
];

async function deleteSlot(id: string) {
  "use server";
  await requireAuth();
  const slots = await getAdSlots();
  const removed = slots.find((s) => s.id === id);
  await saveAdSlots(slots.filter((s) => s.id !== id));
  // Revalidate using the slot as it was, not as it now isn't — the pages that
  // need re-rendering are the ones that were showing it.
  if (removed) await revalidateForSlots([removed]);
}

async function createSlot(formData: FormData) {
  "use server";
  await requireAuth();
  const slots = await getAdSlots();
  const newSlot: AdSlot = {
    id: makeAdId(),
    type: formData.get("type") as AdType,
    productId: formData.get("productId") as string,
    productSlug: formData.get("productSlug") as string,
    concern: (formData.get("concern") as string) || undefined,
    advertiserName: formData.get("advertiserName") as string,
    startsAt: formData.get("startsAt") as string,
    endsAt: formData.get("endsAt") as string,
    priceTHB: Number(formData.get("priceTHB")),
    active: formData.get("active") === "on",
  };
  await saveAdSlots([...slots, newSlot]);
  await revalidateForSlots([newSlot]);
}

export default async function AdsAdminPage() {
  const jar = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || jar.get("admin_s")?.value !== expected) redirect("/admin");

  const slots = await getAdSlots();

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-sm text-gray-500 hover:underline">← Admin</Link>
        <h1 className="text-2xl font-bold">Ad Slots</h1>
        <Link href="/admin/ads/report" className="ml-auto text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50">
          Performance
        </Link>
      </div>

      {/* Slot list */}
      <section className="mb-10">
        {slots.length === 0 && <p className="text-gray-500 text-sm">No slots yet.</p>}
        <ul className="space-y-3">
          {slots.map((s) => (
            <li key={s.id} className="border rounded-lg p-4 flex gap-4 items-start">
              <div className="flex-1 text-sm">
                <div className="font-semibold">{s.type}{s.concern ? ` · ${s.concern}` : ""}</div>
                <div className="text-gray-500">
                  {s.advertiserName} · {s.productId} · {s.startsAt}→{s.endsAt} · ฿{s.priceTHB.toLocaleString()}
                </div>
                <div className={s.active ? "text-green-600" : "text-gray-400"}>
                  {s.active ? "● Active" : "○ Inactive"}
                </div>
              </div>
              <form action={deleteSlot.bind(null, s.id)}>
                <button type="submit" className="text-xs text-red-600 underline">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* Create form */}
      <section>
        <h2 className="text-lg font-semibold mb-3">New Slot</h2>
        <form action={createSlot} className="grid grid-cols-2 gap-3 text-sm">
          <label className="col-span-2 flex flex-col gap-1">
            Type
            <select name="type" className="border rounded px-2 py-1">
              {AD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Product ID
            <input name="productId" required className="border rounded px-2 py-1" placeholder="bt_29472" />
          </label>
          <label className="flex flex-col gap-1">
            Product Slug
            <input name="productSlug" required className="border rounded px-2 py-1" placeholder="brand-name-bt_29472" />
          </label>
          <label className="flex flex-col gap-1">
            Concern (optional)
            <select name="concern" className="border rounded px-2 py-1">
              <option value="">— none —</option>
              {CONCERNS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Advertiser Name
            <input name="advertiserName" required className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            Start Date
            <input name="startsAt" type="date" required className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            End Date
            <input name="endsAt" type="date" required className="border rounded px-2 py-1" />
          </label>
          <label className="flex flex-col gap-1">
            Price (THB)
            <input name="priceTHB" type="number" required className="border rounded px-2 py-1" />
          </label>
          <label className="col-span-2 flex items-center gap-2">
            <input name="active" type="checkbox" defaultChecked />
            Active immediately
          </label>
          <button type="submit" className="col-span-2 bg-rose-600 text-white rounded-lg py-2 font-medium">
            Create Slot
          </button>
        </form>
      </section>
    </main>
  );
}
