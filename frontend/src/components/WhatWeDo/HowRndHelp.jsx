import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function HowRndHelp() {
  const containerRef = useRef(null);
  const fadeInContainerRef = useRef(null);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [imgTitle, setImgTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [cards, setCards] = useState([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('/api/pageHeading/heading?pageType=howrndhelp', { withCredentials: true });
      const { heading, subheading, photo, alt, imgTitle } = response.data;
      setHeading(heading || '');
      setSubheading(subheading || '');
      setAlt(alt || '');
      setImgTitle(imgTitle || '');
      setExistingPhoto(photo);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
    
    // Check screen size on mount and window resize
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768); // 768px is typically md breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    axios.get('/api/card/getAllCards')
      .then((response) => setCards(response.data))
      .catch((error) => console.error('Error fetching cards:', error));
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return; // Don't set up animations on small screens

    const animationDelay = setTimeout(() => {
      const applyAnimation = (elements) => {
        elements.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30, scale: 0 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom 60%",
                scrub: true,
              },
            }
          );
        });
      };

      // Apply animations to both container sections
      const mainElements = containerRef.current.querySelectorAll(".fade-in");
      const cardElements = fadeInContainerRef.current.querySelectorAll(".fade-in");
      
      applyAnimation(mainElements);
      applyAnimation(cardElements);
    }, 3000);

    return () => clearTimeout(animationDelay);
  }, [isLargeScreen]);

  return (
    <div className="relative bg-[#1b1b1b] py-4 md:p-8">
      {/* Top SVG */}
      <div className="absolute inset-x-0 top-0">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current text-white"
            d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"
          />
        </svg>
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        className="flex flex-col mx-4 md:mx-20 lg:mx-40 md:flex-row items-center mt-12 md:mt-40 space-y-6 md:space-y-0 md:space-x-8"
      >
        <div className={`flex flex-col items-center md:w-2/3 space-y-4 ${isLargeScreen ? 'fade-in' : ''}`}>
          <h2 className="text-2xl md:text-5xl text-white font-serif font-bold">{heading}</h2>
          <p className="text-white text-lg md:text-xl">{subheading}</p>
        </div>
        <div className={`md:flex justify-center md:w-1/2 hidden ${isLargeScreen ? 'fade-in' : ''}`}>
          <img
            src={`/api/logo/download/${existingPhoto}`}
            alt={alt}
            title={imgTitle}
            className="w-32 h-32 md:w-52 md:h-52 max-w-sm md:max-w-md rounded-lg"
          />
        </div>
      </div>

      {/* Cards grid */}
      <div
        ref={fadeInContainerRef}
        className="grid lg:grid-cols-2 justify-center items-center gap-4 w-[80%] mx-auto mt-12 pb-20 my-20"
      >
        {cards.map((card, index) => (
          <div key={index} className="flex flex-col">
            <div className={`bg-white text-gray-900 p-6 md:p-12 rounded-3xl shadow-lg transition-transform duration-300 w-full h-full ${isLargeScreen ? 'fade-in' : ''}`}>
              <img src={`/api/icon/download/${card.icon}`} alt={card.title} className="h-12 w-12 mb-4" />
              <h3 className="text-xl md:text-3xl font-bold mb-4">{card.title}</h3>
              <div>
                {card.questionsAndAnswers.map((feature, i) => (
                  <div key={i} className="flex flex-col gap-3 mb-2">
                    <div className="flex items-center gap-2 justify-start">
                      <FaCheckCircle className="text-xl" />
                      <span className="text-lg md:text-xl font-bold" dangerouslySetInnerHTML={{ __html: feature.question }}></span>
                    </div>
                    <span className="pl-6" dangerouslySetInnerHTML={{ __html: feature.answer }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom SVG */}
      <div className="absolute inset-x-0 bottom-0">
        <svg
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            className="fill-current text-white"
            d="M421.9,93.5c22.6,2.5,51.5-0.4,75.5-5.3c23.6-4.9,70.9-23.5,100.5-35.7c75.8-32.2,133.7-44.5,192.6-49.7c23.6-2.1,48.7-3.5,103.4,2.5c54.7,6,106.2,25.6,106.2,25.6V100H0V69.7c0,0,72-32.6,158.4-30.5c39.2,0.7,92.8,6.7,134,22.4c21.2,8.1,52.2,18.2,79.7,24.2C399.3,92.1,411.6,92.5,421.9,93.5z"
          />
        </svg>
      </div>
    </div>
  );
}