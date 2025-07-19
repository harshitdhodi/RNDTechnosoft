import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from 'react-icons/io5';



export default function TechBanner({ serviceGridRef ,pageType }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null)
  const [alt, setAlt] = useState("")
  const [imgTitle, setImgTitle] = useState("")
  const location = useLocation();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(`/api/pageHeading/heading?pageType=${pageType}`, { withCredentials: true });
        const { heading, subheading, photo, alt, imgTitle } = response.data;
        setHeading(heading || '');
        setsubHeading(subheading || '')
        setPhoto(photo || null);
        setAlt(alt || '');
        setImgTitle(imgTitle || '')
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
    <div className="relative ">
      <img src={`/api/logo/download/${photo}`} alt={alt} title={imgTitle} className="w-full h-[55vh] object-fill" />
      <div className="absolute  inset-0 bg-black bg-opacity-30 flex lg:items-start items-center lg:pl-32 justify-center flex-col gap-4 pt-16 md:pt-32 mx-auto">
        <h1 className="text-white font-semibold md:max-w-xl md:text-center xl:max-w-4xl text-4xl lg:text-left md:text-4xl capitalize">{heading}</h1>
        <p className="text-xl  md:max-w-2xl xl:w-[60%] md:text-center   xl:mb-7 md:text-lg text-white text-left lg:text-left">{subHeading}</p>
      </div>
    </div>
  );
}
