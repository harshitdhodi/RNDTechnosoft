import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false); // Controls visibility for both button and progress bar
  const topElementRef = useRef(null);
  const progressRef = useRef(null);

  // Handle Visibility of Scroll-To-Top Button and Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300); // Show both elements after scrolling 100px down
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle Progress Bar Animation
  useEffect(() => {
    let progressTrigger;

    if (progressRef.current && isVisible) {
      progressTrigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom 30%",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress * 100;
          gsap.to(progressRef.current, { height: `${progress}%`, duration: 0.1 });
        },
      });
    }

    return () => {
      if (progressTrigger) {
        progressTrigger.kill();
      }
    };
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center">
      <div ref={topElementRef}></div> {/* Element to observe */}

      {/* Scroll Progress Bar */}
      {isVisible && (
        <div className="fixed left-24 bottom-20 h-12 w-0.5 bg-gray-300 hidden sm:block">
          <div
            ref={progressRef}
            className="bg-[#333] w-full h-0" // Progress bar
          ></div>
        </div>
      )}

      {/* Scroll-to-Top Button */}
      {isVisible && (
        <div className="fixed bottom-40 left-10 gap-3 hidden sm:block">
          <button
            onClick={scrollToTop}
            className="text-gray-700 p-3 rotate-90 font-bold text-md"
          >
            Scroll to top
          </button>
        </div>
      )}
    </div>
  );
};

export default ScrollToTop;
