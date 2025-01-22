import React, { useEffect, useState } from "react";
import { IoStarSharp, IoStarOutline, IoStarHalfSharp } from "react-icons/io5";
import axios from "axios";
import { Link } from "react-router-dom";


// Transformer function to map and structure home card data
function transformHomeCardData(homeCardData, ratingData) {
  return homeCardData.map((card) => {
    if (card.contentType === "homecard1") {
      return {
        heading: card.heading.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
        buttonText: card.subheading.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
        buttonLink: "/portfolios",
        imageSrc: `/api/image/download/${card.photo[0]}`, // Main image
        srcSet: card.subsections.length > 0 ? `/api/image/download/${card.subsections[0].photo} 1024w` : "", // Second image from subsection
        imageAlt: card.photoAlt?.[0] || "company logos",
        background: "bg-[#134C6C]",
        textColor: "text-white",
      };
    } else if (card.contentType === "homecard2") {
      return {
        heading: card.heading.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
        buttonText: card.subheading.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
        buttonLink: "/all-reviews",
        rating: ratingData.averageRating || "N/A", // Use provided rating or "N/A" as fallback
        reviewsAlt: card.photoAlt?.[0] || "reviews",
        personImages: `/api/image/download/${card.photo[0]}`,
        background: "bg-[#114038]",
        textColor: "text-white",
      };
    }
    return null;
  });
}

// RatingStars component to display star ratings
const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    if (i < Math.floor(rating)) {
      stars.push(<IoStarSharp key={i} />);
    } else if (i < rating) {
      stars.push(<IoStarHalfSharp key={i} />);
    } else {
      stars.push(<IoStarOutline key={i} />);
    }
  }

  return <div className="flex text-yellow-500">{stars}</div>;
};

const TrustedSection = () => {
  const [transformedData, setTransformedData] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Fetch all necessary data concurrently
    const fetchData = async () => {
      try {
        const [homeCard1Response, homeCard2Response, ratingResponse] = await Promise.all([
          axios.get("/api/content/types/homecard1", { withCredentials: true }),
          axios.get("/api/content/types/homecard2", { withCredentials: true }),
          axios.get("/api/testimonial/getTestimonialRating", { withCredentials: true }),
        ]);

        const homeCardData = [...homeCard1Response.data, ...homeCard2Response.data];
        const ratingData = ratingResponse.data;

        setRating(Number(ratingData.averageRating) || 0);

        // Transform data
        const transformed = transformHomeCardData(homeCardData, ratingData);
        setTransformedData(transformed);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!transformedData.length) return null;

  const [firstCard, secondCard] = transformedData;

  return (
    <div className="flex flex-wrap justify-center gap-8 p-4 md:p-8 relative mt-16 md:mt-20">
      {/* First Card */}
      {firstCard && (
        <div className={`relative rounded-lg w-full max-w-xl ${firstCard.background} p-4 md:p-8 h-auto flex flex-col`}>
          <div className="flex-grow flex flex-col md:justify-between justify-center ">
            <div className="flex flex-col md:flex-row md:justify-between justify-center items-center">
              <div className="md:pr-36 pl-3 flex flex-col">
                <h3 className={`text-2xl md:text-3xl font-bold pb-4 ${firstCard.textColor}`}>
                  {firstCard.heading}
                </h3>
                <Link
                  to={firstCard.buttonLink}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition duration-300 inline-block"
                >
                  {firstCard.buttonText}
                </Link>
              </div>
              <img
                src={firstCard.imageSrc}
                alt={firstCard.imageAlt}
                className="w-40 h-auto md:w-52 md:h-auto md:absolute md:-top-8 md:right-0 md:transform md:-translate-1/4"
              />
            </div>
            {firstCard.srcSet && (
              <div className="flex-grow flex items-center justify-center">
                <img
                  srcSet={firstCard.srcSet}
                  alt={firstCard.imageAlt}
                  className="mt-4 max-h-24" // Ensure the image doesn't grow too large
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Second Card */}
      {secondCard && (
        <div className={`relative rounded-lg w-full max-w-xl ${secondCard.background} p-4 md:p-8 h-auto flex flex-col`}>
          <div className="flex-grow flex flex-col justify-between"> 
            <div className="flex flex-col md:flex-row md:justify-between justify-center items-center">
              <div className="md:pr-52 pl-3 pb-4 ">
                <h3 className={`text-2xl md:text-3xl font-bold pb-4 ${secondCard.textColor}`}>
                  {secondCard.heading}
                </h3>
                <Link
                  href={secondCard.buttonLink}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition duration-300 inline-block"
                >
                  {secondCard.buttonText}
                </Link>
              </div>
              <img
                src={secondCard.personImages}
                alt={secondCard.reviewsAlt}
                className="w-40 h-auto md:w-52 md:h-auto md:absolute md:-top-8 md:right-0 md:transform md:-translate-1/4"
              />
            </div>
            <div className="text-md flex items-center justify-center md:justify-start font-bold text-white gap-2">
              <span>{secondCard.rating}</span>
              <RatingStars rating={secondCard.rating} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedSection;
