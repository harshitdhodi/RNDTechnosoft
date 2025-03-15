import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import wave from "../images/wave.svg";

// Lazy load components
const ReactTyped = lazy(() => import('react-typed').then(module => ({ default: module.ReactTyped })));
const ImageBubble = lazy(() => import('./ImageBubble'));
const ImageBubbleright = lazy(() => import("./ImageBubbleright"));

// Skeleton components
const SkeletonText = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded-md w-3/4 mx-auto mb-4"></div>
    <div className="h-10 bg-gray-200 rounded-md w-2/4 mx-auto mb-8"></div>
    <div className="h-4 bg-gray-200 rounded-md w-5/6 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-4/6 mx-auto mb-2"></div>
    <div className="h-4 bg-gray-200 rounded-md w-5/6 mx-auto mb-6"></div>
    <div className="h-10 bg-gray-200 rounded-md w-40 mx-auto"></div>
  </div>
);

const SkeletonImage = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-40 bg-gray-200 rounded-lg w-4/5 mx-auto"></div>
    <div className="h-40 bg-gray-200 rounded-lg w-4/5 mx-auto"></div>
  </div>
);

const HeroSection = ({ serviceGridRef }) => {
  const [homeHero, setHomeHero] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const textSectionRef = useRef(null);

  const scrollToServices = () => {
    if (serviceGridRef.current) {
      serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Preload critical data
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const homeHeroResponse = await axios.get('/api/homehero', { 
          withCredentials: true,
          signal: controller.signal
        });

        if (homeHeroResponse.data && homeHeroResponse.data.length > 0) {
          setHomeHero(homeHeroResponse.data[0]);
        }
        
        setDataFetched(true);
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Clean up function
    return () => {
      controller.abort();
    };
  }, []);

  // Animations only after data is loaded
  useEffect(() => {
    if (dataFetched && !loading) {
      const animateElements = () => {
        if (leftImageRef.current && textSectionRef.current && rightImageRef.current) {
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
      };
      
      // Use requestIdleCallback for non-critical animations
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(animateElements);
      } else {
        setTimeout(animateElements, 100);
      }
    }
  }, [dataFetched, loading]);

  return (
    <div className="bg-[#F7F4EE]">
      <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
        {/* Left Side */}
        <div className="xl:flex flex-col flex-1 hidden" ref={leftImageRef}>
          {loading ? (
            <SkeletonImage />
          ) : (
            <Suspense fallback={<SkeletonImage />}>
              <ImageBubble photos={photos} homeHero={homeHero} />
            </Suspense>
          )}
        </div>

        {/* Middle Text Section */}
        <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0" ref={textSectionRef}>
          {loading || !homeHero ? (
            <SkeletonText />
          ) : (
            <>
              <h1 className="text-[27px] md:text-[50px] leading-[3rem] md:leading-[4rem] md:mb-5 text-center font-poppins font-semibold py-10 text-gray-700">
                {homeHero.heading.beforeHighlight}{' '}
                <Suspense fallback={<span className="pl-2 text-[#f3ca0d] font-bold">Loading...</span>}>
                  <ReactTyped
                    strings={homeHero.heading.highlightedWords}
                    typeSpeed={100}
                    backSpeed={60}
                    loop
                    className="pl-2 text-[#f3ca0d] font-bold"
                  />
                </Suspense>{' '}
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
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="xl:flex flex-col flex-1 hidden" ref={rightImageRef}>
          {loading ? (
            <SkeletonImage />
          ) : (
            <Suspense fallback={<SkeletonImage />}>
              <ImageBubbleright photos={photos} homeHero={homeHero} />
            </Suspense>
          )}
        </div>

        {/* Wave Image - visible only on smaller screens */}
        <img 
          src={wave} 
          alt="wave" 
          className="object-cover xl:hidden absolute bottom-0 w-full -z-10"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default HeroSection;