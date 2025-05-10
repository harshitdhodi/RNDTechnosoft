"use client";

import { useState, useEffect } from "react";
import Card from "./Card";

export default function GridLayout({ serviceData }) {
  const [isMounted, setIsMounted] = useState(false);
  console.log("Raw serviceData:", serviceData);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!serviceData || !Array.isArray(serviceData)) {
    return <div>No service data available</div>;
  }

  const desiredOrder = [
    "Website Development",
    "Brand Development",
    "UI UX",
    "PPC Service",
    "Graphics Designing",
    "Content Marketing",
    "Software Development",
    "Video Production",
    "SSM Services",
    "SEO Services",
    "Mobile App Development",
  ];

  const normalizeCategory = (category) => {
    if (!category) return "";
    const normalized = category
      .trim()
      .replace("UI/UX", "UI UX")
      .replace("Graphic Designing", "Graphics Designing")
      .replace("PPC Services", "PPC Service")
      .replace("SMM Services", "SSM Services")
      .replace("Web Development", "Website Development")
      .replace(/\s+/g, " ");
    return normalized;
  };

  const sortedServices = [...serviceData].sort((a, b) => {
    const categoryA = normalizeCategory(a.category);
    const categoryB = normalizeCategory(b.category);
    const indexA = desiredOrder.indexOf(categoryA);
    const indexB = desiredOrder.indexOf(categoryB);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const services = sortedServices.slice(0, 11);

  const cardConfigs = [
    { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 1, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 1, rowSpan: 2, justifySelf: "auto" },
    { colSpan: 1, rowSpan: 1, justifySelf: "start" },
    { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 1, rowSpan: 1, justifySelf: "start" },
    { colSpan: 2, rowSpan: 1, justifySelf: "auto" },
    { colSpan: 1, rowSpan: 2, justifySelf: "auto" },
    { colSpan: 3, rowSpan: 1, justifySelf: "auto" },
  ];

  const cardColors = [
    "#396C89", "#6E777F", "#C59B34", "#60456E", "#EFC27B",
    "#482620", "#367275", "#0E4869", "#2E7469", "#396C89", "#114038"
  ];

  // Tailwind CSS classes for each image based on index
  const imageClasses = [
    "object-contain w-full h-32",
    "rounded-lg shadow-md",
    "aspect-square object-cover",
    "h-24 w-24 mx-auto",
    "object-center rounded-xl",
    "w-full h-auto",
    "p-2 object-fill",
    "rounded-full w-20 h-20",
    "w-28 h-28 mx-auto",
    "border-4 border-white",
    "brightness-90 saturate-150"
  ];

  return (
    <div className="grid w-full max-w-[82rem] mx-auto gap-4 grid-cols-4 grid-rows-[repeat(4,minmax(200px,auto))]">
      {services.map((service, index) => (
        <Card
          key={service._id}
          id={index + 1}
          title={service.category}
          color={cardColors[index]}
          description={service.description ? 
            service.description.replace(/<\/?[^>]+(>|$)/g, "") : 
            `Service information for ${service.category}`}
          className={`col-span-${cardConfigs[index].colSpan} row-span-${cardConfigs[index].rowSpan} justify-self-${cardConfigs[index].justifySelf}`}
          colSpan={cardConfigs[index].colSpan}
          rowSpan={cardConfigs[index].rowSpan}
          imageUrl={service.photo ? `/api/logo/download/${service.photo}` : null}
          imageClassName={imageClasses[index]} // <-- pass image class here
          tag={service.tag || service.category}
          slug={service.slug}
          index={index}
        />
      ))}
    </div>
  );
}
