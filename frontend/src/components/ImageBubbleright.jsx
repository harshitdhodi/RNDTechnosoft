import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Custom hook to track window resize events
const useResize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const ImageBubbleRight = ({ homeHero }) => {
  const [photos, setPhotos] = useState([]);
  const { width } = useResize(); // Track screen width for responsiveness

  // Fetch photos from the server
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('/api/homehero/rightphoto', {
          withCredentials: true,
        });

        // Directly extract the image URLs
        const photoUrls = response.data.data.map((photoObj) => photoObj.photo[0]);
        setPhotos(photoUrls);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, []);

  if (!homeHero || !homeHero.labels || !homeHero.smallCircles) {
    return null;
  }

  const labels = homeHero.labels.slice(4, 9);
  const smallCircles = homeHero.smallCircles;

  // Large screen positions (used as a base for scaling)
  const baseWidth = 1440;
  const scaleFactor = width >= baseWidth ? 1 : width / baseWidth;

  const scalePositions = (positions) =>
    positions.map((pos) => ({
      ...pos,
      top: `${pos.top * scaleFactor}%`,
      right: `${pos.right * scaleFactor}%`,
      size: `${pos.size * scaleFactor}vw`,
    }));

  const scaledImagePositions = scalePositions([
    { top: 35, right: 20, size: 6 },
    { top: 65, right: 45, size: 8 },
    { top: 42, right: 55, size: 5 },
    { top: 5, right: 44, size: 6 },
  ]);

  const scaledLabelPositions = scalePositions([
    { top: 20, right: 40, size: 6, color: '#000' },
    { top: 55, right: 10, size: 5, color: '#000' },
    { top: 50, right: 40, size: 5, color: '#000' },
    { top: 58, right: 75, size: 5, color: '#000' },
  ]);

  const scaledSmallCirclePositions = scalePositions([
    { top: 40, right: 50, size: 1.7, color: '#FF6347' },
    { top: 65, right: 30, size: 2.5, color: '#FFD700' },
    { top: 85, right: 70, size: 3, color: '#87CEEB' },
  ]);

  return (
    <div className="relative bg-[#F7F4EE] p-4 min-h-screen overflow-hidden">
      {photos.map((photo, index) => {
        const position = scaledImagePositions[index];
        if (!position) return null;
        return (
          <img
            key={index}
            src={photo}
            alt={`Dynamic ${index}`}
            className="absolute"
            style={{
              top: position.top,
              right: position.right,
              width: position.size,
              height: position.size,
            }}
          />
        );
      })}
      {labels.map((label, index) => {
        const position = scaledLabelPositions[index];
        if (!position) return null;
        return (
          <div
            key={index}
            className="absolute rounded-full text-white flex items-center justify-center text-[12px] font-poppins "
            style={{
              top: position.top,
              right: position.right,
              backgroundColor: label.color,
              padding: '0.5rem',
              width: position.size,
              height: position.size,
            }}
          >
            {label.label}
          </div>
        );
      })}
      {smallCircles.map((circle, index) => {
        const position = scaledSmallCirclePositions[index];
        if (!position) return null;
        return (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              top: position.top,
              right: position.right,
              backgroundColor: circle.color,
              width: position.size,
              height: position.size,
            }}
          />
        );
      })}
    </div>
  );
};

export default ImageBubbleRight;
