// EditServicePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../servicecomponent/HeroSection";
import ServiceTable from "../servicecomponent/ServiceDetails";
import LatestProjects from "../servicecomponent/LatestProject";
import Companies from "../servicecomponent/Companies";
import Packages from "../servicecomponent/Packages";
import DesignProcess from "../servicecomponent/DesignProcess";
import TestimonialsTable from "../servicecomponent/Testimonial";
const EditServicePage = () => {
  const { categoryId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold"> Create and Edit service details </h2>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Hero Section</h2>
        <HeroSection categoryId={categoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Details Section</h2>
        <ServiceTable categoryId={categoryId} />
      </div>
      {/* <div className="mt-6">
        <h2 className="text-lg font-semibold">Latest Projects Section</h2>
        <LatestProjects categoryId={categoryId} />
      </div> */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} />
      </div>
      {/* <div className="mt-6">
        <h2 className="text-lg font-semibold"> Packages Section</h2>
        <Packages categoryId={categoryId} />
      </div> */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Design Process Section</h2>
        <DesignProcess categoryId={categoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Testimonial Section</h2>
        <TestimonialsTable categoryId={categoryId} />
      </div>
    </div>
  );
};

export default EditServicePage;
