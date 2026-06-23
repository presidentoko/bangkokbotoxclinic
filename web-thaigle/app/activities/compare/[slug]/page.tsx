import type { Metadata } from "next";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { NicheFaq } from "@/lib/niche-content";

export const dynamic = "force-static";
export const dynamicParams = false;

type CompareData = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  a: { name: string; icon: string; nicheSlug: string; pros: string[]; cons: string[]; priceRange: string; bestFor: string };
  b: { name: string; icon: string; nicheSlug: string; pros: string[]; cons: string[]; priceRange: string; bestFor: string };
  verdict: string;
  faqs: NicheFaq[];
};

const COMPARISONS: CompareData[] = [
  {
    slug: "thai-massage-vs-oil-massage",
    title: "Thai Massage vs Oil Massage in Bangkok",
    metaTitle: "Thai Massage vs Oil Massage Bangkok — Which Is Better? (2026)",
    description: "Thai massage and oil massage are both popular in Bangkok — but they feel completely different. Here's what to expect from each and how to choose.",
    a: {
      name: "Thai Massage",
      icon: "🙏",
      nicheSlug: "spa",
      pros: ["Improves flexibility", "No oil / done clothed", "More energizing", "Addresses muscle tension deeply"],
      cons: ["Can be intense / uncomfortable for first-timers", "Requires comfortable, loose clothing", "Not relaxation-focused"],
      priceRange: "฿200–฿600 / hour",
      bestFor: "Muscle tension, back pain, flexibility, energy boost",
    },
    b: {
      name: "Oil Massage",
      icon: "💆",
      nicheSlug: "spa",
      pros: ["Very relaxing", "Good for stress relief", "Skin benefits from oil", "Gentler pressure"],
      cons: ["Can feel greasy afterward", "Less therapeutic than Thai", "Usually costs more"],
      priceRange: "฿350–฿800 / hour",
      bestFor: "Relaxation, stress relief, skin nourishment, couples",
    },
    verdict: "For first-timers: oil massage is gentler and more relaxing. For therapeutic benefits and flexibility: traditional Thai massage. Many Bangkok spas offer combination packages (45 min each) — ideal if you want to try both.",
    faqs: [
      {
        q: "Which massage should I get first in Bangkok?",
        a: "Oil massage if you want pure relaxation. Traditional Thai if you want to experience an authentic Thai wellness treatment. Most tourists try Thai massage first since it's more unique to Thailand and harder to find outside Southeast Asia.",
      },
      {
        q: "Is Thai massage painful?",
        a: "Traditional Thai massage involves stretching and compression that can feel intense. Reputable spas ask about your pressure preference — always say 'medium' or 'light' if you're a first-timer. It should never be painful; just intense stretching.",
      },
      {
        q: "How much should I tip after a massage in Bangkok?",
        a: "฿50–฿100 per therapist for a budget massage shop. ฿100–฿200 for mid-range spas. At luxury hotel spas, tipping is optional (service charge usually included). Cash tip handed directly to your therapist is always appreciated.",
      },
    ],
  },
  {
    slug: "muay-thai-vs-boxing",
    title: "Muay Thai vs Boxing in Bangkok — What's the Difference?",
    metaTitle: "Muay Thai vs Boxing Bangkok — Training Differences, Costs, Where to Train (2026)",
    description: "Muay Thai uses 8 weapons (fists, elbows, knees, kicks). Western boxing uses 4. Here's how they differ for tourists and which to choose in Bangkok.",
    a: {
      name: "Muay Thai",
      icon: "🥊",
      nicheSlug: "muay-thai",
      pros: ["Authentic Thai cultural experience", "Full body workout (kicks, knees, elbows)", "Widely available in Bangkok", "Cheaper to train"],
      cons: ["More complex to learn", "Sparring can be intense", "Many gyms mix skill levels"],
      priceRange: "฿300–฿800 / session",
      bestFor: "Cultural immersion, full-body fitness, authentic martial arts experience",
    },
    b: {
      name: "Western Boxing",
      icon: "🥋",
      nicheSlug: "muay-thai",
      pros: ["Simpler to start (just punches)", "Great cardio", "Global skill if you continue", "Fewer gyms = less tourist-heavy"],
      cons: ["Less 'Thailand' experience", "Fewer dedicated boxing gyms vs Muay Thai", "Missing the cultural element"],
      priceRange: "฿300–฿700 / session",
      bestFor: "Cardio fitness, punching technique, people already training boxing at home",
    },
    verdict: "In Bangkok, Muay Thai is the obvious choice — it's the local martial art, gyms are everywhere, and the experience is culturally unique. Many Muay Thai gyms also teach boxing footwork and punching. Unless you're specifically focused on boxing-only technique, train Muay Thai.",
    faqs: [
      {
        q: "Can I train Muay Thai with no experience?",
        a: "Yes. Every Muay Thai gym in Bangkok welcomes complete beginners. Your first session will cover basic stance, jab-cross combinations, and a few kicks. You won't spar on day one. Look for gyms with a 'Beginner Friendly' tag on Thaigle.",
      },
      {
        q: "What should I wear to Muay Thai training?",
        a: "Gym shorts (not jeans or long pants), a t-shirt, and athletic shoes. Some gyms require traditional Thai boxing shorts for class — often provided or sold at the gym for ฿200–฿400. Gloves and hand wraps are usually provided or rentable.",
      },
      {
        q: "How many days should I train Muay Thai in Bangkok?",
        a: "Even one session is worthwhile as a tourist experience. 2–3 days gives you real technique. A week of twice-daily sessions is serious training. Most tourist gyms offer single-session drop-ins with no booking required.",
      },
    ],
  },
  {
    slug: "yoga-vs-pilates-bangkok",
    title: "Yoga vs Pilates in Bangkok — Which Class to Take?",
    metaTitle: "Yoga vs Pilates Bangkok — Studio Comparison, Prices, Best For (2026)",
    description: "Both yoga and Pilates are widely available in Bangkok. Here's the key difference and which to choose based on your goals.",
    a: {
      name: "Yoga",
      icon: "🧘",
      nicheSlug: "yoga-pilates",
      pros: ["More studios = more class times", "Better for flexibility and mindfulness", "Cheaper drop-in rates", "Many hot yoga options unique to Bangkok's heat"],
      cons: ["Less focus on core strength", "Wide variation in style/quality"],
      priceRange: "฿400–฿800 / class",
      bestFor: "Flexibility, stress relief, spiritual practice, hot yoga fans",
    },
    b: {
      name: "Pilates",
      icon: "🤸",
      nicheSlug: "yoga-pilates",
      pros: ["Excellent for core strength and posture", "Reformer Pilates unique experience", "More structured progression", "Good for injury recovery"],
      cons: ["Fewer studios, fewer class times", "Reformer classes cost more", "Less meditative"],
      priceRange: "฿600–฿1,500 / class",
      bestFor: "Core strength, posture, back pain, injury rehabilitation",
    },
    verdict: "Yoga if you want more options, lower cost, and mindfulness. Pilates Reformer if you want a unique strength training experience you might not have tried before. Bangkok's Pilates studios (especially in Thong Lor) are excellent quality.",
    faqs: [
      {
        q: "Are Bangkok yoga studios suitable for beginners?",
        a: "Yes. Most studios offer beginner-friendly or 'all levels' classes. Drop-in welcome at most. Book via LINE or online for popular morning/evening time slots.",
      },
      {
        q: "What is Reformer Pilates?",
        a: "Reformer Pilates uses a spring-resistance machine (the Reformer) instead of a mat. It provides more resistance variety and is particularly good for core work and rehabilitation. Prices in Bangkok: ฿600–฿1,200/session. Available at dedicated Pilates studios in Thong Lor, Ari, and Sukhumvit.",
      },
      {
        q: "Is hot yoga safe in Bangkok's heat?",
        a: "Hot yoga studios in Bangkok heat rooms to 37–42°C regardless of outside temperature. Bring water, arrive hydrated, and don't overdo your first class. Most studios provide towels and have cold showers. It's extremely popular with Bangkok's expat and fitness community.",
      },
    ],
  },
];

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARISONS.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.description,
    alternates: { canonical: `/activities/compare/${slug}` },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COMPARISONS.find((x) => x.slug === slug);
  if (!c) return <div>Not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <span>Compare</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-balance">{c.title}</h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">{c.description}</p>

      {/* VS Card */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {[c.a, c.b].map((side, i) => (
          <div
            key={i}
            className={`border-2 rounded-2xl p-5 ${i === 0 ? "border-orange-300 bg-orange-50" : "border-blue-300 bg-blue-50"}`}
          >
            <div className="text-4xl mb-2">{side.icon}</div>
            <h2 className={`text-xl font-black mb-1 ${i === 0 ? "text-orange-800" : "text-blue-800"}`}>{side.name}</h2>
            <div className="text-sm font-bold mb-3 text-[var(--muted)]">{side.priceRange}</div>

            <div className="mb-3">
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-green-700">Pros</div>
              <ul className="space-y-1">
                {side.pros.map((p, j) => (
                  <li key={j} className="text-sm flex gap-2">
                    <span className="text-green-600 shrink-0">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold uppercase tracking-wider mb-1.5 text-red-600">Cons</div>
              <ul className="space-y-1">
                {side.cons.map((p, j) => (
                  <li key={j} className="text-sm flex gap-2">
                    <span className="text-red-500 shrink-0">✗</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-3 border-t border-white/60">
              <div className="text-xs font-bold uppercase tracking-wider mb-1">Best for</div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{side.bestFor}</p>
            </div>

            <a
              href={`/activities/${side.nicheSlug}`}
              className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${i === 0 ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            >
              Browse {side.name} venues →
            </a>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">⚖️</span>
          <h2 className="font-black text-lg">Our Verdict</h2>
        </div>
        <p className="text-base leading-relaxed text-[var(--fg)]">{c.verdict}</p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-xl font-black mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {c.faqs.map((f, i) => (
            <details key={i} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
              <summary className="font-semibold cursor-pointer flex items-center justify-between gap-3 text-sm">
                <span>{f.q}</span>
                <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* More comparisons */}
      <section className="mb-8">
        <h2 className="text-lg font-black mb-3">More comparisons</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {COMPARISONS.filter((x) => x.slug !== slug).map((x) => (
            <a
              key={x.slug}
              href={`/activities/compare/${x.slug}`}
              className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition text-sm font-medium hover:text-orange-700"
            >
              {x.title}
            </a>
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: c.title, url: `/activities/compare/${slug}` },
      ]} />
      <FaqJsonLd faqs={c.faqs} />
    </div>
  );
}
