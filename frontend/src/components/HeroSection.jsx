import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ReactTyped as Typed } from 'react-typed';
import gsap from 'gsap';
import wave from "../images/wave.svg";
import ImageBubble from './ImageBubble';
import ImageBubbleright from "../components/ImageBubbleright";

const HeroSection = ({ serviceGridRef }) => {
  const [homeHero, setHomeHero] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [dataFetched, setDataFetched] = useState(false); // State for tracking data fetch status

  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const textSectionRef = useRef(null);

  const scrollToServices = () => {
    if (serviceGridRef.current) {
      serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Fetch homeHero and photos data
    const fetchData = async () => {
      try {
        const homeHeroResponse = await axios.get('/api/homehero', { withCredentials: true });

        setHomeHero(homeHeroResponse.data[0]);  // Assuming you get an array, take the first item

        // Set dataFetched to true after all data is fetched
        setDataFetched(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataFetched) {
      // Run animations only after data is fetched
      gsap.fromTo(
        leftImageRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 }
      );
      gsap.fromTo(
        textSectionRef.current,
        { y: 200, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5 }
      );
      gsap.fromTo(
        rightImageRef.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 }
      );
    }
  }, [dataFetched]); // Trigger animations when dataFetched changes

  // Ensure homeHero and its nested objects are available before rendering
  if (!homeHero || !homeHero.heading || !homeHero.paragraph) {
    return null;
  }

  return (
    <div className="  bg-[#F7F4EE]">
      <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
        {/* Left Side Animated Photos */}
        <div className="xl:flex flex-col flex-1 hidden" ref={leftImageRef}>
          <ImageBubble photos={photos} homeHero={homeHero} />
        </div>

        {/* Middle Text Section */}
        <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0" ref={textSectionRef}>
          <h1 className="text-[27px] md:text-[50px] leading-[3rem] md:leading-[4rem] md:mb-5 text-center font-poppins font-semibold py-10  text-gray-700 ">
            {homeHero.heading.beforeHighlight}{' '}
            <Typed
              strings={homeHero.heading.highlightedWords}
              typeSpeed={100}
              backSpeed={60}
              loop
              className="pl-2 text-[#f3ca0d] font-bold"
            />{' '}
            <br />
            {homeHero.heading.afterHighlight}
            <span className="text-[#f3ca0d]">.</span>
          </h1>
          <p
            className="text-lg lg:text-xl text-black-600 pt-4 z-0 text-center font-poppins"
            dangerouslySetInnerHTML={{ __html: homeHero.paragraph.text }}
          />
          <button
            className="relative mt-6 py-2 px-7 text-lg font-bold bg-[#f3ca0d] text-white rounded-3xl overflow-hidden group"
            onClick={scrollToServices}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#f3ca0d] to-yellow-800 transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 font-poppins">See our services</span>
          </button>
        </div>

        {/* Right Side Animated Photos */}
        <div className="xl:flex flex-col flex-1 hidden" ref={rightImageRef}>
          <ImageBubbleright photos={photos} homeHero={homeHero} />
        </div>

        {/* Wave Image - visible only on smaller screens */}
        <img src={wave} alt="wave img" className='object-cover xl:hidden absolute bottom-0 w-full -z-10' />
      </div>
    </div>
  );
};

export default HeroSection;
