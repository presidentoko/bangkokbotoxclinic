export const dynamic = "force-dynamic";

import AdminLogin from "@/components/AdminLogin";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import { isOpen, listRequests } from "@/lib/auctionStore";
import { procedureLabel } from "@/lib/auctionText";

export default async function AuctionListPage() {
  if (!(await isAdminAuthedFromCookies())) return <AdminLogin />;
  const reqs = await listRequests(50);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-sm">
      <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Admin · 견적 경매</div>
      <h1 className="text-xl font-black text-white mb-6">견적 요청 {reqs.length}건</h1>
      <ul className="divide-y divide-gray-800 border border-gray-800 rounded-lg">
        {reqs.map((r) => (
          <li key={r.id}>
            <a href={`/admin/auctions/${r.id}`} className="block px-3 py-2 hover:bg-gray-900">
              <span className="text-xs text-gray-400 mr-2">
                {r.status === "chosen" ? "✅ 선택" : isOpen(r) ? "🟢 입찰중" : r.status === "closed" ? "⛔ 마감" : "⏳ 선택 대기"}
              </span>
              <span className="font-bold">{procedureLabel(r.procedure)}</span>
              <span className="text-gray-400"> · {r.details.slice(0, 60)}</span>
              <span className="block text-xs text-gray-500">{new Date(r.at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })} · {r.name || "(이름 없음)"}</span>
            </a>
          </li>
        ))}
        {reqs.length === 0 && <li className="px-3 py-4 text-gray-500">아직 요청이 없어요.</li>}
      </ul>
    </div>
  );
}
