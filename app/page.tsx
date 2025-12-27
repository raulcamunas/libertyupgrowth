import HeroSection from '@/components/HeroSection'
import MainContentWrapper from '@/components/MainContentWrapper'
import LandingScripts from '@/components/LandingScripts'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export default function Home() {
  return (
    <>
      <AnalyticsTracker pageType="home" />
      <HeroSection />
      <MainContentWrapper />
      <LandingScripts />
    </>
  )
}

