import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollSection = () => {
  const [homeAnimations, setHomeAnimations] = useState([]);
  const descriptionRefs = useRef([]);
  const videoRefs = useRef([]);
  const photoRefs = useRef([]);

  useEffect(() => {
    fetchHomeAnimations();
  }, []);

  const fetchHomeAnimations = async () => {
    try {
      const response = await axios.get("/api/home/getHomeAnimations");
      setHomeAnimations(response.data.data);
    } catch (error) {
      console.error("Error fetching home animations:", error);
    }
  };

  useEffect(() => {
    if (homeAnimations.length > 0) {
      setTimeout(() => {
        initializeAnimations();
      }, 1000); // Delay to ensure elements are rendered
    }
  }, [homeAnimations]);

  const initializeAnimations = () => {
    const descriptions = descriptionRefs.current;
    const videos = videoRefs.current;
    const photos = photoRefs.current;

    if (descriptions.length && videos.length && photos.length) {
      // Ensure initial styles are set
      setVideoStyles();
      setPhotoStyles();

      // Kill any existing ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Create new ScrollTriggers
      descriptions.forEach((desc, index) => {
        // Video ScrollTrigger
        ScrollTrigger.create({
          trigger: desc,
          start: "top 20%",
          end: () => "bottom 30%",
          scrub: true,
          onEnter: () => playVideo(index),
          onLeave: () => hideContent(index),
          onEnterBack: () => playVideo(index),
          onLeaveBack: () => hideContent(index),
        });

        // Photo ScrollTrigger
        ScrollTrigger.create({
          trigger: desc,
          start: "top 20%",
          end: () => `bottom 30%`,
          scrub: true,
          onEnter: () => animatePhoto(index),
          onLeave: () => hideContent(index),
          onEnterBack: () => animatePhoto(index),
          onLeaveBack: () => hideContent(index),
        });
      });

      // Refresh ScrollTrigger to ensure proper calculations
      ScrollTrigger.refresh();

      // Add resize listener
      window.addEventListener("resize", handleResize);
    }
  };

  const handleResize = () => {
    setVideoStyles();
    ScrollTrigger.refresh();
  };

  const setVideoStyles = () => {
    const screenWidth = window.innerWidth;
    let width, height;

    if (screenWidth < 768) {
      width = "0%";
      height = "0%";
    } else if (screenWidth < 1024) {
      width = "50%";
      height = "50%";
    } else {
      width = "25%";
      height = "50%";
    }

    videoRefs.current.forEach((video) => {
      gsap.set(video, {
        position: "fixed",
        top: "30%",
        right: "10%",
        width,
        height,
        zIndex: 10,
        objectFit: "cover",
        // opacity: 0,
        visibility: "hidden",
      });
    });
  };

  const setPhotoStyles = () => {
    photoRefs.current.forEach((photo) => {
      gsap.set(photo, {
        opacity: 0,
        scale: 1,
        position: "fixed",
        top: "50%",
        right: "10%",
        width: "10%",
        height: "30%",
        zIndex: 10,
        visibility: "hidden",
      });
    });
  };

  const playVideo = (index) => {
    const video = videoRefs.current[index];
  
    if (video) {
      video.play().catch((error) => console.log(`Play error for video ${index + 1}:`, error));
      gsap.to(video, {
        opacity: 1,
        visibility: "visible",
        duration: 0.5,
      });
    } else {
      console.warn(`No video element found for index ${index}`);
    }
  };
  

  const hideContent = (index) => {
    const video = videoRefs.current[index];
    const photo = photoRefs.current[index];

    if (video) {
      video.pause();
      gsap.to(video, {
        // opacity: 0,
        duration: 0.5,
        visibility:"hidden",
        onComplete: () => {
          gsap.set(video, { visibility: "hidden" });
        },
      });
    }

    if (photo) {
      gsap.to(photo, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(photo, { visibility: "hidden" });
        },
      });
    }
  };

  const animatePhoto = (index) => {
    const photo = photoRefs.current[index];

    gsap.set(photo, {
      opacity: 0,
      scale: 1,
      visibility: "visible",
    });

    gsap.fromTo(
      photo,
      {
        opacity: 1,
        x: getXInitial(index),
        y: getYInitial(index),
      },
      {
        opacity: 1,
        x: getXFinal(index),
        y: getYFinal(index),
        duration: 2,
        ease: "power2.out",
      }
    );
  };

  const getXInitial = (index) => {
    const values = ["400%", "600%", "300%", "100%"];
    return values[index] || "0%";
  };

  const getYInitial = (index) => {
    const values = ["-90%", "10%", "700%", "200%"];
    return values[index] || "0%";
  };

  const getXFinal = (index) => {
    const values = ["300%", "400%", "400%", "200%"];
    return values[index] || "0%";
  };

  const getYFinal = (index) => {
    const values = ["50%", "10%", "20%", "50%"];
    return values[index] || "0%";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-[#F7F4EE]">
      <div className="relative flex flex-col justify-center items-center lg:flex-row md:pb-32  md:w-[70%] mx-auto ">
        <div className="flex-1 p-4 box-border">
          {homeAnimations.map((animation, index) => (
            <div
              key={index}
              ref={(el) => (descriptionRefs.current[index] = el)}
              className={`description mb-1  ${index > 0 ? "pt-32 lg:pt-80" : ""}`}
            >
              <h2 className="text-2xl text-[#e4d500] pb-6">{animation.title}</h2>
              <h3 className="text-3xl lg:text-5xl font-semibold pb-6 text-black">{animation.subtitle}</h3>
              <p
                className="text-lg lg:text-2xl pb-6"
                dangerouslySetInnerHTML={{ __html: animation.description }}
              ></p>

              {animation.iconPhoto.map((icon, i) => (
                <div key={i} className="flex flex-col pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`bg-white px-2 py-2 rounded-full border flex-shrink-0 ${
                        i === 0 ? "border-[#e4d500]" : "border-red-400"
                      } shadow-lg`}
                    >
                      <img
                        src={`/api/image/download/${icon}`}
                        alt={`Icon for ${animation.iconTitle[i]}`}
                        className="h-8 w-8"
                      />
                    </span>
                    <p
                      className="text-lg lg:text-[22px]"
                      dangerouslySetInnerHTML={{ __html: animation.iconTitle[i] }}
                    />
                  </div>
                </div>
              ))}

              {index > 0 && (
                <div className="flex flex-col bg-white border border-gray-400 rounded-xl py-6 px-5 gap-3 mt-12 text-lg lg:text-xl">
                  <p
                    className="text-black"
                    dangerouslySetInnerHTML={{ __html: animation.paragraph }}
                  ></p>
                  <div className="flex gap-2 items-center">
                    <img
                      src={`/api/image/download/${animation.authPhoto}`}
                      alt={`${animation.author}'s photo`}
                      className="h-12 w-12 rounded-full shadow-md border border-white"
                    />
                    <p className="text-[18px] text-black">{animation.author}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-[40%] h-full relative bg-black justify-center items-center hidden lg:flex">
          {homeAnimations.map((animation, index) => (
            <React.Fragment key={index}>
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={`/api/image/download/${animation.video}`}
                muted
                loop
                className="w-full h-full object-cover rounded-lg"
                style={{
                  transform: index % 2 === 0 ? "rotate(4deg)" : "rotate(-4deg)",
                  transformOrigin: "center",
                  willChange: "transform",
                }}
              />
              <img
                ref={(el) => (photoRefs.current[index] = el)}
                src={`/api/image/download/${animation.photo}`}
                alt={`SVG for video ${index + 1}`}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] pointer-events-none"
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    
    </div>
  );
};

export default ScrollSection;
