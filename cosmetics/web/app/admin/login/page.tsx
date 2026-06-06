import { login } from "../actions";

export const metadata = { title: "Admin Login", robots: "noindex" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const { err } = await searchParams;
  return (
    <div className="min-h-screen bg-[#fbf4f1] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <p className="font-serif-display text-2xl font-semibold text-[#2b2222]">BangkokFillers</p>
          <p className="text-sm text-neutral-500">Admin</p>
        </div>
        {err && (
          <p className="text-sm text-rose-500 text-center bg-rose-50 rounded-xl py-2">Wrong password</p>
        )}
        <form action={login} className="bg-white rounded-2xl border border-[#efe1db] p-6 space-y-4 shadow-sm">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="w-full rounded-xl border border-[#efe1db] px-4 py-3 text-sm focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            Login →
          </button>
        </form>
      </div>
    </div>
  );
}
