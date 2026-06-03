export default function MiniBarChart({
  data,
  labels,
  highlightIndex,
  height = 120,
}: {
  data: number[];
  labels: string[];
  highlightIndex?: number;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((v, i) => {
          const h = (v / max) * height;
          const isHi = i === highlightIndex;
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className="text-[10px] font-bold tabular-nums text-ink-700 dark:text-ink-300">{v}</div>
              <div
                className={`w-full rounded-t-md transition ${
                  isHi
                    ? "bg-gradient-to-t from-clinic to-clinic-violet"
                    : "bg-ink-200 dark:bg-ink-700"
                }`}
                style={{ height: `${h}px` }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-2">
        {labels.map((l, i) => (
          <div
            key={i}
            className={`flex-1 truncate text-center text-[10px] ${
              i === highlightIndex
                ? "font-bold text-clinic"
                : "text-ink-400 dark:text-ink-500"
            }`}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
