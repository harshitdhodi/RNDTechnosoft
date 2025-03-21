import React from "react";
import { IoStarSharp, IoStarOutline, IoStarHalfSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

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

const TrustedSection = ({ homecard1, homecard2 }) => {
  if (!homecard1?.length || !homecard2?.length) return null;

  // Extract first homecard1 and homecard2 objects
  const firstCard = homecard1[0];
  const secondCard = homecard2[0];

  return (
    <div className="flex flex-wrap justify-center gap-8 p-4 md:p-8 relative mt-16 md:mt-20">
      {/* First Card */}
      {firstCard && (
        <div className="relative rounded-lg w-full max-w-xl bg-[#134C6C] p-4 md:p-8 h-auto flex flex-col text-white">
          <div className="flex-grow flex flex-col md:justify-between justify-center">
            <div className="flex flex-col md:flex-row md:justify-between justify-center items-center">
              <div className="md:pr-36 pl-3 flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold pb-4" dangerouslySetInnerHTML={{ __html: firstCard.heading }} />
                <Link
                  to="/portfolios"
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition duration-300 inline-block"
                >
                  Explore
                </Link>
              </div>
              {firstCard.photo?.[0] && (
                <img
                  src={firstCard.photo[0]}
                  alt={firstCard.photoAlt?.[0] || "company logos"}
                  loading="lazy"
                  className="w-40 h-auto md:w-52 md:h-auto md:absolute md:-top-8 md:right-0 md:transform md:-translate-1/4"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Second Card */}
      {secondCard && (
        <div className="relative rounded-lg w-full max-w-xl bg-[#114038] p-4 md:p-8 h-auto flex flex-col text-white">
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:justify-between justify-center items-center">
              <div className="md:pr-52 pl-3 pb-4">
                <h3 className="text-2xl md:text-3xl font-bold pb-4" dangerouslySetInnerHTML={{ __html: secondCard.heading }} />
                <Link
                  to="/all-reviews"
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition duration-300 inline-block"
                >
                  View Testimonials
                </Link>
              </div>
              {secondCard.photo?.[0] && (
                <img
                  src={secondCard.photo[0]}
                  alt={secondCard.photoAlt?.[0] || "reviews"}
                  loading="lazy"
                  className="w-40 h-auto md:w-52 md:h-auto md:absolute md:-top-8 md:right-0 md:transform md:-translate-1/4"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedSection;
