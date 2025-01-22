import React, { useEffect, useState } from "react";
import axios from "axios";

const Companies = ({ serviceSlug }) => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photoType = "company"; 

        const response = await axios.get(
          `/api/serviceImages/front/${serviceSlug}/${photoType}`,
          { withCredentials: true }
        );
        
        // Check if the response has data
        if (response.data) {
          setCompanies(response.data);
        } else {
          setCompanies([]);  // Ensure empty array if no data
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setError("Failed to load companies.");
      }
    };

    if (serviceSlug) { // Only fetch if serviceSlug exists
      fetchData();
    }
  }, [serviceSlug]); // Only re-run when serviceSlug changes

  if (error) {
    return (
      <div className="text-center py-16 text-gray-600">
        <p>{error}</p>
      </div>
    );
  }

  if (!companies.length) {
    return null; // Or you can display a loading spinner or message here
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
              src={`/api/industryImages/download/${company.images}`} // Ensure the correct path
              alt={company.alt || "Company Image"}
              title={company.imgtitle || "Company Image Title"}
              className="object-cover w-full h-auto max-w-[120px] sm:max-w-[150px] lg:max-w-[180px]" // Responsive image sizing
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
