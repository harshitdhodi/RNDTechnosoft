import React, { useState, useEffect } from "react";
import axios from "axios";
import data from "../data/Bookacall.json"; // Adjust the path as needed
import { Link } from "react-router-dom";

export default function BookAcall() {
  const [call, setCall] = useState(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(`/api/content/types/bookcall`, {
          withCredentials: true,
        });
        const expertData = response.data;

        if (expertData.length > 0) {
          setCall(expertData[0]);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  if (!call) {
    return null;
  }

  return (
    <div className="relative bg-[#134C6C] text-white rounded-2xl py-10 px-6 lg:px-20 lg:flex flex-col lg:flex-row items-center justify-between mx-4 lg:mx-40 overflow-hidden mb-10  my-16">
      <div className="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-[#155376] rounded-t-full"></div>

      <div className="lg:w-1/2 mb-6 lg:mb-0 relative z-0">
        <h2
          className="text-3xl lg:text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: call.heading }}
        ></h2>
        <p
          className="mb-6 text-base lg:text-lg"
          dangerouslySetInnerHTML={{ __html: call.description }}
        ></p>
        <div className="flex flex-col md:flex-row">
        
            <Link to="/contact">
            <button
            
              className={`bg-[#f3ca0d] text-white py-2 px-6 rounded-lg mr-4 mb-4 lg:mb-0 font-bold`}
            >
              Get Started
            </button>
            </Link>
      
        </div>
      </div>

      <div className="lg:w-1/2 xl:flex justify-center xl:justify-end relative z-0 hidden lg:block">
        <img
          src={`/api/image/download/${call.photo[0]}`}
          alt={call.photoAlt}
          title={call.imgtitle}
          className="w-full h-auto max-w-[400px] mx-auto"
        />
      </div>
    </div>
  );
}
