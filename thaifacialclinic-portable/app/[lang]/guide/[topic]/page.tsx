import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import { findGuide, GUIDES, GUIDE_TO_PROCS, procLabel, type GuideTopic } from "@/lib/guides";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";

export const dynamic = "force-static";

type RedditThread = { id: string; title: string; subreddit: string; query: string; url: string; author: string; score: number; comments: number; excerpt: string };
type PantipTopic = { id: string; title: string; url: string; author: string; comments: number; excerpt: string };
type NaverPost = { title: string; url: string; blogger: string; query: string; excerpt: string; date: string };

let _r: RedditThread[] | null = null;
let _p: PantipTopic[] | null = null;
let _n: NaverPost[] | null = null;

function loadJson<T>(name: string, ref: T[] | null): T[] {
  if (ref) return ref;
  const p = path.join(process.cwd(), "public", "data", name);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, "utf-8")) as T[]; } catch { return []; }
}

function reddit(): RedditThread[] { return (_r ??= loadJson<RedditThread>("hair_reddit.json", _r)); }
function pantip(): PantipTopic[] { return (_p ??= loadJson<PantipTopic>("hair_pantip.json", _p)); }
function naver(): NaverPost[]   { return (_n ??= loadJson<NaverPost>("hair_naver.json", _n)); }

function matchReddit(g: GuideTopic, t: RedditThread): boolean {
  if (!g.reddit) return false;
  if (g.reddit.subreddit && !g.reddit.subreddit.test(t.subreddit)) return false;
  if (g.reddit.query && !g.reddit.query.test(t.query)) {
    if (!g.reddit.title || !g.reddit.title.test(t.title)) return false;
  }
  if (g.reddit.title && !g.reddit.title.test(t.title)) {
    if (!g.reddit.query || !g.reddit.query.test(t.query)) return false;
  }
  return true;
}

function matchPantip(g: GuideTopic, t: PantipTopic): boolean {
  if (!g.pantip) return false;
  return !!(g.pantip.title && g.pantip.title.test(t.title));
}

function matchNaver(g: GuideTopic, t: NaverPost): boolean {
  if (!g.naver) return false;
  if (g.naver.query && g.naver.query.test(t.query)) return true;
  if (g.naver.title && g.naver.title.test(t.title)) return true;
  return false;
}

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) => GUIDES.map((g) => ({ lang, topic: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; topic: string }> }): Promise<Metadata> {
  const { lang, topic } = await params;
  const g = findGuide(topic);
  if (!g) return {};
  return {
    title: g.metaTitle ?? g.title,
    description: g.metaDescription ?? g.intro.slice(0, 160),
    alternates: { canonical: `${SITE.origin}/${lang}/guide/${g.slug}/` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ lang: Lang; topic: string }> }) {
  const { lang, topic } = await params;
  const g = findGuide(topic);
  if (!g) notFound();

  const r = reddit().filter((t) => matchReddit(g, t)).sort((a, b) => b.score - a.score).slice(0, 30);
  const p = pantip().filter((t) => matchPantip(g, t)).slice(0, 20);
  const n = naver().filter((t) => matchNaver(g, t)).slice(0, 20);
  const totalSources = r.length + p.length + n.length;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <Header lang={lang} />
      <main className="space-y-10 pt-2">
        <nav className="text-xs muted">
          <Link href={`/${lang}/`} className="hover:text-[rgb(var(--fg))]">Home</Link>
          <span className="mx-2">›</span>
          <Link href={`/${lang}/`} className="hover:text-[rgb(var(--fg))]">Guides</Link>
          <span className="mx-2">›</span>
          <span>{g.title}</span>
        </nav>

        <header>
          <div className="eyebrow">Guide</div>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl">
            {g.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed muted sm:text-lg">{g.intro}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            {r.length > 0 && <span className="rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">{r.length} Reddit</span>}
            {p.length > 0 && <span className="rounded-full bg-violet-100 px-3 py-1 font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">{p.length} Pantip</span>}
            {n.length > 0 && <span className="rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{n.length} Naver</span>}
            <span className="rounded-full bg-navy-100 px-3 py-1 font-bold text-navy-700 dark:bg-navy-900/40 dark:text-navy-200">{totalSources} community posts</span>
          </div>
        </header>

        {r.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">From Reddit · r/Hairtransplant, r/SMP, r/tressless</h2>
            <ul className="space-y-3">
              {r.map((t) => (
                <li key={t.id}>
                  <a href={t.url} target="_blank" rel="nofollow noopener" className="block card card-hover p-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider muted">
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-orange-700">r/{t.subreddit}</span>
                      <span className="tabular-nums">▲ {t.score}</span>
                      <span className="tabular-nums">💬 {t.comments}</span>
                      {t.author && <span>by u/{t.author}</span>}
                    </div>
                    <div className="mt-2 font-display text-lg font-bold leading-tight">{t.title}</div>
                    {t.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed muted">{t.excerpt}</p>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {p.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">From Pantip · Thai community discussions</h2>
            <ul className="space-y-3">
              {p.map((t) => (
                <li key={t.id}>
                  <a href={t.url} target="_blank" rel="nofollow noopener" className="block card card-hover p-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider muted">
                      <span className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-700">Pantip</span>
                      <span className="tabular-nums">💬 {t.comments}</span>
                    </div>
                    <div className="mt-2 font-display text-lg font-bold leading-tight">{t.title}</div>
                    {t.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed muted">{t.excerpt}</p>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {n.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">From Naver · Korean blogger posts</h2>
            <ul className="space-y-3">
              {n.map((t, i) => (
                <li key={i}>
                  <a href={t.url} target="_blank" rel="nofollow noopener" className="block card card-hover p-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider muted">
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">Naver Blog</span>
                      {t.date && <span>{t.date}</span>}
                    </div>
                    <div className="mt-2 font-display text-lg font-bold leading-tight">{t.title}</div>
                    {t.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed muted">{t.excerpt}</p>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Editorial article sections */}
        {g.sections && g.sections.length > 0 && (
          <article className="space-y-8">
            <h2 className="font-display text-2xl font-bold tracking-tighter-display">In-depth guide</h2>
            {g.sections.map((s) => (
              <section key={s.heading}>
                <h3 className="font-display text-lg font-bold mb-2">{s.heading}</h3>
                <p className="text-sm leading-relaxed muted">{s.body}</p>
              </section>
            ))}
          </article>
        )}

        {/* FAQ section */}
        {g.faqs && g.faqs.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">Frequently asked</h2>
            <div className="space-y-3">
              {g.faqs.map((f, i) => (
                <details key={i} className="rounded-xl border p-4" style={{ borderColor: "rgb(var(--border))" }}>
                  <summary className="font-semibold cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed muted">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {totalSources === 0 && !g.sections && (
          <p className="text-center text-sm muted py-20">No community posts matched this topic yet — check back as we expand coverage.</p>
        )}

        {/* Browse clinics by procedure */}
        {(GUIDE_TO_PROCS[g.slug] ?? []).length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">Browse clinics</h2>
            <div className="flex flex-wrap gap-3">
              {(GUIDE_TO_PROCS[g.slug] ?? []).map((proc) => (
                <Link key={proc} href={`/${lang}/c/${proc}/`} className="card card-hover inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold">
                  {procLabel(proc)} clinics in Thailand →
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related guides */}
        <section>
          <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">Other guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {GUIDES.filter((x) => x.slug !== g.slug).slice(0, 6).map((og) => (
              <Link key={og.slug} href={`/${lang}/guide/${og.slug}/`} className="card card-hover p-4">
                <div className="font-display text-base font-bold leading-tight">{og.title}</div>
                <div className="mt-1 text-xs muted line-clamp-2">{og.intro}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-2xl border-2 bg-gold-50 dark:bg-gold-950/30 p-6 text-center"
            style={{ borderColor: "rgb(var(--border))" }}>
            <h3 className="font-display text-xl font-bold">Ready to talk to a real clinic?</h3>
            <p className="mt-2 text-sm muted">230+ verified clinics across Thailand · free quote · no spam</p>
            <Link href={`/${lang}/#directory`} className="mt-4 inline-block btn-gold">Browse directory →</Link>
          </div>
        </section>

        {/* Article JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": g.metaTitle ?? g.title,
            "description": g.metaDescription ?? g.intro,
            "author": { "@type": "Organization", "name": SITE.name },
            "publisher": { "@type": "Organization", "name": SITE.name },
            "mainEntityOfPage": `${SITE.origin}/${lang}/guide/${g.slug}/`,
          })
        }} />
        {/* FAQ JSON-LD */}
        {g.faqs && g.faqs.length > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": g.faqs.map((f) => ({
                "@type": "Question",
                "name": f.q,
                "acceptedAnswer": { "@type": "Answer", "text": f.a },
              })),
            })
          }} />
        )}
      </main>
    </div>
  );
}
