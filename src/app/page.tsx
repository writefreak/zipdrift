import Compatibility from '@/components/compatibility'
import { FAQ } from '@/components/faq'
import Footer from '@/components/footer'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import Header from '@/components/ui/navbar'
import React from 'react'

const page = () => {
  return (
    <div className=''>
      <Header/>
      <Hero />
      <HowItWorks />
      <Compatibility/>
      <FAQ />
      <Footer/>
    </div>
  )
}

export default page
