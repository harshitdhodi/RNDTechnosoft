import React,{useState,useEffect} from 'react';
import axios from 'axios'

const MainContent = () => {

  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=homeanimation', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  return (
    <main className="relative bg-white overflow-hidden">
      {/* SVG Background */}
      <div className="absolute top-0 left-0 right-0 w-full h-32 sm:h-48">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#F7F4EE"
            fillOpacity="1"
            d="M0,224L60,202.7C120,181,240,139,360,122.7C480,107,600,117,720,138.7C840,160,960,192,1080,202.7C1200,213,1320,203,1380,197.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className='bg-[#F7F4EE]'>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 mt-24 sm:mt-36 md:mt-48 md:text-center relative bg-[#F7F4EE] pb-14 pt-10">
          <h1 className="text-[34px] md:text-[50px] font-serif mb-6">
            {heading}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed md:mx-8 text-justify">
            {subheading}
          </p>
        </div>
      </div>

    </main>
  );
};

export default MainContent;
