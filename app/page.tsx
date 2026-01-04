import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          🎨 KidStoryBook
        </h1>
        <p className="text-center text-lg mb-8">
          AI destekli kişiselleştirilmiş çocuk hikaye kitapları
        </p>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Proje Hazır! 🚀</h2>
          <p className="text-sm opacity-90 mb-4">
            Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui kurulumu tamamlandı.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Hikaye Oluştur
            </Button>
            <Button variant="outline" size="lg">
              Örnekleri Gör
            </Button>
          </div>
        </div>

        {/* Test Link */}
        <div className="mt-8 text-center">
          <Link href="/test-supabase">
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              🧪 Test Supabase Connection
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

