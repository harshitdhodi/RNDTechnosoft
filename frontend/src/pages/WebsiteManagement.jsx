import React from 'react'
import HeroSection from '../components/Design/HeroSection'
import Review from '../components/Design/Review'
import CraftRight from '../components/Design/CraftRight'
import CraftLeft from '../components/Websites/CraftLeft'
import LatestProduct from '../components/Design/LatestProduct'
import Companies from '../components/Design/companies'
import WebSolution from '../components/HowItWorks/WebSolutions'
import Packages from '../components/Design/Packages'
import DesignProcess from '../components/Design/DesignProcess'
import FAQ from '../components/Faq'
import BookAcall from '../components/BookAcall'

export default function WebsiteManagement() {
  return (
    <div>
        <HeroSection/>
        <Review/>
        <CraftRight/>
        <CraftLeft/>
        <LatestProduct/>
        <Companies/>
        <WebSolution/>
        <Packages/>
        <DesignProcess/>
        <FAQ/>
        <BookAcall/>
      
    </div>
  )
}
