import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import axios from "axios";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

export default function HowRndHelp() {
  const containerRef = useRef(null);
  const fadeInContainerRef = useRef(null);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [services, setServices] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = location.pathname.split("/").filter(Boolean).pop();
        const response = await axios.get(`/api/designProcess/front/${slug}`, {
          withCredentials: true,
        });
        const data = response.data.data;
        setServices(data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    const fetchHeadings = async () => {
      try {
        const response = await axios.get(
          "/api/pageHeading/heading?pageType=designProcess",
          { withCredentials: true }
        );
        const { heading, subheading } = response.data;
        setHeading(heading || "");
        setSubheading(subheading || "");
      } catch (error) {
        console.error(error);
        notify("Failed to fetch headings.");
      }
    };

    fetchData();
    fetchHeadings();
  }, [location.pathname]);

  useEffect(() => {
    let ctx;

    // Delay the animation setup by 3 seconds
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const fadeInElements =
          fadeInContainerRef.current.querySelectorAll(".fade-in");

        fadeInElements.forEach((el, index) => {
          gsap.set(el, { opacity: 0, y: 50 }); // Set initial state

          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 60%",
              delay: 1,
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(`#progress-number-${index}`, {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.fromTo(
          ".progress-line",
          { height: "0%" },
          {
            height: "100%",
            duration: 1,
            ease: "none",
            scrollTrigger: {
              trigger: fadeInContainerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      }, fadeInContainerRef);
    }, 3000); // 3-second delay

    return () => {
      clearTimeout(timer);
      if (ctx) {
        ctx.revert(); // This will kill all animations and ScrollTriggers created in this context
      }
    };
  }, [services]);

  return (
    <div className="px-4 md:px-8 relative md:-top-9">
      <div
        ref={containerRef}
        className="flex flex-col items-center mt-12 md:mt-24 space-y-6"
      >
        <div className="text-justify xl:text-center xl:max-w-5xl lg:max-w-6xl lg:px-8 mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
            {heading}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 xl:max-w-3xl  mx-auto">
           {subheading}
          </p>
        </div>
      </div>
      <div className="relative">
        <div
          ref={fadeInContainerRef}
          className="flex flex-col items-center space-y-6 mt-12 "
        >
          {/* Responsive Progress Line Container */}
          <div className="absolute inset-0 flex-col lg:hidden justify-items-start hidden xl:flex lg:left-6 xl:left-10 2xl:left-28">
            {/* Responsive Progress Line */}
            <div className="w-0.5 lg:w-1 xl:w-1.5  bg-gray-300 progress-line" />
            
            {/* Responsive Progress Numbers */}
            {services.map((_, index) => {
              const marginTop = 10;
              const marginBottom = 90;
              const topPosition = `${
                marginTop +
                (index / (services.length - 1)) * (marginBottom - marginTop)
              }%`;

              return (
                <div
                  key={index}
                  className="absolute top-1/2 transform -translate-y-1/2  bg-[#f3ca0d] text-white font-medium rounded-full flex items-center justify-center
                           -left-4 w-6 h-6 text-xs
                           lg:-left-6 lg:w-8 lg:h-8 lg:text-sm
                           xl:-left-4 xl:w-10 xl:h-10 xl:text-base 
                           2xl:-left-4 2xl:w-10 2xl:h-10 2xl:text-lg"
                  style={{ top: topPosition }}
                  id={`progress-number-${index}`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {/* Service Cards with Responsive Positioning and Increased Width */}
      <div className="xl:pl-24  ">
            {services.map((service, index) => (
            <div
              key={service._id}
              className="fade-in border border-lg rounded-xl p-6  flex flex-col md:flex-row items-center space-x-0 md:space-x-6 bg-white shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105 relative
                         max-w-full sm:max-w-xl mb-10 md:max-w-2xl
                         lg:max-w-4xl 
                         xl:max-w-5xl xl:ml-20 
                         2xl:max-w-5xl 2xl:ml-48"
            >
              <img
                src={`/api/designProcess/download/${service.image}`}
                alt={service.alt}
                title={service.imgtitle}
                className="w-full h-52 md:w-52 md:h-52  rounded-md object-cover mb-4 md:mb-0"
              />
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {service.title}
                  </h3>
                  <span className="bg-[#f3ca0d] text-black text-xs font-medium px-3 py-1 rounded-full flex-shrink-0">
                    Step {index + 1}
                  </span>
                </div>
                <p className="text-md md:text-xl text-black mb-2">
                  {service.subheading}
                </p>
                <p className="text-sm md:text-md text-black">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
      </div>
        </div>
      </div>
    </div>
  );
}