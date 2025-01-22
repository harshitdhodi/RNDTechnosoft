import React from 'react'
import HeroSection from '../components/Pricing/HeroSection'
import Review from '../components/WhatWeDo/Review'
import PricingSection from '../components/Pricing/AllPricing'
import WhyPartnerWithUs from '../components/Websites/WhyPatnerUs'
import Faq from '../components/Faq'
import BookAcall from '../components/BookAcall'

export default function Pricing() {
  return (
    <div>
    <HeroSection/>
    <Review/>
    <PricingSection/>
    <WhyPartnerWithUs/>
    <Faq/>
    <BookAcall/>

    </div>
  )
}
