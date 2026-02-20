import HeroSection   from '../components/home/HeroSection'
import StatsSection  from '../components/home/StatsSection'
import NearbyPreview from '../components/home/NearbyPreview'
import HowItWorks    from '../components/home/HowItWorks'

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <NearbyPreview />
      <HowItWorks />
    </>
  )
}
