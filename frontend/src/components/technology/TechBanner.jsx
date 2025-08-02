import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobApplicationModal from '../HireTelent/JobApplicationmodal'; // Import the modal component

export default function TechBanner({ serviceGridRef, pageType }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  // const location = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(`/api/pageHeading/heading?pageType=${pageType}`, {
          withCredentials: true,
        });
        const { heading, subheading, photo, alt, imgTitle } = response.data;
        setHeading(heading || "");
        setsubHeading(subheading || "");
        setPhoto(photo || null);
        setAlt(alt || "");
        setImgTitle(imgTitle || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeadings();
  }, [pageType]);

  // const scrollToServices = () => {
  //   if (serviceGridRef.current) {
  //     serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="relative w-full min-h-[70vh]">
      <img
        src={`/api/logo/download/${photo}`} 
        alt={alt}
        title={imgTitle}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-4 
                      pt-24 sm:pt-28 md:pt-32 xl:pt-36 2xl:pt-40 pb-12 sm:pb-16 xl:pb-20 text-center">
        
        <h1 className="text-white font-semibold text-3xl md:text-4xl max-w-3xl leading-tight">
          {heading}
        </h1>

        <p className="text-white mt-3 text-base sm:text-lg md:text-xl max-w-xl md:max-w-2xl xl:max-w-3xl text-justify lg:text-center">
          {subHeading}
        </p>

        <div className="flex gap-3 sm:gap-4 mt-4 flex-wrap justify-center">
          <a
            href="/contact"
            className="btn-yellow"
          >
            Get in Touch
          </a>
          <button
            onClick={handleOpenModal}
            className="btn-yellow"
          >
            Hire Talent
          </button>
        </div>
  </div>

  <JobApplicationModal
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    job={{ jobtitle: "General Application" }}
  />
</div>

  );
}