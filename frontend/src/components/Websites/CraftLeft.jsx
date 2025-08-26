import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CraftLeft() {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);
  const [service, setService] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = location.pathname.split("/").filter(Boolean).pop();
        const response = await axios.get(`/api/serviceDetails/front/${slug}`, {
          withCredentials: true,
        });

<<<<<<< HEAD
=======
        // Ensure data exists and has the expected structure
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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

<<<<<<< HEAD
  if (!service) return null;

=======
  // If service data is not available, return null
  if (!service) {
    return null; // Or return a loading indicator if preferred
  }

  // Use service data
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  const faqData = service.questions || [];

  return (
    <div className="flex xl:flex-col items-center">
<<<<<<< HEAD
      {/* ✅ Inline CSS override */}
      <style>
        {`
          .faq-quill .ql-editor {
            font-size: 16px !important;
            line-height: 1.8 !important;
            color: #333 !important;
          }
          .faq-quill .ql-editor * {
            font-size: inherit !important;
            line-height: inherit !important;
          }
        `}
      </style>

      <div className="flex flex-col lg:flex-row-reverse gap-10 lg:px-28 w-full">
        {/* Left: Text */}
        <div className="w-full lg:w-[60%] px-4 flex flex-col justify-center order-1">
          {/* Heading */}
=======
      <div className="flex flex-col lg:flex-row-reverse gap-10 lg:px-28 w-full">
        {/* Text Content for Large Screens */}
        <div className="w-full lg:w-[60%] px-4 flex flex-col justify-center order-1">
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          <div className="max-w-full xl:pb-2 overflow-hidden">
            {service.heading ? (
              <div
                dangerouslySetInnerHTML={{ __html: service.heading }}
                className="text-4xl font-bold pb-6 break-words"
              />
            ) : (
              <h2 className="text-4xl font-bold pb-6">Default Heading</h2>
            )}
          </div>

<<<<<<< HEAD
          {/* Description */}
          <div className="mt-4 text-lg pb-4 text-justify">
            {service.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            ) : (
              "Easily manage your design projects with our convenient portal..."
            )}
          </div>

          {/* FAQs */}
          {faqData.map((faq, index) => (
            <div key={index} className="mb-2 sm:mb-4">
              {/* Question */}
=======
          <p className="mt-4 text-lg pb-4 text-justify">
            {service.description ? (
              <div dangerouslySetInnerHTML={{ __html: service.description }} />
            ) : (
              "Easily manage your design projects with our convenient portal. Provide important details like design briefs and backlogs, and add an unlimited number of design requests. Our talented designers will promptly get to work on fulfilling your requests, all while enjoying the ease and efficiency of managing your projects in one place."
            )}
          </p>

          {faqData.map((faq, index) => (
            <div key={index} className="mb-2 sm:mb-4">
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
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
<<<<<<< HEAD

              {/* Answer */}
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
              <div
                ref={(el) => (answerRefs.current[index] = el)}
                className={`overflow-hidden ${
                  openIndex === index ? "block" : "hidden"
                }`}
              >
<<<<<<< HEAD
                <div className="p-3 sm:p-4 lg:p-5 px-8 sm:px-10 lg:px-12 font-inter text-justify">
=======
                <div className="  list-decimal p-3 sm:p-4 lg:p-5 px-8 sm:px-10 lg:px-12 font-inter text-sm sm:text-base lg:text-base text-justify">
                  {/* <p dangerouslySetInnerHTML={{ __html: faq.answer }} /> */}
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  <ReactQuill
                    readOnly={true}
                    value={faq.answer}
                    modules={{ toolbar: false }}
                    theme="bubble"
<<<<<<< HEAD
                    className="faq-quill"
=======
                    className="quill text-sm"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Right: Video or Photo */}
=======
        {/* Video Content */}
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
        <div className="w-full lg:w-[40%] md:pr-20 lg:pr-0 2xl:w-1/2 flex items-center justify-center order-2">
          <div className="relative xl:-top-10 md:-top-10 lg:-top-16 rounded-2xl md:left-10 -top-10 border-[3px] m-10 overflow-hidden group transition-all duration-300">
            {videoUrl ? (
              <video
                src={videoUrl}
<<<<<<< HEAD
                title={service.videotitle}
=======
                title={service.videotitle} // Provide the title attribute
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                autoPlay
                muted
                loop
                className="sm:w-[450px] sm:h-[450px] rounded-2xl transition-all duration-300"
              />
            ) : (
              service.photo &&
              service.photo.length > 0 && (
                <img
<<<<<<< HEAD
                  src={`/api/image/download/${service.photo[0]}`}
                  alt="Service"
=======
                  src={`/api/image/download/${service.photo[0]}`} // Display the first photo if video isn't available
                  alt="Service Image"
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
                  className="w-[750px] h-[450px] sm:object-contain lg:object-fill md:object-fill md:h-auto rounded-2xl"
                />
              )
            )}
<<<<<<< HEAD
=======
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent m-10 transition-all duration-300"></div>
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
          </div>
        </div>
      </div>
    </div>
  );
}
