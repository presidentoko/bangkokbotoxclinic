// Pantip 토픽 mention 표시 — 클리닉이 태국 최대 커뮤니티에서 어떻게 언급되는지.
// 데이터 출처: pantip/output/clinics/<id>.json → master_db.json 머지 → clinic.pantip
// SEO: 외부 reference + 인용 snippet → trust signal + 검색결과 풍부.
import type { Clinic } from "@/lib/types";

type PantipMention = {
  topic_id: string;
  url: string;
  title: string;
  score: number;
  branch_specific: boolean;
  op_mentioned: boolean;
  title_mentioned: boolean;
  comment_count_with_mention: number;
  sample_snippet: string;
};

type Pantip = {
  fetched_at: string;
  candidates_total: number;
  mention_count: number;
  branch_specific_count: number;
  score_distribution: Record<string, number>;
  top_mentions: PantipMention[];
};

export function PantipMentions({ clinic }: { clinic: Clinic & { pantip?: Pantip } }) {
  const p = clinic.pantip;
  if (!p || !p.mention_count || !p.top_mentions?.length) return null;

  return (
    <section
      className="bg-white border border-[var(--border)] rounded-xl p-5"
      aria-label="Pantip community discussions"
    >
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span aria-hidden>💬</span>
          Discussed in Pantip
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full tabular-nums">
            {p.mention_count}
          </span>
        </h2>
        <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
          Thailand&apos;s largest forum · independent
        </span>
      </div>

      <div className="text-xs text-[var(--muted)] mb-3 flex flex-wrap gap-x-3 gap-y-1">
        <span>
          <strong className="text-[var(--fg)] tabular-nums">{p.mention_count}</strong> threads mention this clinic
        </span>
        {p.branch_specific_count > 0 && (
          <span>
            <strong className="text-[var(--fg)] tabular-nums">{p.branch_specific_count}</strong> reference this specific branch
          </span>
        )}
        <span>
          out of <strong className="text-[var(--fg)] tabular-nums">{p.candidates_total}</strong> search candidates
        </span>
      </div>

      <ul className="space-y-3">
        {p.top_mentions.slice(0, 5).map((m) => (
          <li
            key={m.topic_id}
            className="border-l-4 border-[var(--accent)] bg-slate-50 px-4 py-3 rounded-r"
          >
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block text-sm font-semibold text-[var(--fg)] hover:text-[var(--accent)] hover:underline leading-snug"
              lang="th"
            >
              {m.title}
            </a>
            {m.sample_snippet && (
              <p
                className="mt-2 text-xs text-[var(--muted)] leading-relaxed line-clamp-3"
                lang="th"
              >
                {m.sample_snippet}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[var(--muted)]">
              <span className="bg-white border border-[var(--border)] px-1.5 py-0.5 rounded font-bold">
                Relevance {m.score}/4
              </span>
              {m.branch_specific && (
                <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                  ✓ This branch confirmed
                </span>
              )}
              {m.title_mentioned && (
                <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                  in title
                </span>
              )}
              {m.op_mentioned && (
                <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                  in OP
                </span>
              )}
              {m.comment_count_with_mention > 0 && (
                <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded">
                  {m.comment_count_with_mention} comment{m.comment_count_with_mention > 1 ? "s" : ""}
                </span>
              )}
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="ml-auto text-[var(--accent)] hover:underline font-medium"
              >
                pantip.com/topic/{m.topic_id} →
              </a>
            </div>
          </li>
        ))}
      </ul>

      {p.top_mentions.length > 5 && (
        <p className="mt-3 text-[11px] text-[var(--muted)]">
          Showing top 5 of {p.top_mentions.length} most relevant threads (sorted by score, branch-specific first).
        </p>
      )}

      <p className="mt-3 text-[10px] text-[var(--muted)] leading-relaxed">
        Data: live Pantip search + thread-body relevance matching. Branch-specific = clinic&apos;s full name (incl. branch) found in thread text.
      </p>
    </section>
  );
}
