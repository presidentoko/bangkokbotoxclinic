// Root layout is a pass-through shell.
// <html lang> and <body> live in app/[locale]/layout.tsx so each locale
// can set lang="ar" dir="rtl" etc. correctly.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
