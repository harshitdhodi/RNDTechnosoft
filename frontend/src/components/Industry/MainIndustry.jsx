import React from 'react'
import FinTechServices from './IndustryService'
import Home from './FeatureService'
import TechBanner from '../technology/TechBanner'
import IndustryInfo from './IndustryInfo'
import CaseStudy from './CaseStudy'
import Review from '../Websites/Review'

const MainIndustry = () => {
  return (
    <div>
        <TechBanner pageType={"technology"}/>
       <IndustryInfo />
        <Home />
      <FinTechServices />
      <CaseStudy/>  
      <Review />
    </div>
  )
}

export default MainIndustry
