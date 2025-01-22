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
    <div className="p-4 md:p-8">
      <div
        ref={containerRef}
        className="flex flex-col items-center mt-12 md:mt-24 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">
            {heading}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
           {subheading}
          </p>
        </div>
      </div>
      <div className="relative">
        <div
          ref={fadeInContainerRef}
          className="flex flex-col items-center space-y-6 mt-12 pb-20"
        >
          <div className="absolute inset-0  flex-col lg:left-10 xl:left-40  justify-items-start hidden lg:flex">
            <div className="w-1 bg-gray-300 progress-line" />
            {services.map((_, index) => {
              // Define top and bottom margin percentage (e.g., 10% space at top and bottom)
              const marginTop = 10;
              const marginBottom = 90;
              // Calculate the percentage for even spacing with margins
              const topPosition = `${
                marginTop +
                (index / (services.length - 1)) * (marginBottom - marginTop)
              }%`;

              return (
                <div
                  key={index}
                  className="absolute top-1/2  -left-4  transform -translate-y-1/2 bg-[#f3ca0d] text-white text-lg font-medium rounded-full w-10 h-10 flex items-center justify-center"
                  style={{ top: topPosition }}
                  id={`progress-number-${index}`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          {services.map((service, index) => (
            <div
              key={service._id}
              className="fade-in border border-lg border-black rounded-xl p-6 flex flex-col md:flex-row items-center space-x-0 md:space-x-6 bg-white shadow-lg transition-transform duration-300 hover:shadow-xl hover:scale-105 max-w-3xl mx-auto relative"
            >
              <img
                src={`/api/designProcess/download/${service.image}`}
                alt={service.alt}
                title={service.imgtitle}
                className="w-full h-52 md:w-52 md:h-52 rounded-md object-cover mb-4 md:mb-0"
              />
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {service.title}
                  </h3>
                  <span className="bg-[#f3ca0d] text-black text-xs font-medium px-3 py-1 rounded-full flex-shrink-0">
                    {" "}
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
  );
}
