// EditServicePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../Pages/industriescomponent/main/HomeHero";
import ServiceTable from "../Pages/industriescomponent/main/Details";
import Companies from "../Pages/industriescomponent/main/companies";

const EditIndustiresPage = () => {
  const { categoryId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold"> Create and Edit Industries details </h2>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Hero Section</h2>
        <HeroSection categoryId={categoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Details Section</h2>
        <ServiceTable categoryId={categoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} />
      </div>
    </div>
  );
};

export default EditIndustiresPage;
