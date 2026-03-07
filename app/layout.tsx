/**
 * Root layout — minimal pass-through.
 * The [locale]/layout.tsx provides <html> and <body> with locale-aware setup.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
