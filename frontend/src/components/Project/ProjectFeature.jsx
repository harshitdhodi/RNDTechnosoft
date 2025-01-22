import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Marquee from "./Marquee";

const ProjectFeatures = () => {
  const [heroSection, setHeroSection] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(
          "/api/pageHeading/heading?pageType=portfolio",
          { withCredentials: true }
        );
        const { heading, subheading } = response.data;
        setHeading(heading || "");
        setSubheading(subheading || "");
      } catch (error) {
        console.error(error);
      }
    };
    fetchHeadings();
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center py-32 md:pt-40  bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center mx-10 md:mx-35%">
        <h1 className="text-white text-3xl md:text-4xl lg:text-6xl font-serif mb-7">
          {heading}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-6">
          {subheading || "We create user-centric digital experiences"}
        </p>

        {/* <button className="relative mt-6 py-2 px-7 text-lg font-bold bg-[#f3ca0d] text-white rounded-3xl overflow-hidden group">
          <span className="absolute inset-0 bg-gradient-to-r from-[#f3ca0d] to-yellow-800 transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <span className="relative z-10">Get Started</span>
        </button> */}

        {/* <p className="mt-12 text-lg text-[#114038] font-inter font-medium">
          Designs commonly featured by
        </p> */}
      </div>
      {/* <div className="w-full mt-8">
        <Marquee />
      </div> */}
    </div>
  );
};

export default ProjectFeatures;
