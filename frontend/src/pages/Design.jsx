import React from 'react'
import HeroSection from '../components/Design/HeroSection'
import Review from '../components/Design/Review'
import GlobalSolution from '../components/GlobalSolution'
import Packages from '../components/Design/Packages'
import LatestBlog from '../components/Design/LatestBlog'
// import CraftRight from '../components/Design/CraftRight'
// import CraftLeft from '../components/Design/CraftLeft'
import LatestProduct from '../components/Design/LatestProduct'
import Companies from '../components/Design/companies'
// import WebSolution from '../components/HowItWorks/WebSolutions'
// import DesignProcess from '../components/Design/DesignProcess'
import FAQ from '../components/Design/Faq'
import BookAcall from '../components/BookAcall'
import PremiumTemplatesSection from '../components/PrimiumTemplateSection'

import { useState } from 'react'



export default function Design() {

  const [serviceSlug, setServiceSlug] = useState('');
console.log(serviceSlug)
  return (
    <div>
        <HeroSection/>
        <Packages setServiceSlug={setServiceSlug}/>
        <LatestProduct serviceSlug={serviceSlug}/> 
        <Review serviceSlug={serviceSlug}/>
        <Companies serviceSlug={serviceSlug}/>
        
        <BookAcall/>
        <PremiumTemplatesSection/>
        <FAQ serviceSlug={serviceSlug}/>
    <LatestBlog serviceSlug={serviceSlug}/>
        <GlobalSolution />
        
        {/* {/* <CraftRight/>
        <CraftLeft/> */}
       
       
        {/* <WebSolution/> */}
      
        {/* <DesignProcess/> */}
      
       
       
    </div>
  )
}
