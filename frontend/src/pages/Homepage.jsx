import React, { useRef } from 'react';
import HeroSection from '../components/HeroSection'
import Marquee from '../components/Marquee'
import OurWorkComponent from '../components/OurWork'
import TrustedSection from '../components/BigCards'
import WeAreExpert from '../components/WeAreExpert'
import ScrollSection from '../components/FirstAnimantion'
import WhatYouGet from '../components/WhatYouGet'
import BookAcall from '../components/BookAcall'
import ServiceGrid from '../components/OurServices'
// import Footer from '../components/Footer'
import GlobalSolution from '../components/GlobalSolution'
import Faq from '../components/Faq'
import StandardPackage from "../components/StandardPackage"

import PremiumTemplatesSection from '../components/PrimiumTemplateSection'
import MainContent from '../components/AboveAnimation'

export default function Homepage() {
  const serviceGridRef = useRef(null);
  return (

    <div>
      <HeroSection serviceGridRef={serviceGridRef} />
      <Marquee />
      <OurWorkComponent />
      <div ref={serviceGridRef}>
        <ServiceGrid />
      </div>
      <WeAreExpert />
      <TrustedSection />
      {/* <MainContent /> */}
      {/* <ScrollSection /> */}
      <WhatYouGet />
      <StandardPackage/>
      <Faq />
      <BookAcall />
      <PremiumTemplatesSection />
      <GlobalSolution />


    </div>
  )
}
