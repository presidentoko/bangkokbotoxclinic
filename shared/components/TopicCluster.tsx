// Mentioned topics 시각 클러스터 — 빈도에 따라 글자 크기/색상 차이.
//
// 2026-10-26: /th 용 lang·labels 추가 (web/ 보톡스 /th 클리닉 현지화). 둘 다 선택 prop 이라
// 기존 호출부(web-restaurants·web-golf·web-thaigle)는 그대로 영어로 나온다. 태국어 토픽
// 라벨은 앱마다 토픽 키가 달라 여기서 import 하지 않고 호출부가 labels 로 넘긴다
// (web/ 은 TOPIC_LABELS_TH). TOPIC_LABELS_TH 를 import 하면 그게 없는 다른 앱이 깨진다.

import { TOPIC_LABELS } from "@/lib/types";

const POSITIVE = new Set([
  "genuine_brand", "english_speaking", "clean_facility", "affordable",
  "professional", "friendly_staff", "results_satisfied", "no_pain",
  "recommend", "korean_doctor", "premium",
]);
const NEGATIVE = new Set(["long_wait", "expensive"]);

export function TopicCluster({ topics, lang = "en", labels = TOPIC_LABELS }: {
  topics: { topic: string; count: number }[];
  lang?: "en" | "th";
  labels?: Record<string, string>;
}) {
  if (!topics.length) return null;
  const max = Math.max(...topics.map((t) => t.count));

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-3">
        {lang === "th" ? "สิ่งที่ผู้รีวิวพูดถึงบ่อยที่สุด" : "What reviewers mention most"}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {topics.map((t) => {
          const weight = 0.4 + (t.count / max) * 0.6;
          const isPos = POSITIVE.has(t.topic);
          const isNeg = NEGATIVE.has(t.topic);
          const bg = isNeg ? "#fff7ed" : isPos ? "#f0fdf4" : "#f8fafc";
          const fg = isNeg ? "#9a3412" : isPos ? "#166534" : "#334155";
          return (
            <span
              key={t.topic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium"
              style={{
                fontSize: `${0.75 + weight * 0.4}rem`,
                background: bg,
                color: fg,
                opacity: 0.6 + weight * 0.4,
              }}
            >
              {labels[t.topic] ?? t.topic}
              <span className="text-[10px] opacity-60 tabular-nums">×{t.count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
