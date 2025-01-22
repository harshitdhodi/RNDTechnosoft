import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import gsap from "gsap";



export default function CraftLeft() {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);
  const [service, setService] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = location.pathname.split('/').filter(Boolean).pop();
        const response = await axios.get(`/api/industiesDetails/front/${slug}`, { withCredentials: true });
        const data =
          response.data.data && response.data.data.length > 0
            ? response.data.data[1]
            : null;

        if (data) {
          setService(data);
          setVideoUrl(data.video ? `/api/video/download/${data.video}` : null);
        }
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

  // Use service data if available, otherwise fallback to static data
  const faqData = service ? service.questions : [];
  return (
    <div className="flex flex-col items-center">
  
      <div className="flex flex-col lg:flex-row-reverse  gap-10  lg:px-28  w-full">
     {/* Text Content for Large Screens */}
     <div className="w-full lg:w-1/2  px-4 flex flex-col justify-center order-1">
         {/* Render the heading only if service and heading are available */}
         {service?.heading && (
            <div dangerouslySetInnerHTML={{ __html: service.heading }}  className="text-4xl font-bold pb-6" />
          ) 
        }
          <p className="mt-4 text-lg pb-4 text-justify">
            {service?.description && (
              <div dangerouslySetInnerHTML={{ __html: service.description }} />
            )}
          </p>

          {faqData.map((faq, index) => (
            <div key={index} className="mb-2 sm:mb-4">
              <div
                className="flex justify-between items-center px-4 sm:px-7 md:px-10 lg:px-14 bg-[#f9f7f1] rounded-[20px] py-3 sm:py-4 lg:py-[17px] cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-inter font-medium">
                  {faq.question}
                </h3>
                <span className="text-lg sm:text-xl lg:text-2xl">
                  {openIndex === index ? (
                    <MdKeyboardArrowDown />
                  ) : (
                    <MdKeyboardArrowRight />
                  )}
                </span>
              </div>
              <div
                ref={(el) => (answerRefs.current[index] = el)}
                className={`overflow-hidden ${openIndex === index ? "block" : "hidden"}`}
              >
                <div className="p-3 sm:p-4 lg:p-5 px-8 sm:px-10 lg:px-12 font-inter text-sm sm:text-base lg:text-base text-justify">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center order-2">
          <div className="relative rounded-2xl border-[3px] m-10 overflow-hidden group transition-all duration-300">
            {videoUrl ? (
              <video 
                src={videoUrl}
                title={service.videotitle} // Provide the title attribute
                autoPlay
                muted
                loop
                className="w-[450px] h-[450px] rounded-2xl transition-all duration-300"
              />
            ) : (
              service ?.photo && service.photo.length > 0 && (
                <img
                  src={`/api/image/download/${service.photo[0]}`} // Display the first photo if video isn't available
                  alt="Service Image"
                  className="w-[450px] h-[450px] object-cover rounded-2xl"
                />
              )
            )}
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent m-10 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
