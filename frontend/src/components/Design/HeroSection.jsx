import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function HeroSection() {
  const [heroSection, setHeroSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        // Extract the last part of the URL
        const slug = location.pathname.split('/').filter(Boolean).pop();

        // Fetch data from the API using the slug
        const response = await axios.get(`/api/packages/heading/${slug}`, { withCredentials: true });
        const heroData = response.data;
        setHeroSection(heroData);
      } catch (error) {
        console.error("Error fetching hero section:", error);
      }
    };

    fetchHeroSection();
  }, [location]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center text-center pt-44 pb-16 p-6">
      <h1 className="text-white text-[30px] md:text-[40px] xl:text-[50px] font-serif mb-4">
        {heroSection.categoryName || "Website"}
      </h1>
      <h2 className='text-gray-300 text-xl'>
      Discover the Perfect Solution for Your Business Growth with Our Tailored Packages
      </h2>
    </div>
  );
}
