import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { CartProvider } from '@/contexts/CartContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

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
          <SessionProvider>
          <CurrencyProvider>
          <CartProvider>
            <Header />
            <main className="relative min-h-screen">{children}</main>
            <Footer />
            <CookieConsentBanner />
          </CartProvider>
          </CurrencyProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
