import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Img } from "react-image"; // Import the react-image component

// Optional loading spinner component
const ImageLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full animate-pulse">
    <span className="text-xs text-gray-500">Loading...</span>
  </div>
);

export default function WeAreExpert() {
  const [experts, setExperts] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Pass undefined as slug if it's "about-us"
        const response = await axios.get(
          `/api/content/getToolsByServiceSlug?slug=${slug === "about-us" ? undefined : slug}`,
          { withCredentials: true }
        );

        if (!response.data?.data) {
          throw new Error("Invalid response format");
        }

        setHeading(response.data.data.heading || "Our Experts");
        setSubheading(response.data.data.subheading);
        
        // Directly set the experts with the photo IDs - no need to fetch the images separately
        setExperts(response.data.data.subsections || []);
      } catch (err) {
        console.error("Error fetching expert data:", err);
        setError("Failed to load experts data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
    
    // No need for cleanup since we're not creating object URLs anymore
  }, [slug]);

  if (loading) {
    return null;
  }

  if (!experts.length) {
    return null;
  }

  const renderExpertImage = (expert) => {
    if (!expert.photo) {
      return (
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
          <span className="text-xs text-gray-500">No image</span>
        </div>
      );
    }

    return (
      <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-full shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-lg">
        <Img
          src={`/api/image/download/${expert.photo}`}
          srcSet={`/api/image/download/${expert.photo}?w=100 100w, /api/image/download/${expert.photo}?w=200 200w, /api/image/download/${expert.photo}?w=300 300w`}
          sizes="(max-width: 768px) 100px, (max-width: 1024px) 200px, 300px"
          alt={expert.title || "Expert"}
          loader={<ImageLoader />}
          unloader={
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-xs text-gray-500">Failed to load</span>
            </div>
          }
          container={(children) => (
            <div className="w-full h-full">{children}</div>
          )}
          className="w-full h-full object-cover"
          decode={true}
          crossOrigin="anonymous"
          loading="lazy"
          fetchpriority="high"
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 my-16">
      <h2
        dangerouslySetInnerHTML={{ __html: heading }}
        className="capitalize text-3xl md:text-4xl lg:text-5xl font-serif text-center mt-8 md:mt-12"
      />
      <h2
        dangerouslySetInnerHTML={{ __html: subheading }}
        className="text-[20px] text-center mt-4 mb-12"
      />
      
      {/* Grid container with responsive gap and padding */}
      <div className="space-y-8 md:space-y-10">
        {/* Expert grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {experts.map((expert, index) => (
            <div key={`expert-${index}`} className="flex flex-col items-center">
              {renderExpertImage(expert)}
              {expert.title && (
                <p className="mt-2 text-center text-sm font-medium">{expert.title}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}