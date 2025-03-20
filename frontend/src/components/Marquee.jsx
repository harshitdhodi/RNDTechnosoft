import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';

const Marquee = ({ speed = 30 }) => {
  const marqueeRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/homepage/marquee');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchServices();
  }, []);

  // Duplicate services array to enable seamless looping
  const combinedServices = [...services, ...services, ...services, ...services];

  useEffect(() => {
    if (!loading) {
      const marqueeElement = marqueeRef.current;
      const totalWidth = marqueeElement.scrollWidth;

      // GSAP animation for infinite scrolling
      gsap.fromTo(
        marqueeElement,
        { x: 0 },
        {
          x: -totalWidth / 2, // Move the whole content left by half of its width
          duration: speed,
          repeat: -1,
          ease: 'linear',
          modifiers: {
            x: (x) => `${parseFloat(x) % totalWidth}px`, // Ensures smooth looping
          },
        }
      );
    }
  }, [combinedServices, speed, loading]);

  return (
    <div className="bg-[#333] py-3 relative -z-10 overflow-hidden">
      <div ref={marqueeRef} className="flex space-x-10 whitespace-nowrap pb-2">
        {loading
          ? [...Array(5)].map((_, index) => (
              <span key={index} className="scrolling-text text-xl font-semibold text-gray-500 animate-pulse">
                Loading... <span className="scroll-dot text-gray-400 text-3xl pl-8">●</span>
              </span>
            ))
          : combinedServices.map((service, index) => (
              <span key={index} className="scrolling-text text-xl font-semibold text-white">
                {service} <span className="scroll-dot text-[#f3ca0d] text-3xl pl-8">●</span>
              </span>
            ))}
      </div>
    </div>
  );
};

export default Marquee;
