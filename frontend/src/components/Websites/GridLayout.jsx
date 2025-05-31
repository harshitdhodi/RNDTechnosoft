"use client";

import { useState, useEffect } from "react";
import Card from "./Card";

export default function GridLayout({ serviceData }) {
  const [isMounted, setIsMounted] = useState(false);
  const [cardConfigs, setCardConfigs] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    const updateCardConfigs = () => {
      if (window.matchMedia("(min-width: 1025px)").matches) {
        // Large screens
        setCardConfigs([
          { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 2, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 2,justifySelf: "start" },
          { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 3, rowSpan: 1, justifySelf: "auto" },
        ]);
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        // Medium screens
        setCardConfigs([
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "start" },
          { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
        ]);
      } else {
        // Small screens
        setCardConfigs([
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
          { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
        ]);
      }
    };

    updateCardConfigs(); // Initial call
    window.addEventListener("resize", updateCardConfigs); // Update on resize

    return () => window.removeEventListener("resize", updateCardConfigs); // Cleanup
  }, []);

  if (!isMounted) {
    return null;
  }

  // Static data for AI/ML and Product Engineering
  const staticServices = [
    {
      _id: "static-aiml",
      category: "AI/ML",
      description: "Leverage cutting-edge artificial intelligence and machine learning to build intelligent solutions that drive innovation and efficiency.",
      photo: null,
      tag: "AI/ML",
      slug: "ai-ml",
    },
    {
      _id: "static-product-engineering",
      category: "Product Engineering",
      description: "End-to-end product development services, from ideation to deployment, ensuring scalable and robust solutions tailored to your needs.",
      photo: null,
      tag: "Product Engineering",
      slug: "product-engineering",
    },
  ];

  // Define desired services order
  const desiredServices = [
    "UI/UX",
    "Software Development",
    "Web Development",
    "Mobile App Development",
    "AI/ML",
    "Product Engineering",
  ];

  // Normalize category names
  const normalizeCategory = (category) => {
    if (!category) return "";
    return category
      .trim()
      .replace("UI/UX", "UI/UX")
      .replace("Web Development", "Web Development")
      .replace("Custom Software", "Software Development")
      .replace(/\s+/g, " ");
  };

  // Filter dynamic services to include only desired services (excluding AI/ML and Product Engineering for now)
  const dynamicServices = Array.isArray(serviceData)
    ? serviceData.filter((service) =>
        desiredServices
          .filter((cat) => cat !== "AI/ML" && cat !== "Product Engineering")
          .includes(normalizeCategory(service.category))
      )
    : [];

  // Combine dynamic and static services, prioritizing dynamic data
  const allServices = desiredServices
    .map((category) => {
      const dynamicService = dynamicServices.find(
        (service) => normalizeCategory(service.category) === category
      );
      if (dynamicService) return dynamicService;
      return staticServices.find(
        (service) => normalizeCategory(service.category) === category
      );
    })
    .filter((service) => service !== undefined) // Remove undefined entries
    .sort((a, b) => {
      const categoryA = normalizeCategory(a.category);
      const categoryB = normalizeCategory(b.category);
      const indexA = desiredServices.indexOf(categoryA);
      const indexB = desiredServices.indexOf(categoryB);
      return indexA - indexB;
    });

  if (allServices.length === 0) {
    return <div>No service data available</div>;
  }

  const cardColors = [
    "#396C89",
    "#6E777F",
    "#C59B34",
    "#60456E",
    "#EFC27B",
    "#482620",
  ];

  const imageClasses = [
    "object-contain w-full h-32",
    "rounded-lg shadow-md",
    "aspect-square object-cover",
    "h-24 w-24 mx-auto",
    "object-center rounded-xl",
    "w-full h-auto",
  ];

  return (
    <>
      <div>
        <h2 className="text-4xl md:text-5xl mt-1 font-serif text-center font-medium">
          Our <span className="text-yellow-500">Services</span>
        </h2>
        <h3 className="md:text-[23px] text-center text-gray-700 pb-16 mt-4">
          Dedicated to Your Success
        </h3>
      </div>
      <div className="sm:grid flex flex-col px-4 w-full overflow-hidden max-w-[82rem] 2xl:max-w-[85rem] xl:max-w-[76rem] mx-auto gap-4 xl:grid-cols-4 grid-rows-[repeat(3,minmax(200px,auto))]">
        {allServices.map((service, index) => (
          <Card
            key={service._id}
            id={index + 1}
            title={service.category}
            color={cardColors[index % cardColors.length]}
            description={
              service.description
                ? service.description.replace(/<\/?[^>]+(>|$)/g, "")
                : `Service information for ${service.category}`
            }
            className={`col-span-${cardConfigs[index]?.colSpan || 1} row-span-${
              cardConfigs[index]?.rowSpan || 1
            } justify-self-${cardConfigs[index]?.justifySelf || "auto"}`}
            colSpan={cardConfigs[index]?.colSpan || 1}
            rowSpan={cardConfigs[index]?.rowSpan || 1}
            imageUrl={service.photo ? `/api/logo/download/${service.photo}` : null}
            imageClassName={imageClasses[index % imageClasses.length]}
            tag={service.tag || service.category}
            slug={service.slug}
            index={index}
          />
        ))}
      </div>
    </>
  );
}