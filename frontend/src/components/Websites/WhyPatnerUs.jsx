import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Wave3 from '../../images/Wave3.svg';

const WhyPartnerWithUs = () => {
  const [webSolutionData, setWebSolutionData] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/content/types/whyPartnerus', { withCredentials: true });
        const data = response.data[0];
        setWebSolutionData(data);
        if (data.video) {
          setVideoUrl(`/api/image/download/${data.video}`);
        }
      } catch (error) {
        console.error('Error fetching web solution data:', error);
      }
    };

    fetchData();
  }, []);

  if (!webSolutionData) {
    return null;
  }

  return (
    <div>
      <div className="relative">
        <img
          src={Wave3}
          alt="background"
          className="w-full h-auto transform rotate-180"
        />
      </div>

      <section className="relative bg-[#333] overflow-hidden py-12 md:py-16 lg:py-20">
        {/* Content Section */}
        <div className="flex flex-col md:flex-row justify-between items-start p-6 mx-4 sm:mx-10 md:mx-16 lg:mx-20 text-white">
          <div className="md:w-[60%]">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 font-playfair"
              dangerouslySetInnerHTML={{ __html: webSolutionData.heading }}
            />
            <p
              className="text-base sm:text-lg lg:text-xl mb-4 font-inter pt-6 lg:pt-8"
              dangerouslySetInnerHTML={{ __html: webSolutionData.description }}
            />
          </div>
          <div className="md:w-[40%] flex justify-center">
            <img
              src={`/api/image/download/${webSolutionData.photo[0]}`}
              alt={webSolutionData.photoAlt}
              title={webSolutionData.imgtitle}
              className="w-40 h-40 mt-6 md:mt-0 hidden md:block"
            />
          </div>
        </div>

        {/* Subsections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 p-6 mx-4 sm:mx-10 md:mx-16 lg:mx-20 text-white">
          {webSolutionData.subsections.map((subsection, index) => (
            <div key={index} className="flex items-start">
              <img
                src={`/api/image/download/${subsection.photo}`}
                alt={subsection.photoAlt}
                title={subsection.imgtitle}
                className="h-10 w-10 mr-4"
              />
              <div className="flex flex-col">
                <h3 className="text-xl sm:text-2xl font-bold font-inter mb-2">{subsection.title}</h3>
                <p
                  className="text-base sm:text-lg md:text-left"
                  dangerouslySetInnerHTML={{ __html: subsection.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhyPartnerWithUs;
