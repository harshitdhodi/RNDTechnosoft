import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';

const Marquee = ({ speed = 30 }) => {
  const marqueeRef = useRef(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/homepage/marquee');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Duplicate services array to enable seamless looping
  const combinedServices = [...services, ...services,...services,...services];

  useEffect(() => {
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
        ease: 'linear', // Smooth transition
        modifiers: {
          x: (x) => `${parseFloat(x) % totalWidth}px`, // Ensures smooth looping
        },
      }
    );
  }, [combinedServices, speed]);

  return (
    <div className="bg-[#333] py-3 relative -z-10 overflow-hidden">
      <div ref={marqueeRef} className="flex space-x-10 whitespace-nowrap pb-2">
        {combinedServices.map((service, index) => (
          <span key={index} className="scrolling-text text-xl font-semibold text-white">
            {service} <span className="scroll-dot text-[#f3ca0d] text-3xl pl-8">●</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
