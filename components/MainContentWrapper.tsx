'use client'

import FeaturesSection from './FeaturesSection'
import TestimonialsSection from './TestimonialsSection'
import ScrollSection from './ScrollSection'
import ProcessSection from './ProcessSection'
import FAQSection from './FAQSection'
import Footer from './Footer'

export default function MainContentWrapper() {
  return (
    <div className="main-content-wrapper">
      <FeaturesSection />
      <TestimonialsSection />
      <ScrollSection />
      <ProcessSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
