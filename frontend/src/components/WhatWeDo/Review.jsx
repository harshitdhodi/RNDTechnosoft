import React, { useEffect, useState } from 'react';
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

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

const Review = () => {
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/testimonial/getTestimonialsHigh`, { withCredentials: true });
        const reviewData = response.data.data;
        setReview({
          videoUrl: reviewData.video,
          rating: reviewData.rating,
          text: reviewData.testimony,
          author: `${reviewData.name}, ${reviewData.designation}`
        });
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, []);

  if (!review) {
    return null
  }

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start p-6 lg:p-10 bg-[#333] mt-4 gap-10">
      <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
        <div className="w-full max-w-lg">
          <video
            width="100%"
            height="240"
            controls
            src={`/api/video/download/${review.videoUrl}`}  // Make sure to use the correct video path
            title="Testimonial video"
            className="rounded-2xl"
          ></video>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2 items-center lg:items-start">
        <RatingStars rating={review.rating} />
        <p className="mt-4 text-lg text-white text-center lg:text-left" dangerouslySetInnerHTML={{ __html: review.text }}></p>
        <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-center mt-4 w-full">
          <p className="text-lg font-semibold text-white">{review.author}</p>
          <NavLink to="/all-reviews" className="mt-2 text-white hover:underline lg:ml-4">
            See all reviews →
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Review;
