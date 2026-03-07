import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/metadata'
import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { ExampleBooksCarousel } from '@/components/sections/ExampleBooksCarousel'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { PricingSection } from '@/components/sections/PricingSection'
// import { CampaignBanners } from '@/components/sections/CampaignBanners' // Şimdilik kapalı, lazım olursa kullanılır
import { FAQSection } from '@/components/sections/FAQSection'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return buildPageMetadata(locale, 'home', '')
}

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ExampleBooksCarousel />
      <FeaturesSection />
      <PricingSection />
      {/* <CampaignBanners /> */} {/* Şimdilik kapalı, lazım olursa kullanılır */}
      <FAQSection />
    </>
  )
}

