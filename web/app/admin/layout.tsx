import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* viewport meta is in root layout — ensure no overflow */}
      <div className="overflow-x-hidden">{children}</div>
    </div>
  );
}
