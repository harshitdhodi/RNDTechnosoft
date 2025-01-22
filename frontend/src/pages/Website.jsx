import React from "react";
import HeroSection from "../components/Websites/HeroSection";
import Review from "../components/Websites/Review";
import CraftLeft from "../components/Websites/CraftLeft";
import CraftRight from "../components/Websites/CraftRight";
import LatestProduct from "../components/Websites/LatestProduct";
import Companies from "../components/Websites/companies";
import WhyPartnerWithUs from "../components/Websites/WhyPatnerUs";
import FAQ from "../components/Faq";
import BookAcall from "../components/BookAcall";
import De from "../components/Websites/De";
import PricingSection from "../components/Websites/Packages";
import LatestBlog from "../components/LatestBlog";
import WeAreExpert from "../components/WeAreExpert";
import Logotypes from "../components/Websites/Logotype"
import Tagline from "../components/Websites/Tagline";
import ServiceSlider from "../components/Websites/ServiceSlider";

export default function Website() {
  return (
    <div>
      <HeroSection />
      <LatestProduct />
      <CraftRight />
      <CraftLeft />
      <ServiceSlider/>
      <Tagline/>
      <WeAreExpert />
      <Logotypes/>
      <Review />
      <Companies />
      <WhyPartnerWithUs />
      <PricingSection />
      <De />
      {/* <DesignProcess/> */}
      <FAQ />
      <BookAcall />
      <LatestBlog />
    </div>
  );
}
