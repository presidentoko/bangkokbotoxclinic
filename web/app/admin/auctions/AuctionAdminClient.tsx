"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type PickerClinic = { id: string; name: string; district: string; trust: number; rating: number; reviews: number; ig: boolean };

/** 클리닉을 골라 입찰 링크를 만든다. 이미 초대한 곳은 빠진다. */
export function ClinicPicker({ reqId, clinics, invited }: { reqId: string; clinics: PickerClinic[]; invited: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [igOnly, setIgOnly] = useState(true);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const done = useMemo(() => new Set(invited), [invited]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return clinics
      .filter((c) => !done.has(c.id))
      .filter((c) => !igOnly || c.ig)
      .filter((c) => !s || c.name.toLowerCase().includes(s) || c.district.toLowerCase().includes(s))
      .slice(0, 60);
  }, [clinics, done, q, igOnly]);

  function toggle(id: string) {
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function invite() {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/auction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "invite", req_id: reqId, clinic_ids: [...sel] }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setMsg("실패했어요. 다시 시도하세요.");
    const j = (await res.json()) as { created: number };
    setMsg(`${j.created}곳 링크 생성`);
    setSel(new Set());
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름·지역 검색"
          className="flex-1 min-w-[12rem] bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
        <label className="text-xs flex items-center gap-1">
          <input type="checkbox" checked={igOnly} onChange={(e) => setIgOnly(e.target.checked)} /> 인스타 있는 곳만
        </label>
        <button type="button" onClick={invite} disabled={busy || sel.size === 0}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-40">
          {busy ? "생성 중…" : `선택한 ${sel.size}곳 링크 만들기`}
        </button>
        {msg && <span className="text-xs text-emerald-400">{msg}</span>}
      </div>
      <ul className="divide-y divide-gray-800 border border-gray-800 rounded-lg">
        {list.map((c) => (
          <li key={c.id}>
            <label className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-900">
              <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} />
              <span className="flex-1 min-w-0 truncate">{c.name}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {c.district || "—"} · TS {c.trust} · {c.rating.toFixed(1)}★ {c.reviews} {c.ig ? "· IG" : ""}
              </span>
            </label>
          </li>
        ))}
        {list.length === 0 && <li className="px-3 py-4 text-sm text-gray-500">조건에 맞는 클리닉이 없어요.</li>}
      </ul>
    </div>
  );
}

export function CloseButton({ reqId }: { reqId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button type="button" disabled={busy}
      onClick={async () => {
        if (!confirm("이 요청을 마감할까요? 더 이상 입찰을 안 받고 손님도 선택할 수 없어요.")) return;
        setBusy(true);
        await fetch("/api/admin/auction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "close", req_id: reqId }),
        }).catch(() => null);
        setBusy(false);
        router.refresh();
      }}
      className="text-xs px-3 py-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">
      마감하기
    </button>
  );
}
