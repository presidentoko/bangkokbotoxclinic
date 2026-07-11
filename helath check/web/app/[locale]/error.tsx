"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">⚠️</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        An unexpected error occurred loading this page. You can try again, or go back to comparing prices.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => reset()}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Try again
        </button>
        <Link href={`/${locale}/compare`}
          className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:border-blue-300 hover:text-blue-700 transition-colors">
          Back to compare
        </Link>
      </div>
    </div>
  );
}
