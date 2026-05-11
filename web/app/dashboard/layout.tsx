import type { Metadata } from "next";

export const metadata: Metadata = {
  // 대시보드는 private. Search engine 인덱싱 차단.
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f9fafb] min-h-screen -my-16 py-16">
      {children}
    </div>
  );
}
