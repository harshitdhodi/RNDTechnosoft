import React from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../Pages/industriescomponent/subsub/HomeHero";
import ServicesTable from "../Pages/industriescomponent/subsub/Details";
import Companies from "../Pages/industriescomponent/subsub/companies";

const EditSubSubServicePage = () => {
  // Extract both categoryId and subcategoryId from the URL parameters
  const { categoryId, subcategoryId ,subsubcategoryId} = useParams();
  return (
    <div className="p-4">
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Hero Section</h2>
        <HeroSection categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId}  />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Details Section</h2>
        <ServicesTable categoryId={categoryId} subcategoryId={subcategoryId}  subsubcategoryId={subsubcategoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} subcategoryId={subcategoryId}  subsubcategoryId={subsubcategoryId} />
      </div>
    </div>
  );
};

export default EditSubSubServicePage;
