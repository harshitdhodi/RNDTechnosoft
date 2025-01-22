import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from 'react-icons/io5';



export default function HeroSection({ serviceGridRef }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null)
  const [alt, setAlt] = useState("")
  const [imgTitle, setImgTitle] = useState("")
  const location = useLocation();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading?pageType=aboutcompany', { withCredentials: true });
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
    <div className="relative">
      <img src={`/api/logo/download/${photo}`} alt={alt} title={imgTitle} className="w-full h-[55vh] object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col gap-8 pt-16 md:pt-32">
        <h1 className="text-white text-4xl md:text-7xl font-serif capitalize">{heading}</h1>
        <p className="text-xl md:text-2xl text-white text-center">{subHeading}</p>
      </div>
    </div>
  );
}
