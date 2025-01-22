import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from 'react-icons/io5';

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

  return <div className="flex text-yellow-300 text-3xl">{stars}</div>;
};

export default function HeroSection({ serviceGridRef }) {
  const [heroSection, setHeading] = useState("");
  const [rating, setRating] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading?pageType=testimonial', { withCredentials: true });
        const { heading } = response.data;
        setHeading(heading || '');
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await axios.get('/api/testimonial/getTestimonialRating', { withCredentials: true });
        const { averageRating } = response.data;
        // Ensure averageRating is a number
        setRating(Number(averageRating) || 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeadings();
    fetchRating();
  }, []);

  const scrollToServices = () => {
    if (serviceGridRef.current) {
      serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#333] flex flex-col items-center justify-center text-center pt-44 pb-16 p-6">
      <h2 className="text-white text-6xl md:text-4xl lg:text-7xl font-serif mb-3">
        {heroSection}
      </h2>
      {rating !== null && (
        <div className="mt-4 lg:flex items-center gap-4 font-bold ">
          <RatingStars rating={rating} />  <p className="text-white text-2xl mt-2">{rating.toFixed(1)} out of 5</p>
        </div>
      )}
    </div>
  );
}
