import Compatibility from '@/components/compatibility'
import CTA from '@/components/CTA'
import { FAQ } from '@/components/faq'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import Header from '@/components/ui/navbar'
import React from 'react'

const page = () => {
  return (
    <div className=''>
     
      <Hero />
      <HowItWorks />
      <Compatibility/>
      <FAQ />
      <CTA/>
    </div>
  )
}

export default page
