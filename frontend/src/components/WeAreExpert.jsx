import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
          {
            withCredentials: true,
          }
        );

        if (!response.data?.data) {
          throw new Error("Invalid response format");
        }

        setHeading(response.data.data.heading || "Our Experts");
        setSubheading(response.data.data.subheading);

        const fetchedExperts = response.data.data.subsections || [];

        // Process images in parallel
        const expertsWithImages = await Promise.all(
          fetchedExperts.map(async (expert) => {
            if (!expert.photo) {
              return { ...expert, imageUrl: null };
            }

            try {
              const imageResponse = await axios.get(
                `/api/image/download/${expert.photo}`,
                {
                  responseType: "blob",
                  withCredentials: true,
                }
              );
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...expert, imageUrl };
            } catch (imageError) {
              console.error(`Error loading image for expert: ${expert.title}`, imageError);
              return { ...expert, imageUrl: null };
            }
          })
        );

        setExperts(expertsWithImages);
      } catch (err) {
        console.error("Error fetching expert data:", err);
        setError("Failed to load experts data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();

    // Cleanup function to revoke object URLs
    return () => {
      experts.forEach(expert => {
        if (expert.imageUrl) {
          URL.revokeObjectURL(expert.imageUrl);
        }
      });
    };
  }, [slug]);

  if (loading) {
    return (
      null
    );
  }

  

  if (!experts.length) {
    return (
      null
    );
  }

  const renderExpertImage = (expert) => (
    expert.imageUrl ? (
      <img
        src={expert.imageUrl}
        alt={expert.title || "Expert"}
        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-lg"
      />
    ) : (
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
        <span className="text-xs text-gray-500">No image</span>
      </div>
    )
  );

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
        {/* First row - 10 experts */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {experts.map((expert, index) => (
            <div key={`row1-${index}`} className="flex flex-col items-center">
              {renderExpertImage(expert)}
            </div>
          ))}
        </div>

        {/* Second row - 11 experts */}
        {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {experts.slice(10, 21).map((expert, index) => (
            <div key={`row2-${index}`} className="flex flex-col items-center">
              {renderExpertImage(expert)}
            </div>
          ))}
        </div> */}

        {/* Third row - 10 experts */}
        {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {experts.slice(21, 31).map((expert, index) => (
            <div key={`row3-${index}`} className="flex flex-col items-center">
              {renderExpertImage(expert)}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
