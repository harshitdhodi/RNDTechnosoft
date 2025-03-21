import React from "react";
import { useParams } from "react-router-dom";
import { Img } from "react-image"; // Import the react-image component

// Optional loading spinner component
const ImageLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full animate-pulse">
    <span className="text-xs text-gray-500">Loading...</span>
  </div>
);

export default function WeAreExpert({ expertData }) {
  const { slug } = useParams();
  console.log(expertData);

  // Ensure expertData is an array and extract the first item
  const data = Array.isArray(expertData) && expertData.length > 0 ? expertData[0] : {};

  const heading = data?.heading || "Our Experts";
  const subheading = data?.subheading || "";
  const experts = data?.subsections || [];

  if (!experts.length) {
    return null;
  }

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

      <div className="space-y-8 md:space-y-10">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {experts.map((expert, index) => (
            <div key={`expert-${index}`} className="flex flex-col items-center">
              <img
                src={`/api/image/download/${expert.photo}`}
                alt={expert.title || "Expert"}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-md object-cover"
              />
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

