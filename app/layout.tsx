import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

