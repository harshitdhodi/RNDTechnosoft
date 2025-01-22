import React from 'react'
import HeroSection from '../components/SocialMedia/HomeHero'
import Review from '../components/Design/Review'
import CraftRight from '../components/Design/CraftRight'
import ExpertiseComponent from '../components/WhatWeDo/Growth'
import HowRndHelp from '../components/WhatWeDo/HowRndHelp'
import Challenges from '../components/WhatWeDo/Challenges'
import Tagline from "../components/Design/Tagline"
import CraftLeft from '../components/Design/CraftLeft'
import LatestProduct from '../components/Websites/LatestProduct'
import IndustryServiceSlider from '../components/Design/IndustryServiceSlider'
import FAQ from '../components/Faq'
import Companies from "../components/Design/companies"

export default function SocialMedia() {
  return (
    <div>
      <HeroSection />
      <LatestProduct/>
      <CraftRight />
      <CraftLeft/>
      <IndustryServiceSlider/>
      <Companies/>
      <Tagline/>
      <Challenges />
      {/* <ExpertiseComponent/> */}
      <HowRndHelp />
      <FAQ/>


    </div>
  )
}
