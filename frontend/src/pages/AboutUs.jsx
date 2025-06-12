import React from 'react'
import HeroSection from '../components/AboutUs/HeroSection'
import WebSolution from '../components/AboutUs/FounderLetter'
import OurValues from '../components/AboutUs/OurValues'
import BookAcall from '../components/BookAcall'
import WeAreExpert from '../components/WeAreExpert'
import GlobalSolution from '../components/GlobalSolution'
import ExpertiseComponent from '../components/WhatWeDo/Growth';
import { useGetCombinedDataQuery } from '../redux/slices/homepageSlice';
import HexGridDemo from '../components/hexagon/Grid'
export default function AboutUs() {
    const { 
      data, 
      isLoading, 
      isError, 
      error 
    } = useGetCombinedDataQuery();
    // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
        <HeroSection pageType={"aboutcompany"}/>
        <WebSolution/>
        <OurValues/>
        <ExpertiseComponent/>
        <BookAcall/>
       {/* <HexGridDemo expertData={data?.WeAreExpert} /> */}
        {/* <GlobalSolution globalData={data?.globalsolution}/> */}
        
    </div>
  )
}
