import { Hero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { ExampleBooksCarousel } from '@/components/sections/ExampleBooksCarousel'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { PricingSection } from '@/components/sections/PricingSection'
// import { CampaignBanners } from '@/components/sections/CampaignBanners' // Şimdilik kapalı, lazım olursa kullanılır
import { FAQSection } from '@/components/sections/FAQSection'

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

