import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; // Import slick-carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme
import axios from 'axios';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";




const TeamMembers = () => {
  const [challengesData, setChallenges] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`/api/content/types/challengesface`, { withCredentials: true });
        const challengesData = response.data;
        setChallenges(challengesData);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const CustomPrevArrow = (props) => (
    <div
        className=" flex absolute -left-2 md:-left-10 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] hover:bg-[#0f0f0f85] rounded-full h-8 w-8  justify-center items-center"
        onClick={props.onClick}
    >
        <IoIosArrowBack size={25} />
    </div>
);

const CustomNextArrow = (props) => (
    <div
        className="flex absolute -right-2  md:-right-10  top-1/2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-[#0f0f0f54] hover:bg-[#0f0f0f85]  rounded-full h-8 w-8  justify-center items-center"
        onClick={props.onClick}
    >
        <IoIosArrowForward size={25} />
    </div>
);
    // Slider settings
    const settings = {
      infinite: true,
      speed: 1000,
      slidesToShow: 4,
      slidesToScroll: 1,
      nextArrow: <CustomNextArrow />,
      prevArrow: <CustomPrevArrow />,
      responsive: [
          {
              breakpoint: 320,  // Small mobile screens
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,

              }
          },
          {
              breakpoint: 640,  // Medium mobile screens
              settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
              }
          },
          {
              breakpoint: 1024,  // Tablets and above
              settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  dots: true,  // Dots enabled for 1024px and above
              }
          },
          {
              breakpoint: 1440,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  dots: true,
              }
          },
          {
              breakpoint: 2760,
              settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  dots: true,
              }
          }
      ]
  };

  const renderHeading = (heading) => {
    return <div className="text-[30px] md:text-[50px] font-serif md:p-4 text-center flex flex-col flex-wrap" dangerouslySetInnerHTML={{ __html: heading }} />;
  };

  if (!dataLoaded || challengesData.length === 0) {
    return null;
  }

  return (
    <div className=" pt-16 pb-16 w-[90%] mx-auto">
        <>
          <div className=" mb-8  ">
            {renderHeading(challengesData[0]?.heading)}
          </div>
          <div className="relative text-white">
            <Slider {...settings}> {/* Implementing Slider */}
              {challengesData[0]?.questions.map((challenge, index) => (
                <div  key={index} className="px-4">
                  <div
                  className={`team-member flex-shrink-0 h-96 p-6 shadow-md rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-transform duration-300 hover:shadow-xl  relative`}
                >
                  <h2
                    className="text-[22px] md:text-2xl font-serif text-white font-bold mb-4 text-wrap text-center md:text-left  md:pb-10"
                    dangerouslySetInnerHTML={{ __html: challenge.question }}
                  />
                  <p
                    className="text-white text-wrap text-[14px] md:text-[16px] mt-2 text-center md:text-left"
                    dangerouslySetInnerHTML={{ __html: challenge.answer }}
                  />
                </div>
                </div>
              ))}
            </Slider>
          </div>
        </>
      
    </div>
  );
};

export default TeamMembers;
