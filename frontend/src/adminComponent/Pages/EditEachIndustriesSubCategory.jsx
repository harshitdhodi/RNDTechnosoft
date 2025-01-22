import React from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../Pages/industriescomponent/sub/HomeHero";
import ServiceTable from "../Pages/industriescomponent/sub/Details";
import Companies from "../Pages/industriescomponent/sub/companies";

const EditSubServicePage = () => {
  // Extract both categoryId and subcategoryId from the URL parameters
  const { categoryId, subcategoryId } = useParams();
  console.log(categoryId, subcategoryId )
  return (
    <div className="p-4">
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Hero Section</h2>
        <HeroSection categoryId={categoryId} subcategoryId={subcategoryId}  />
      </div>
    <div className="mt-6">
        <h2 className="text-lg font-semibold">Details Section</h2>
        <ServiceTable categoryId={categoryId} subcategoryId={subcategoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} subcategoryId={subcategoryId}/>
      </div>
    </div>
  );
};

export default EditSubServicePage;
