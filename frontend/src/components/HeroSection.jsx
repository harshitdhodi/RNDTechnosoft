import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import Skeleton from './Skeleton';
import ImageBubble from './ImageBubble';
import ImageBubbleright from './ImageBubbleright';

const CustomTextAnimation = lazy(() => import('./TextAnimation'));

const HeroSection = ({ serviceGridRef }) => {
  const [homeHero, setHomeHero] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animationLoaded, setAnimationLoaded] = useState(false); // New state to track animation load

  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const textSectionRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToServices = () => {
    if (serviceGridRef.current) {
      serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const preloadImages = (images) => {
    if (!images || images.length === 0) return Promise.resolve();
    const promises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const homeHeroResponse = await axios.get('/api/homehero', { withCredentials: true });
        const heroData = homeHeroResponse.data[0];
        setHomeHero(heroData);
        const imagesToPreload = [heroData.leftImage, heroData.rightImage];
        preloadImages(imagesToPreload).then(() => setPhotos(imagesToPreload));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(leftImageRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
      tl.fromTo(textSectionRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
      tl.fromTo(rightImageRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[#F7F4EE]">
        <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
          <Skeleton />
          <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0">
            <h1 className="text-[27px] md:text-[50px] leading-[3rem] md:leading-[4rem] md:mb-5 text-center font-poppins font-semibold py-10 text-gray-700">
              We Build Brand, Assets, Websites For Businesses Aiming for Success.
            </h1>
          </div>
          <Skeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F4EE]" ref={containerRef}>
      <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
        <div className="xl:flex flex-col flex-1 hidden" ref={leftImageRef}>
          <ImageBubble photos={photos} homeHero={homeHero} />
        </div>

        <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0" ref={textSectionRef}>
          <h1 className="text-[27px] md:text-[50px] leading-[3rem] md:leading-[4rem] md:mb-5 text-center font-poppins font-semibold py-10 text-gray-700">
            {homeHero.heading.beforeHighlight}{' '}
            <Suspense
              fallback={
                <span className="pl-2 text-[#f3ca0d] font-bold">
                  {homeHero.heading.highlightedWords[0]}
                </span>
              }
            >
              <CustomTextAnimation
                strings={homeHero.heading.highlightedWords}
                typeSpeed={100}
                backSpeed={60}
                loop
                className="pl-2 text-[#f3ca0d] font-bold"
                onLoad={() => setAnimationLoaded(true)} // Optional: if component supports a callback
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
        </div>

        <div className="xl:flex flex-col flex-1 hidden" ref={rightImageRef}>
          <ImageBubbleright photos={photos} homeHero={homeHero} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;