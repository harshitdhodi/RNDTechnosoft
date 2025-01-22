import React from 'react'
import HeroSection from '../components/AboutUs/HeroSection'
import WebSolution from '../components/AboutUs/FounderLetter'
import OurValues from '../components/AboutUs/OurValues'
import BookAcall from '../components/BookAcall'
import WeAreExpert from '../components/WeAreExpert'
import GlobalSolution from '../components/GlobalSolution'
import ExpertiseComponent from '../components/WhatWeDo/Growth';

export default function AboutUs() {
  return (
    <div>
        <HeroSection/>
        <WebSolution/>
        <OurValues/>
        <ExpertiseComponent/>
        <BookAcall/>
        <WeAreExpert/>
        <GlobalSolution/>
        
    </div>
  )
}
