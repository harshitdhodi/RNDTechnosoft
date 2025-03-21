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

          // Process each subsection
          const expertsWithMedia = subsections.map((expert) => {
            const isVideo = expert.photo;
            return {
              ...expert,
              mediaUrl: isVideo ? expert.photo : null, // Assign as video
            };
          });

          setPlans(expertsWithMedia);
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
      <div className="relative md:pb-20">
        <div className="relative mx-auto px-6 z-10">
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-16" dangerouslySetInnerHTML={{ __html: heading }}></h2>
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <li key={index} className="flex flex-col items-center text-center">
                  {plan.mediaUrl ? (
                    <video
                      src={plan.mediaUrl}
                      muted
                      autoPlay
                      loop
                      loading="lazy"
                      className="mb-6 lg:w-24 lg:h-24 w-28 h-28 object-contain"
                    />
                  ) : (
                    <p>No video available</p>
                  )}
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
