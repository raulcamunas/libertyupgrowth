'use client'

import FeaturesSection from './FeaturesSection'
import ShowcaseSnapSection from './ShowcaseSnapSection'
import ProcessSection from './ProcessSection'
import FAQSection from './FAQSection'
import Footer from './Footer'

export default function MainContentWrapper() {
  return (
    <div className="main-content-wrapper">
      <FeaturesSection />
      <ShowcaseSnapSection />
      <ProcessSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
