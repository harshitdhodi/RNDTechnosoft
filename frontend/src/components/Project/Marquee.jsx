import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';

const Marquee = ({ speed = 30 }) => {
  const [images, setImages] = useState([]);
  const marqueeRefs = useRef(null);

  useEffect(() => {
    // Fetch images from the API
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/serviceImages/companyImages');
        setImages(response.data.data.map((image) => image.images)); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const marqueeElement = marqueeRefs.current;

      // Clone images for smooth, continuous scrolling
      const imagesClone = [...marqueeElement.children].map((child) => child.cloneNode(true));
      imagesClone.forEach((clone) => marqueeElement.appendChild(clone));

      // Calculate total width for scrolling
      const totalWidth = Array.from(marqueeElement.children).reduce((total, item) => total + item.offsetWidth, 0);

      // GSAP animation for continuous scrolling
      gsap.to(marqueeElement, {
        x: -totalWidth / 2,
        duration: speed,
        repeat: -1,
        ease: 'linear',
        onRepeat: () => {
          gsap.set(marqueeElement, { x: 0 });
        },
      });
    }
  }, [images, speed]);

  return (
    <div className="relative overflow-hidden py-3 w-full">
      <div ref={marqueeRefs} className="flex space-x-10 whitespace-nowrap">
        {images.map((image, index) => (
          <img
            key={`api-image-${index}`}
            src={`/api/serviceImages/download/${image}`}
            alt={`API Image ${index + 1}`}
            className="h-12 md:h-8 lg:h-5 mx-4 inline-block"
          />
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#F7F4EE] to-transparent"></div>
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#F7F4EE] to-transparent"></div>
    </div>
  );
};

export default Marquee;
