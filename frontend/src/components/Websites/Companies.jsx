import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug =   location.pathname.split("/").filter(Boolean).pop();
        const photoType = "company"; // Logic for filtering the photoType

        const response = await axios.get(
          `/api/serviceImages/front/${slug}/${photoType}`,
          { withCredentials: true }
        );
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchData();
  }, [location.pathname]);

  if(companies.length===0){
    return null;
  }
  
  return (
    <div className="mb-10">
      <div className="py-6 lg:pt-20 pt-5 px-4 mt-20 ">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-black font-medium text-center font-serif">
          Companies using this{" "}
          <span className="text-[#f3ca0d]">service</span>
        </h1>
      </div>
      <div className="py-6 mx-4 sm:mx-8 lg:mx-16 mt-8">
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {companies.map((company, index) => (
            <img
              key={index}
              src={`/api/serviceImages/download/${company.images}`} // Ensure the correct path
              alt={company.alt}
              title={company.imgtitle}
              className="object-cover w-full h-auto max-w-[120px] sm:max-w-[150px] lg:max-w-[180px]" // Responsive image sizing
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
