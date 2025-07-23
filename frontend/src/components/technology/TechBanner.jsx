import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TechBanner({ serviceGridRef, pageType }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
  }, []);

  const scrollToServices = () => {
    if (serviceGridRef.current) {
      serviceGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <img
        src={`/api/logo/download/${photo}`}
        alt={alt}
        title={imgTitle}
        className="w-full h-[55vh] object-fill"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center gap-4 px-4 pb-16 mt-14 xl:pt-24 text-center">
        <h1 className="text-white font-semibold text-4xl md:text-4xl capitalize md:max-w-xl xl:max-w-4xl">
          {heading}
        </h1>
        <p className="text-white text-lg md:text-xl md:max-w-2xl xl:w-[60%]">
          {subHeading}
        </p>
        <div className="flex gap-4 mt-4 flex-wrap justify-center">
          <a
            href="/contact"
            className="bg-yellow-400 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Get in Touch
          </a>
          <a
          href="/hire-talent"
            className="bg-yellow-400 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Hire Talent
          </a>
        </div>
      </div>
    </div>
  );
}