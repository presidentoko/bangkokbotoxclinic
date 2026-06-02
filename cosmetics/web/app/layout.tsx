// Root layout is a pass-through shell.
// <html lang> and <body> live in app/[locale]/layout.tsx so each locale
// can set lang="th" / lang="en" correctly.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
