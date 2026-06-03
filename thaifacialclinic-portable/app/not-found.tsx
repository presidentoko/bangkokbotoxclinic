import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <span className="font-display text-[10rem] font-black tracking-tighter-display leading-none bg-gradient-to-br from-navy-700 to-gold-500 bg-clip-text text-transparent">
          404
        </span>
        <span className="absolute -bottom-2 -right-4 grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-white text-2xl shadow-lg rotate-12">
          💇
        </span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tighter-display">This clinic isn't in our records</h1>
      <p className="mt-3 text-base muted leading-relaxed">
        Maybe a typo, maybe a clinic that closed, maybe a URL we removed. Either way — let's get you somewhere useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          ← Back to directory
        </Link>
        <Link href="/for-clinics/" className="btn-ghost">
          For clinic owners →
        </Link>
      </div>
      <div className="mt-12 grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-4">
        {[
          { href: "/en/c/fue/", label: "FUE" },
          { href: "/en/c/dhi/", label: "DHI" },
          { href: "/en/c/smp/", label: "SMP" },
          { href: "/en/guide/bangkok-hair-clinic-guide/", label: "Bangkok guide" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border p-3 text-sm font-bold hover:border-navy-700"
            style={{ borderColor: "rgb(var(--border))" }}>
            {l.label} →
          </Link>
        ))}
      </div>
    </main>
  );
}
