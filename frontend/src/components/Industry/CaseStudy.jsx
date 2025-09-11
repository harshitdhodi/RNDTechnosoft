import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CaseStudy = () => {
  const { slug } = useParams();
  const [caseStudyData, setCaseStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/caseStudy/category/${slug}`);

        // ✅ FIX: extract correct array
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // ✅ Find the case-studies type
        const casestudiesData = data.find(
          (item) => item.type === "case-studies"
        ) || null;
console.log(casestudiesData)
        setCaseStudyData(casestudiesData);
      } catch (err) {
        console.error("Error fetching case study:", err.response || err.message);
        setError(
          `Failed to load case study: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [slug]);

  return (
 <>
  {/* Section Header */}
  <div className="max-w-6xl mx-auto text-center py-6 px-4">
    {caseStudyData && (
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Case Studies
      </h2>
    )}
  </div>

  {/* Case Study Section */}
  <div className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 bg-white">
    {/* Error Message */}
    {error && (
      <div className="text-red-500 mb-4 p-3 bg-red-100 rounded-md text-center">
        {error}
      </div>
    )}

    {/* Loading Spinner */}
    {isLoading && (
      <div className="text-center py-6 flex flex-col items-center">
        <svg
          className="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="mt-2 text-sm">Loading...</span>
      </div>
    )}

    {/* Case Study Cards */}
    {!isLoading && !error && (
      <div className="space-y-12">
        {caseStudyData?.card?.length > 0 ? (
          caseStudyData.card.map((card, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10 mb-10"
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 flex justify-center">
                {card.photo ? (
                  <div className="relative w-full max-w-[600px] aspect-[16/9]">
                    <img
                      src={`/api/logo/download/${card.photo}`}
                      alt={card.altName || card.title || `Case Study Image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-md">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="w-full md:w-1/2 space-y-3 text-center md:text-left px-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {card.title || "Untitled"}
                </h3>
                <div
                  className="text-base sm:text-lg text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: card.details || "<p>No details provided.</p>",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Case Studies Available
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're currently working on adding new case studies. Please check back later for updates!
            </p>
          </div>
        )}
      </div>
    )}
  </div>
</>

  );
};

export default CaseStudy;
