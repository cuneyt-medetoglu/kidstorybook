import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KidStoryBook - AI ile Kişiselleştirilmiş Çocuk Kitapları',
  description: 'Çocuğunuzun fotoğrafıyla AI destekli, kişiselleştirilmiş hikaye kitapları oluşturun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  )
}

