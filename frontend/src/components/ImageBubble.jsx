import React, { useEffect, useState } from "react";
import axios from "axios";

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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const ImageBubble = ({ homeHero }) => {
  const [photos, setPhotos] = useState([]);
  const { width } = useResize();

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("/api/homehero/leftphoto", {
          withCredentials: true,
        });

        console.log("Fetched Data:", response.data); // Debugging fetched data
        if (response.data && response.data.data) {
          setPhotos(response.data.data.map((photoObj) => photoObj.photo[0])); // Extracting image URLs
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, []);

  if (!homeHero || !homeHero.labels || !homeHero.smallCircles) {
    return null;
  }

  const labels = homeHero.labels.slice(0, 4);
  const smallCircles = homeHero.smallCircles;

  // Base positions for large screens
  const imagePositionsLarge = [
    { top: 35, left: 20, size: 6 },
    { top: 65, left: 45, size: 8 },
    { top: 42, left: 55, size: 5 },
    { top: 5, left: 44, size: 6 },
  ];

  const labelPositionsLarge = [
    { top: 20, left: 40, size: 6, color: "#000" },
    { top: 55, left: 10, size: 5, color: "#000" },
    { top: 50, left: 40, size: 5, color: "#000" },
    { top: 58, left: 75, size: 5, color: "#000" },
  ];

  const smallCirclePositionsLarge = [
    { top: 40, left: 50, size: 1.7, color: "#FF6347" },
    { top: 65, left: 30, size: 2.5, color: "#FFD700" },
    { top: 85, left: 70, size: 3, color: "#87CEEB" },
  ];

  // Scale positions dynamically based on screen width
  const scaleFactor = width >= 1440 ? 1 : width / 1440;

  const scalePositions = (positions) =>
    positions.map((pos) => ({
      ...pos,
      top: `${pos.top * scaleFactor}%`,
      left: `${pos.left * scaleFactor}%`,
      size: `${pos.size * scaleFactor}vw`,
    }));

  const scaledImagePositions = scalePositions(imagePositionsLarge);
  const scaledLabelPositions = scalePositions(labelPositionsLarge);
  const scaledSmallCirclePositions = scalePositions(smallCirclePositionsLarge);

  return (
    <div className="relative bg-[#F7F4EE] p-4 min-h-screen overflow-hidden">
      {/* Render Images */}
      {photos.map((photo, index) => {
        const position = scaledImagePositions[index];

        return position ? (
          <img
            key={index}
            src={photo}
            alt={`Staff ${index}`}
            className="absolute object-cointain rounded-full"
            style={{
              top: position.top,
              left: position.left,
              width: position.size,
              height: position.size,
            }}
            loading="lazy"
            onError={(e) => {
              console.error(`Image failed to load: ${photo}`);
              e.target.style.display = "none"; // Hide broken images
            }}
          />
        ) : null;
      })}

      {/* Render Labels */}
      {labels.map((label, index) => {
        const position = scaledLabelPositions[index];

        return position ? (
          <div
            key={index}
            className="absolute rounded-full text-white flex items-center justify-center text-[12px] font-poppins "
            style={{
              top: position.top,
              left: position.left,
              backgroundColor: label.color,
              padding: "0.5rem",
              width: position.size,
              height: position.size,
            }}
          >
            {label.label}
          </div>
        ) : null;
      })}

      {/* Render Small Circles */}
      {smallCircles.map((circle, index) => {
        const position = scaledSmallCirclePositions[index];

        return position ? (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              top: position.top,
              left: position.left,
              backgroundColor: circle.color,
              width: position.size,
              height: position.size,
            }}
          />
        ) : null;
      })}
    </div>
  );
};

export default ImageBubble;
