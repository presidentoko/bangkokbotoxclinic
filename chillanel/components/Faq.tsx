import type { FaqItem } from "@/lib/i18n";
import { FaqJsonLd } from "./JsonLd";

export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="mb-12">
      <FaqJsonLd items={items} />
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border bg-bg-elev p-4 open:pb-4"
          >
            <summary className="cursor-pointer list-none font-semibold flex items-center justify-between gap-4">
              {item.q}
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45 text-lg leading-none">
                +
              </span>
            </summary>
            <p className="text-sm text-muted leading-relaxed mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
