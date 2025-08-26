import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Marquee = ({ speed = 30, marqueeData = [] }) => {
  const marqueeRef = useRef(null);

  // Duplicate marqueeData array to enable seamless looping
  const combinedServices = [...marqueeData, ...marqueeData, ...marqueeData, ...marqueeData];

  useEffect(() => {
    if (marqueeRef.current && marqueeData.length > 0) {
      const marqueeElement = marqueeRef.current;
      const totalWidth = marqueeElement.scrollWidth;

      // GSAP animation for infinite scrolling
      gsap.fromTo(
        marqueeElement,
        { x: 0 },
        {
          x: -totalWidth / 2, // Move left by half of its width
          duration: speed,
          repeat: -1,
          ease: 'linear',
          modifiers: {
            x: (x) => `${parseFloat(x) % totalWidth}px`, // Ensures smooth looping
          },
        }
      );
    }
  }, [combinedServices, speed, marqueeData]);

  return (
    <div className="bg-[#333] py-3 relative -z-10 overflow-hidden">
      <div ref={marqueeRef} className="flex space-x-10 whitespace-nowrap pb-2">
        {combinedServices.length > 0 ? (
          combinedServices.map((service, index) => (
            <span key={index} className="scrolling-text text-xl font-semibold text-white">
              {service} <span className="scroll-dot text-[#f3ca0d] text-3xl pl-8">●</span>
            </span>
          ))
        ) : (
          [...Array(5)].map((_, index) => (
            <span key={index} className="scrolling-text text-xl font-semibold text-gray-500 animate-pulse">
              Loading... <span className="scroll-dot text-gray-400 text-3xl pl-8">●</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default Marquee;
