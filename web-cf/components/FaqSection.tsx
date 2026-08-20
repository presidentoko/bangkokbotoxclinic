// 클리닉 FAQ 가시화 — JSON-LD 와 함께 사용자에게도 노출.
// SEO: 콘텐츠 자체로 long-tail 키워드 + Google FAQ rich snippet.
// AEO: LLM (ChatGPT/Perplexity) 가 사실 정확 인용 가능한 구조.
import type { Faq } from "@/lib/clinic-faq";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section
      className="bg-white border border-[var(--border)] rounded-xl p-5"
      aria-label="Frequently asked questions"
    >
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span aria-hidden>❓</span>
        Frequently Asked Questions
      </h2>
      <dl className="divide-y divide-[var(--border)]">
        {faqs.map((f, i) => (
          <details key={i} className="py-3 group" open={i < 2}>
            <summary className="cursor-pointer list-none flex items-start gap-3">
              <span
                className="text-xs font-bold text-[var(--accent)] mt-1 tabular-nums shrink-0"
                aria-hidden
              >
                Q{i + 1}
              </span>
              <dt className="text-sm font-semibold text-[var(--fg)] flex-1 leading-snug">
                {f.q}
              </dt>
              <span
                className="text-[var(--muted)] text-xs mt-1 shrink-0 group-open:rotate-180 transition-transform"
                aria-hidden
              >
                ▼
              </span>
            </summary>
            <dd className="mt-2 pl-9 text-sm leading-relaxed text-[var(--muted)]">
              {f.a}
            </dd>
          </details>
        ))}
      </dl>
    </section>
  );
}
