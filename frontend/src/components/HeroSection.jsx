import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import Skeleton from './Skeleton';
import ImageBubble from './ImageBubble';
import ImageBubbleright from './ImageBubbleright';
import CustomTextAnimation from './TextAnimation';

// Default content to render immediately
const defaultContent = {
  heading: {
    beforeHighlight: "We Build Brand, Assets, Websites For",
    highlightedWords: ["Businesses"],
    afterHighlight: "Aiming for Success"
  },
  paragraph: { text: "Dream it, and we'll design it! Our web development and design services come in…" }
};

const HeroSection = ({ serviceGridRef }) => {
  const [homeHero, setHomeHero] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFallbackContent, setShowFallbackContent] = useState(true);

  const leftImageRef = useRef(null);
  const rightImageRef = useRef(null);
  const textSectionRef = useRef(null);
  const containerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Split data fetching from rendering
  useEffect(() => {
    // Start with fallback content showing
    setShowFallbackContent(true);
    
    // Set timeout to ensure fallback content stays visible if API is slow
    const timeoutId = setTimeout(() => {
      setIsContentLoading(false);
    }, 300); // Show fallback content for at least 300ms
  
    const fetchData = async () => {
      try {
        const homeHeroResponse = await axios.get('/api/homehero', { withCredentials: true });
        const heroData = homeHeroResponse.data[0];
        
        // Set the API data
        setHomeHero(heroData);
        
        // Only switch to API content after a minimum display time for fallback
        setTimeout(() => {
          setShowFallbackContent(false);
          setIsContentLoading(false);
        }, 300);
  
        // Preload images separately in background
        const imagesToPreload = [heroData.leftImage, heroData.rightImage];
        preloadImages(imagesToPreload).then(() => {
          setPhotos(imagesToPreload);
          setAreImagesLoaded(true);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsContentLoading(false);
      }
    };
    
    fetchData();
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Apply animations after content is loaded
  useEffect(() => {
    if (areImagesLoaded && containerRef.current && !isMobile) {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(leftImageRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
      tl.fromTo(textSectionRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
      tl.fromTo(rightImageRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
    } else if (areImagesLoaded && isMobile) {
      // For mobile, just make elements visible without animation
      if (leftImageRef.current) gsap.set(leftImageRef.current, { opacity: 1 });
      if (textSectionRef.current) gsap.set(textSectionRef.current, { opacity: 1 });
      if (rightImageRef.current) gsap.set(rightImageRef.current, { opacity: 1 });
    }
  }, [areImagesLoaded, isMobile]);

  const renderHeading = () => {
    // Use either API data or fallback based on showFallbackContent
    const heading = (!showFallbackContent && homeHero?.heading) || defaultContent.heading;
    return (
      <>
        {heading.beforeHighlight}{' '}
        <CustomTextAnimation
          strings={heading.highlightedWords}
          typeSpeed={100}
          backSpeed={60}
          loop
          className="pl-2 text-[#f3ca0d] font-bold"
        />{' '}
        <br />
        {heading.afterHighlight}
        <span className="text-[#f3ca0d]">.</span>
      </>
    );
  };
  
  // For the paragraph:
  const renderParagraph = () => {
    return (!showFallbackContent && homeHero?.paragraph?.text) || defaultContent.paragraph.text;
  };
  
  // For the image bubbles:
  {!isContentLoading && 
    <ImageBubble photos={photos} homeHero={!showFallbackContent ? homeHero : defaultContent} />
  }

  // Render content immediately with fallback
  return (
    <div className="bg-[#F7F4EE]" ref={containerRef}>
      <div className="flex flex-col xl:flex-row justify-center text-center lg:py-5 relative">
        <div className="xl:flex flex-col flex-1 hidden" ref={leftImageRef} style={isMobile ? { opacity: 1 } : {}}>
          {!isContentLoading && <ImageBubble photos={photos} homeHero={homeHero || defaultContent} />}
          {isContentLoading && <Skeleton />}
        </div>

        <div className="flex-2 flex flex-col items-center justify-center max-w-2xl pb-5 pt-10 xl:pt-32 mx-auto px-4 md:px-0" ref={textSectionRef} style={isMobile ? { opacity: 1 } : {}}>
          <h1 className="text-[27px] md:text-[50px] leading-[3rem] md:leading-[4rem] md:mb-5 text-center font-poppins font-semibold pt-10 pb-4 sm:py-10 text-gray-700">
            {renderHeading()}
          </h1>
          <p
            className="text-lg lg:text-xl text-black-600 sm:pt-4 z-0 text-center font-poppins"
            dangerouslySetInnerHTML={{ __html: renderParagraph() }}
          />
          <button
            className="relative mt-6 py-2 px-7 text-lg font-bold bg-[#f3ca0d] text-white rounded-3xl overflow-hidden group"
            onClick={scrollToServices}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#f3ca0d] to-yellow-800 transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 font-poppins">See our services</span>
          </button>
        </div>

        <div className="xl:flex flex-col flex-1 hidden" ref={rightImageRef} style={isMobile ? { opacity: 1 } : {}}>
          {!isContentLoading && <ImageBubbleright photos={photos} homeHero={homeHero || defaultContent} />}
          {isContentLoading && <Skeleton />}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;