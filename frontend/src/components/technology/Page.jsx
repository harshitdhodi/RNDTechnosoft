import React from 'react'
import WhyChooseSection from './WhyChoose'
import HireDevelopersSection from './HireDeveloperSectio'
import TechBanner from './TechBanner'
import ExpertiseComponent from '../WhatWeDo/Growth'
import Review from '../Websites/Review'
import ServicesLanding from './Application'

const TechnologyPage = () => {
  return (
    <div>
      <TechBanner pageType={"technology"}/>
      <ServicesLanding />
      <WhyChooseSection />
      <ExpertiseComponent />
      <HireDevelopersSection />
      <Review />
    </div>
  )
}

export default TechnologyPage
