import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WhatYouGet() {
  const [plans, setPlans] = useState([]);
  const [heading, setHeading] = useState('');

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(`/api/content/types/everyplan`, { withCredentials: true });
        const expertData = response.data;
        setHeading(response.data[0].heading);

        if (expertData.length > 0) {
          const subsections = expertData[0].subsections;

          // Fetch images for each expert
          const expertsWithImages = await Promise.all(
            subsections.map(async (expert) => {
              try {
                const imageResponse = await axios.get(
                  `/api/image/download/${expert.photo}`,
                  { responseType: 'blob' }
                );
                const imageUrl = URL.createObjectURL(imageResponse.data);
                return { ...expert, imageUrl };
              } catch (error) {
                console.error("Error fetching image:", error);
                return { ...expert, imageUrl: null };
              }
            })
          );

          setPlans(expertsWithImages);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className='relative md:pt-56 pt-32 pb-10'>
      <div className="absolute top-0 left-0 right-0 w-full h-32 sm:h-48 rotate-180">
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
      <div className="relative md:pb-20">
        <div className="relative mx-auto  px-6 z-10 ">
          <h2 className=" text-4xl md:text-5xl font-serif text-center mb-16" dangerouslySetInnerHTML={{ __html: heading }}>
          </h2>
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <li key={index} className="flex flex-col items-center text-center">
                  <img
                    src={plan.imageUrl || 'path_to_default_image.jpg'}
                    alt={plan.photoAlt}
                    title={plan.imgtitle}
                    className="mb-6 lg:w-24 lg:h-24 w-28 h-28 object-contain"
                  />
                  <h3 className="text-xl font-semibold pb-3">{plan.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: plan.description }}></p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
