import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const bgColors = [
  "#333333", // Charcoal Black
  "#343434", // Jet Black

  "#B8860B", // Dark Goldenrod

  "#4A5568", // Dark Slate Gray

  "#6C757D", // Dark Gray
  "#4E4B4B", // Dark Charcoal
  "#5B3F69", // Darker Muted Lavender
  "#3D545E", // Dark Dusty Teal
  "#5A3B32", // Darker Muted Coral
  "#4A6E71", // Darker Slate Teal
  "#4D5B61", // Darker Steel Gray
  "#5A4B3A", // Darker Soft Tan
  "#4C4A57", // Darker Deep Slate
  "#5C4D7A", // Darker Dusty Purple
];

const getUniqueColors = (count) => {
  const shuffled = [...bgColors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Array of different pattern generators
const patternTypes = [
  // Dots pattern
  (color) => ({
    id: "dots",
    pattern: (
      <pattern
        id={`dots-${color.replace("#", "")}`}
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1" fill={color} />
        <circle cx="10" cy="10" r="1.5" fill={color} />
        <circle cx="18" cy="18" r="1" fill={color} />
      </pattern>
    ),
  }),
  // Circles pattern
  (color) => ({
    id: "circles",
    pattern: (
      <pattern
        id={`circles-${color.replace("#", "")}`}
        x="0"
        y="0"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse"
      >
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
        <circle
          cx="30"
          cy="30"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
      </pattern>
    ),
  }),
  // Diagonal lines pattern
  (color) => ({
    id: "lines",
    pattern: (
      <pattern
        id={`lines-${color.replace("#", "")}`}
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <line x1="0" y1="0" x2="40" y2="40" stroke={color} strokeWidth="0.5" />
        <line x1="40" y1="0" x2="0" y2="40" stroke={color} strokeWidth="0.5" />
      </pattern>
    ),
  }),
  // Hexagons pattern
  (color) => ({
    id: "hexagons",
    pattern: (
      <pattern
        id={`hexagons-${color.replace("#", "")}`}
        x="0"
        y="0"
        width="50"
        height="43.4"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M25 0 L50 14.4 L50 38.4 L25 43.4 L0 38.4 L0 14.4 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
      </pattern>
    ),
  }),
  // Grid pattern
  (color) => ({
    id: "grid",
    pattern: (
      <pattern
        id={`grid-${color.replace("#", "")}`}
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
        />
      </pattern>
    ),
  }),
];

const BackgroundPattern = ({ color }) => {
  // Randomly select 2-3 patterns to combine
  const numPatterns = Math.floor(Math.random() * 2) + 2;
  const selectedPatterns = [...patternTypes]
    .sort(() => Math.random() - 0.5)
    .slice(0, numPatterns)
    .map((generator) => generator(color));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>{selectedPatterns.map(({ pattern }) => pattern)}</defs>
        {selectedPatterns.map(({ id }, index) => (
          <rect
            key={id}
            width="100%"
            height="100%"
            fill={`url(#${id}-${color.replace("#", "")})`}
            opacity={1 / (index + 1)}
          />
        ))}
      </svg>
    </div>
  );
};

const decorativePatterns = [
  // Abstract waves
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,50 C30,60 70,40 90,50 C70,60 30,40 10,50"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M10,30 C30,40 70,20 90,30 C70,40 30,20 10,30"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M10,70 C30,80 70,60 90,70 C70,80 30,60 10,70"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),

  // Geometric shapes
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,10 90,90 10,90"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <rect
        x="30"
        y="30"
        width="40"
        height="40"
        fill="none"
        stroke={color}
        strokeWidth="2"
        transform="rotate(45 50 50)"
      />
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),

  // Spiral pattern
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50,50 m-40,0 a40,40 0 1,1 80,0 a30,30 0 1,1 -60,0 a20,20 0 1,1 40,0 a10,10 0 1,1 -20,0"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),

  // Starburst
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2={50 + 40 * Math.cos((i * Math.PI * 2) / 12)}
          y2={50 + 40 * Math.sin((i * Math.PI * 2) / 12)}
          stroke={color}
          strokeWidth="2"
        />
      ))}
    </svg>
  ),

  // Connected dots
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <circle
            cx={50 + 30 * Math.cos((i * Math.PI * 2) / 6)}
            cy={50 + 30 * Math.sin((i * Math.PI * 2) / 6)}
            r="3"
            fill={color}
          />
          <line
            x1={50 + 30 * Math.cos((i * Math.PI * 2) / 6)}
            y1={50 + 30 * Math.sin((i * Math.PI * 2) / 6)}
            x2={50 + 30 * Math.cos(((i + 1) * Math.PI * 2) / 6)}
            y2={50 + 30 * Math.sin(((i + 1) * Math.PI * 2) / 6)}
            stroke={color}
            strokeWidth="1"
          />
        </g>
      ))}
    </svg>
  ),

  // Abstract squares
  (color) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x={50 - (i + 1) * 10}
          y={50 - (i + 1) * 10}
          width={(i + 1) * 20}
          height={(i + 1) * 20}
          fill="none"
          stroke={color}
          strokeWidth="1"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  ),
];

const DecorativeElement = ({ color }) => {
  // Get a random pattern from the array
  const randomPattern =
    decorativePatterns[Math.floor(Math.random() * decorativePatterns.length)];
  return (
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-45">
      {randomPattern(color)}
    </div>
  );
};

const ServiceCard = ({ service, isLarge }) => {
  const hasImage = service.image && service.image !== "null";
console.log(service)
  return (
    <div
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl relative
        ${
          isLarge
            ? "col-span-12 md:col-span-6"
            : "col-span-12 md:col-span-6 lg:col-span-3"
        }`}
      style={{
        backgroundColor: service.bgColor,
      }}
    >
      <BackgroundPattern color="white" />

      <div className="relative z-10 backdrop-blur-[2px]">
        <div className="flex flex-col  md:flex-row ">
          <div className={`p-8 w-full space-y-6 relative `}>
            {/* Replace the old circle SVG with our new random DecorativeElement */}
            <DecorativeElement color="white" />

            <Link
              to={`/${service.slug}`}
              className="inline-block bg-white text-black text-sm font-medium px-4 py-1 rounded-full 
              shadow-sm transition-transform duration-300 group-hover:scale-105 relative z-10 "
            >
              <span className="my-4">{service.tag}</span>
            </Link>
            <Link
              to={`/${service.slug}`}
              className="text-2xl font-serif font-medium text-white relative z-10"
            >
              <h3 className="my-8">{service.title}</h3>
            </Link>
            <Link
              to={`/${service.slug}`}
              className="prose text-white/90 relative z-10 "
            >
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </Link>
          </div>

          {hasImage && (
            <Link
              to={`/${service.slug}`}
              className="w-full hidden xl:flex  relative flex-col justify-center items-center "
            >
              <div className="relative   group-hover:scale-105 transition-transform duration-500 h-full ">
                {/* <div className="absolute inset-0 transform -translate-x-2 -translate-y-2">
                  <div className="w-full h-full rounded-full border-2 border-white/20" />
                </div>
                <div className="absolute inset-0 transform translate-x-2 translate-y-2">
                  <div className="w-full h-full rounded-full border-2 border-white/20" />
                </div> */}
                <img
                  src={service.image}
                  alt={service.alt}
                  title={service.imgtitle}
                  className="xl:h-full xl:w-full  object-contain object-center relative z-10 
                    transition-all duration-500 group-hover:rotate-1"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
// const LoadingSkeleton = () => {
//   const skeletonColors = getUniqueColors(4);

//   return (
//     <>
//       {[1, 2, 3, 4].map((i) => (
//         <div
//           key={i}
//           className={`${
//             i <= 2
//               ? "col-span-12 md:col-span-6"
//               : "col-span-12 md:col-span-6 lg:col-span-3"
//           }
//             animate-pulse rounded-xl min-h-[300px]`}
//           style={{ backgroundColor: skeletonColors[i - 1] }}
//         >
//           <BackgroundPattern color="white" />
//           <div className="h-full p-8 space-y-6">
//             <div className="w-24 h-6 bg-white/20 rounded-full" />
//             <div className="w-3/4 h-8 bg-white/20 rounded" />
//             <div className="space-y-3">
//               <div className="w-full h-4 bg-white/20 rounded" />
//               <div className="w-5/6 h-4 bg-white/20 rounded" />
//               <div className="w-4/6 h-4 bg-white/20 rounded" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

const ServicesGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/services/getCategory", {
          credentials: "include",
        });
        const data = await response.json();
        const transformedData = transformServices(data);
        setServices(transformedData);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformServices = (apiData) => {
    const uniqueColors = getUniqueColors(apiData.length);

    return apiData.map((service, index) => ({
      title: service.category,
      description: service.description || "",
      tag: service.tag,
      image: service.photo ? `/api/logo/download/${service.photo}` : null,
      imgtitle: service.imgtitle || "",
      alt: service.alt || "",
      slug: service.slug,
      bgColor: uniqueColors[index],
    }));
  };

  if (error) {
    return (
     null
    );
  }

  return (
    <section className="md:my-20 md:py-16  py-4 px-4 bg-gray-50">
      <div className="w-[85%] mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-center font-medium ">
          Our <span className="text-yellow-500">Services</span>
        </h2>
        <h3 className=" md:text-[23px]  text-center  pb-16 mt-4  ">
          Dedicated to Your Success
        </h3>

        <div className="grid grid-cols-12 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              isLarge={
                index === 0 ||
                index === 4 ||
                index === 7 ||
                index === 9 ||
                index === 10
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
