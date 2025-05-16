import React, { useState } from "react";
import { useParams } from "react-router-dom";

// Utility to extract inner HTML of <h2> tag and preserve styling
const parseHeadingHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  const h2 = div.querySelector("h2");
  if (h2) {
    // Return the inner HTML of the <h2> tag (includes <span>, <strong>, etc.)
    return h2.innerHTML;
  }
  // Fallback: return the input HTML (could be plain text or other tags)
  return html;
};

export default function WeAreExpert({ expertData }) {
  const { slug } = useParams();
  const data = Array.isArray(expertData) && expertData.length > 0 ? expertData[0] : {};
  const heading = data?.heading || "Our Experts";
  const subheading = data?.subheading || "";
  const experts = data?.subsections || [];

  const categories = [...new Set(experts.map(expert => expert.serviceparentCategoryId))];
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredExperts =
    selectedCategory === "all"
      ? experts
      : experts.filter(expert => expert.serviceparentCategoryId === selectedCategory);

  if (!experts.length) return null;

  // Define four custom rows
  let rowsToRender = [];

  if (selectedCategory === "all") {
    rowsToRender = [
      filteredExperts.slice(0, 6),
      filteredExperts.slice(6, 13),
      filteredExperts.slice(13, 19),
      filteredExperts.slice(19, 26),
    ];
  } else {
    for (let i = 0; i < filteredExperts.length; i += 7) {
      rowsToRender.push(filteredExperts.slice(i, i + 7));
    }
  }

  // Utility function to format category names
  const formatCategoryName = (category) => {
    return category
      .split("-") // Split by "-"
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join with a space
  };

  const renderRow = (data, justify = "center") => (
    <div className={`flex flex-wrap ${justify} gap-4 md:gap-6 mb-6`}>
      {data.map((expert, index) => (
        <div
          key={`expert-${index}`}
          className="w-[12.5%] min-w-[90px] flex flex-col items-center"
        >
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
  );

  // Parse heading and subheading to extract inner content
  const parsedHeading = parseHeadingHtml(heading);
  const parsedSubheading = parseHeadingHtml(subheading);

  return (
    <div className="max-w-[82rem] mx-auto px-4 my-16">
      <h2
        dangerouslySetInnerHTML={{ __html: parsedHeading }}
        className="capitalize text-3xl md:text-4xl lg:text-5xl font-serif text-center mt-8 md:mt-12"
      />
      <h2
        dangerouslySetInnerHTML={{ __html: parsedSubheading }}
        className="text-[20px] text-center mt-4 mb-12"
      />

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === "all" ? "bg-yellow-400 text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === category ? "bg-yellow-400 text-white" : "bg-gray-100"
            }`}
          >
            {formatCategoryName(category)}
          </button>
        ))}
      </div>

      {/* Render 4 Custom Rows */}
      {rowsToRender.map((row, index) => renderRow(row, "justify-center"))}
    </div>
  );
}