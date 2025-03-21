import React, { useEffect, useRef } from 'react';
import { useGetCombinedDataQuery } from '../redux/slices/homepageSlice';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import OurWorkComponent from '../components/OurWork';
import TrustedSection from '../components/BigCards';
import WeAreExpert from '../components/WeAreExpert';
import WhatYouGet from '../components/WhatYouGet';
import BookAcall from '../components/BookAcall';
import ServiceGrid from '../components/OurServices';
import GlobalSolution from '../components/GlobalSolution';
import Faq from '../components/Faq';
import StandardPackage from '../components/StandardPackage';
import PremiumTemplatesSection from '../components/PrimiumTemplateSection';
import { useDispatch } from 'react-redux';
export default function Homepage() {
  const serviceGridRef = useRef(null);
  const dispatch = useDispatch();
  // Fetch data using RTK Query
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetCombinedDataQuery();

console.log(data) 
useEffect(() => {
  if (data?.navigation) {
    dispatch(setNavData(data.navigation)); // Save navigation data to Redux
  }
}, [data, dispatch]);


  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Once data is available, render the components with the appropriate data
  return (
    <div>
      <HeroSection 
        serviceGridRef={serviceGridRef}
        heroData={data?.homehero} // Pass hero data
      />
      <Marquee 
        marqueeData={data?.homepage?.marquee} // Pass marquee data
      />
      <OurWorkComponent 
        ourWorkData={data?.homepage?.ourwork} // Pass our work data
      />
      <div ref={serviceGridRef}>
        <ServiceGrid 
          serviceData={data?.services?.categories} // Pass service categories
        />
      </div>
      <WeAreExpert expertData={data?.WeAreExpert} />
      <TrustedSection homecard1={data?.homecard1} homecard2 ={data?.homecard2}/>
      <WhatYouGet everyPlan = {data?.everyplan} />
      <StandardPackage packagesData = {data?.packages} />
      <Faq />
      <BookAcall />
      <PremiumTemplatesSection />
      <GlobalSolution globalData = {data?.globalsolution} />
    </div>
  );
}