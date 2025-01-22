import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const HowItWorks = () => {
  const [heroSection, setHeroSection] = useState(null); // Changed to null to handle loading state
  const [image, setImage] = useState(null); // State for the image data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [data,setData]=useState(null)
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract the slug from the URL
        const slug = location.pathname.split('/').filter(Boolean).pop();

        // Fetch both hero section and image data
        const [heroResponse, imageResponse] = await Promise.all([
          axios.get(`/api/heroSection/front/${slug}`, { withCredentials: true }),
          axios.get(`/api/homepage/getImage/${slug}`, { withCredentials: true })
        ]);

        // Set data in state
        setHeroSection(heroResponse.data);
        setImage(imageResponse.data.photo);
        setData(imageResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) {
    return null // Handle loading state
  }

  if (error) {
    return <div>{error}</div>; // Handle error state
  }

  if (!heroSection) {
    return <div>No data available</div>; // Handle case when no data is available
  }

  return (
    <>
      <section className="pt-32 bg-[#faf7f3]">
        <div className="container mx-auto text-center">
          <div className="flex justify-center items-center">
            <div className="hidden md:block flex-shrink-0 w-1/6"></div> {/* Placeholder div */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold flex-grow">
              {heroSection.heading.split(' ').map((word, index) => (
                <span key={index} className={index === heroSection.heading.split(' ').length - 1 ? 'text-[#f3ca0d]' : ''}>
                  {word}
                  {index !== heroSection.heading.split(' ').length - 1 && ' '}
                </span>
              ))}
            </h1>
            <div className="hidden md:block flex-shrink-0 w-1/6">
              {image && (
                <img 
                  src={`/api/logo/download/${image}`} 
                  alt={data.alt} 
                  title={data.imgtitle}
                  className="h-40 w-40 md:h-72 md:w-72 ml-8" 
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Add white space between sections */}
      <div className="my-4"></div>

      <div className="container mx-auto text-center bg-[#faf7f3]">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {heroSection.steps && heroSection.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3 mx-4 md:mx-10 p-2 w-full md:w-auto xl:flex-1">
              <div className="text-2xl bg-white border border-[#f3ca0d] rounded-full pl-4 pr-3 py-2 font-bold text-[#f3ca0d] mb-2">
                {step.number}
              </div>
              <div className="text-lg font-semibold">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HowItWorks;
