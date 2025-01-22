import React from 'react'
import HeroSection from '../components/HowItWorks/HeroSection'
import ChooseSubscriptions from '../components/HowItWorks/ChooseSubscription'
import FastOnBording from '../components/HowItWorks/FastOnBording'
import UnlimitedRequests from '../components/HowItWorks/UnlimitedRequest'
import DownloadAssets from '../components/HowItWorks/DownloadAssests'
import WebSolution from '../components/HowItWorks/WebSolutions'
import WhatYouGet from '../components/WhatYouGet'
import BookAcall from '../components/BookAcall'

import GlobalSolution from '../components/GlobalSolution'



export default function HowItWorks() {
  return (
    <div>
    <HeroSection/>
    <ChooseSubscriptions/>
    <FastOnBording/>
    <UnlimitedRequests/>
    <DownloadAssets/>
    <WebSolution/>
    <WhatYouGet/>
   <BookAcall/>
   <GlobalSolution/>
 
    </div>
  )
}
