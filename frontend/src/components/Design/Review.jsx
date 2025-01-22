import React, { useEffect, useState } from "react";
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules"; // Import Autoplay module
import { useLocation } from "react-router-dom";

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

const Review = ({ serviceSlug }) => {
  const [reviews, setReviews] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `/api/testimonial/getTestimonialsHigh/${serviceSlug}`,
          { withCredentials: true }
        );
        const reviewData = response.data.data;
        setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    if (serviceSlug) {
      fetchReviews();
    }
  },[serviceSlug]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className=' bg-[#333333] lg:bg-[url("C:\new-rndtechnosoft-website\RND\src\assets\Testimonial.jpg")] bg-cover w-full  bg-no-repeat '>
      <div className="p-6 lg:p-10 mx-auto w-[80%]  mt-4">
        <Swiper
          spaceBetween={30}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay every 3 seconds
          speed={1000} // Smooth transition speed (in milliseconds)
          modules={[Autoplay, Navigation]} // Include the Autoplay module
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id}>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                <div className="flex justify-center lg:justify-end">
                  {review.photo ? (
                    <div>
                      <img
                        src={`/api/image/download/${review.photo}`} // Ensure the correct photo path
                        alt={`${review.alt}`}
                        title={`${review.title}`}
                        className="size-56 rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="">
                      <video
                        width="100%"
                        height="240"
                        controls
                        src={`/api/video/download/${review.video}`} // Ensure the correct video path
                        title={`${review.title}`}
                        alt={`${review.alt}`}
                        className="rounded-2xl"
                      ></video>
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-full items-center lg:items-start md:mr-12">
                  <RatingStars rating={review.rating} />
                  <p
                    className="mt-4 text-lg text-white text-center lg:text-left"
                    dangerouslySetInnerHTML={{ __html: review.testimony }}
                  ></p>
                  <div className="flex flex-col lg:flex-row lg:justify-between items-center lg:items-center mt-4 w-full">
                    <p className="text-lg font-semibold text-white">
                      {review.name}, {review.designation}
                    </p>
                    <NavLink
                      to="/all-reviews"
                      className="mt-2 text-white hover:underline lg:ml-4"
                    >
                      See all reviews →
                    </NavLink>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Review;
