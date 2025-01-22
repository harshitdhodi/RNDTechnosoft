import React, { useState, useRef, useEffect } from "react";
import linksvg from "../../images/link.svg";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { gsap } from "gsap";
import axios from 'axios';
import { useLocation } from 'react-router-dom';


export default function FastOnBording() {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);
  const [service, setService] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = location.pathname.split('/').filter(Boolean).pop();
        const response = await axios.get(`/api/serviceDetails/front/${slug}`, { withCredentials: true });
        const data = response.data.data[0]; // Access the first item in the data array
        setService(data);
        setVideoUrl(`/api/video/download/${data.video}`);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchData();
  }, [location.pathname]);

  useEffect(() => {
    if (openIndex !== null) {
      gsap.fromTo(
        answerRefs.current[openIndex],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3, ease: "power1.out" }
      );
    }
  }, [openIndex]);

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      gsap.to(answerRefs.current[openIndex], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => setOpenIndex(null),
      });
    } else {
      setOpenIndex(index);
    }
  };


  // Define an array of colors
  const colors = ["bg-[#003b31]", "bg-[#f3bc6c]", "bg-[#f55f42]", "bg-[#333]"];

  // Use service data if available, otherwise fallback to static data
  const faqData = service ? service.questions : [];
  return (
    <div className="flex flex-col items-center">

      <div className="flex flex-col lg:flex-row  gap-10  lg:px-28  w-full">
        {/* Text Content for Large Screens */}
        <div className="w-full lg:w-1/2 px-4 flex flex-col justify-center order-1">

          {/* Render the heading only if service and heading are available */}
          {service?.heading ? (
            <div dangerouslySetInnerHTML={{ __html: service.heading }} className="text-4xl font-bold pb-6" />
          ) : (
            <h2>Default Heading</h2> // Provide a default heading if needed
          )}

          <p className="mt-4 text-lg pb-4">
            {service?.description ? (
              <div dangerouslySetInnerHTML={{ __html: service.description }} />
            ) : (
              "Easily manage your design projects with our convenient portal. Provide important details like design briefs and backlogs, and add an unlimited number of design requests. Our talented designers will promptly get to work on fulfilling your requests, all while enjoying the ease and efficiency of managing your projects in one place."
            )}
          </p>
          {/* Render Questions with Different Colors */}
          {service && (
            <div className="mt-8 space-y-4">
              {service.questions.map((item, index) => (
                <button
                  key={item._id}
                  className={`block w-full p-2 text-white text-lg font-bold rounded-2xl ${colors[index % colors.length]}`}
                >
                  {item.question}
                </button>
              ))}
            </div>
          )}
        </div>



        {/* video */}
        <div className="w-full lg:w-1/2 flex items-center justify-center order-2">
          <div className="relative rounded-2xl bg-[#003b31] m-10 overflow-hidden group transition-all duration-300">
            <div className="transition-transform transform group-hover:scale-105 group-hover:translate-x-1 group-hover:translate-y-1">
              <video
                src={videoUrl}
                title={service?.videotitle} // Provide the title attribute
                autoPlay
                muted
                loop
                className="w-full h-auto rounded-2xl transition-all duration-300"
              />
              {/* Visually hidden text for screen readers to mimic alt text */}
              {service?.altVideo && (
                <span className="sr-only">{service.altVideo}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent m-10 transition-all duration-300"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
