import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GlobalSolution = () => {
  const [globalSolution, setGlobalSolution] = useState(null);

  useEffect(() => {
    const fetchGlobalSolution = async () => {
      try {
        const response = await axios.get(`/api/content/types/globalsolution`, { withCredentials: true });
        const solutionData = response.data[0];

        if (solutionData) {
          const subsections = solutionData.subsections;

          // Fetch images for each language in the subsections
          const languagesWithImages = await Promise.all(
            subsections.map(async (language) => {
              try {
                const imageResponse = await axios.get(
                  `/api/image/download/${language.photo}`,
                  { responseType: 'blob' }
                );
                const imageUrl = URL.createObjectURL(imageResponse.data);
                return { ...language, imageUrl };
              } catch (error) {
                console.error("Error fetching image:", error);
                return { ...language, imageUrl: null };
              }
            })
          );

          // Set the state with the fetched and processed data
          setGlobalSolution({
            ...solutionData,
            subsections: languagesWithImages
          });
        }
      } catch (error) {
        console.error("Error fetching global solution data:", error);
      }
    };

    fetchGlobalSolution();
  }, []);

  if (!globalSolution) return null; 

  return (
    <section className="relative bg-[#333] overflow-hidden mt-5 ">
      {/* Shape Divider */}
      <div className="absolute inset-x-0 top-0 py-0">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current text-white"
            d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"
          />
        </svg>
      </div>

      {/* Content Section */}
      <div className="relative sm:pt-32 pt-24">
        <div className="container mx-auto py-12 sm:px-4 px-2 w-full sm:w-[67%]">
          <div className="text-center">
            <h2 className="sm:text-5xl text-3xl font-semibold mb-4 font-serif text-white">
              <span dangerouslySetInnerHTML={{ __html: globalSolution.heading }} />
            </h2>
            <p className="sm:text-lg text-base mb-8 text-white font-inter sm:pt-10 pt-7">
              <span dangerouslySetInnerHTML={{ __html: globalSolution.description }} />
            </p>
          </div>

          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:mt-32 mt-24">
            {globalSolution.subsections.map((language, index) => (
              <div key={index} className="text-center space-y-6">
                {language.imageUrl ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={language.imageUrl}
                    alt={language.photoAlt}
                    title={language.imgtitle}
                    className="md:w-28 md:h-28 w-24 h-24 mx-auto mb-2"
                  />
                ) : (
                  <div className="md:w-28 md:h-28 w-24 h-24 mx-auto mb-2 bg-gray-200" />
                )}
                <h3 className="md:text-xl text-md text-base font-semibold font-inter text-white">
                  {language.title}
                </h3>
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
};

export default GlobalSolution;
