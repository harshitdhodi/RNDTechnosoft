import React,{useEffect,useState} from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios'

export default function () {
    const [heroSection, setHeroSection] = useState({});
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const location = useLocation();


    useEffect(() => {
        const fetchHeroSection = async () => {
          try {
            // Extract the last part of the URL
            const slug = location.pathname.split('/').filter(Boolean).pop();
    
            // Fetch data from the API using the slug
            const response = await axios.get(`/api/heroSection/front/${slug}`, { withCredentials: true });
            const heroData = response.data;
            setHeroSection(heroData);
    
            // Simulate loading delay of 2 seconds
            setTimeout(() => {
              setIsLoading(false); // Set loading to false after 2 seconds
            }, 2000);
          } catch (error) {
            console.error("Error fetching hero section:", error);
            setIsLoading(false); // Ensure loading state is false in case of error
          }
        };
    
        fetchHeroSection();
      }, [location]);

  return (
    <div className="bg-[#333333] my-16 flex flex-col items-center justify-center text-center  p-6 ">
      <p className="text-white text-base md:text-lg lg:text-xl xl:text-2xl ">
        {heroSection.subheading || "We create user-centric digital experiences"}
      </p>
    </div>
  )
}
