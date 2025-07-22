import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function TechBanner({ serviceGridRef, pageType }) {
  const [heading, setHeading] = useState("");
  const [subHeading, setsubHeading] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [alt, setAlt] = useState("");
  const [imgTitle, setImgTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., axios.post)
    alert("Application submitted!");
    setShowModal(false);
  };

  return (
    <div className="relative">
      <img
        src={`/api/logo/download/${photo}`}
        alt={alt}
        title={imgTitle}
        className="w-full h-[55vh] object-fill"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center gap-4 px-4 py-30 xl:pt-12 text-center">
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
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-400 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Hire Us
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Hire Us</h2>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Tell us what you're looking for"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-black font-semibold py-2 rounded-md hover:bg-yellow-600 transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
