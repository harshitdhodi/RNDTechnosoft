"use client";

import { useState } from "react";

export default function Card({
  id,
  title,
  color,
  description,
  className = "",
  imageUrl,
  tag,
  slug,
  rowSpan = 1,
  colSpan = 1,
  imageClassName,
  index=0
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Strip HTML tags from description for clean display
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  // Create a short description by truncating the clean text
  const shortDescription = stripHtml(description);
  const truncatedDescription = shortDescription.length > 220 ? 
    `${shortDescription.substring(0, 220)}...` : 
    shortDescription;

  // Calculate grid column span based on colSpan prop
  const gridColumnSpan = `span ${colSpan} / span ${colSpan}`;

  return (
    <div
      id={`card-${id}`}
      className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      style={{ 
        backgroundColor: color,
        transform: isHovered ? "translateY(-5px)" : "none",
        gridRow: rowSpan > 1 ? `span ${rowSpan} / span ${rowSpan}` : undefined,
        gridColumn: colSpan > 1 ? gridColumnSpan : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-6 h-full ${imageUrl ? 
        (rowSpan > 1 ? "flex flex-col" : "flex flex-row") : 
        "flex flex-col"}`}>
        
        {/* Content Section */}
        <div className={`flex flex-col ${imageUrl && rowSpan <= 1 ? "w-full" : "w-full"}`}>
          {/* Tag display */}
          <div className="bg-white/20 rounded-xl px-3 py-1 text-xs text-white inline-block mb-3 w-fit">
            {tag || `Card ${id}`}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 font-[Georgia]">{title}</h3>
          <p className="text-white/80 text-sm flex-grow ">{truncatedDescription}</p>
        </div>
        
        {/* Image Section - When in row layout (rowSpan <= 1), show image on right */}
        {imageUrl && rowSpan <= 1 && (
          <div className="w-full relative top-16 -right-5">
            <img 
              src={imageUrl || "/api/placeholder/120/80"} 
              alt={title} 
              className={`w-full h-48 object-contain rounded-md ${imageClassName}`}
            />
          </div>
        )}
        
        {/* Image Section - When in column layout (rowSpan > 1), show image at bottom */}
        {imageUrl && rowSpan > 1 && (
          <div className="w-full h-[46vh] top-5 relative">
            <img 
              src={imageUrl || "/api/placeholder/120/80"} 
              alt={title} 
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}