import React, { useEffect, useRef } from 'react';
import { useGetCombinedDataQuery } from '../redux/slices/homepageSlice';
import HeroSection from '../components/HeroSection';
import Marquee from '../components/Marquee';
import OurWorkComponent from '../components/OurWork';
import TrustedSection from '../components/BigCards';
import WeAreExpert from '../components/WeAreExpert';
import WhatYouGet from '../components/WhatYouGet';
import BookAcall from '../components/BookAcall';
// import ServiceGrid from '../components/OurServices';
import GlobalSolution from '../components/GlobalSolution';
import Faq from '../components/Faq';
import StandardPackage from '../components/StandardPackage';
import PremiumTemplatesSection from '../components/PrimiumTemplateSection';
import { useDispatch } from 'react-redux';
// import ServicesPage from '../components/Websites/ServicePage';
import GridLayout from '../components/Websites/GridLayout';
import HexGridDemo from '../components/hexagon/Grid';
import TechnologyList from '../components/HireTelent/TechnologyList';

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

  useEffect(() => {
    if (data?.navigation) {
      dispatch(setNavData(data.navigation)); // Save navigation data to Redux
    }
  }, [data, dispatch]);

  // Add meta tag dynamically
  useEffect(() => {
    const metaTag = document.createElement('meta');
    metaTag.name = 'google-site-verification';
    metaTag.content = 'VNlAtnMc5L2_z9_Vh3JDiyG8iXuEVPKzi7OoE473UDM';
    document.head.appendChild(metaTag);

    return () => {
      document.head.removeChild(metaTag); // Cleanup when component unmounts
    };
  }, []);

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
      <HeroSection serviceGridRef={serviceGridRef} heroData={data?.homehero} />
      <Marquee marqueeData={data?.homepage?.marquee} />
      <OurWorkComponent ourWorkData={data?.homepage?.ourwork} />
      <div ref={serviceGridRef}>
        {/* <ServiceGrid serviceData={data?.services?.categories} /> */}
        <GridLayout serviceData={data?.services?.categories}/>
      </div>
      {/* <HexGridDemo expertData={data?.WeAreExpert} /> */}
      {/* <div className='mt-10'>
        <TechnologyList/>
      </div> */}
      <TrustedSection homecard1={data?.homecard1} homecard2={data?.homecard2} />
      <WhatYouGet everyPlan={data?.everyplan} />
      {/* <StandardPackage packagesData={data?.packages} /> */}
      <Faq />
      <BookAcall />
      <PremiumTemplatesSection />
      {/* <GlobalSolution globalData={data?.globalsolution} /> */}
    </div>
  );
}
