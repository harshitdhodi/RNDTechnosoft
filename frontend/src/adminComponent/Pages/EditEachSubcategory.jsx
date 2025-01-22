import React from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../servicecomponent/subService/HeroSectionSub";
import ServiceTable from "../servicecomponent/subService/ServiceDetails";
import LatestProjects from "../servicecomponent/subService/LatestProject";
import Companies from "../servicecomponent/subService/Companies";
import DesignProcess from "../servicecomponent/subService/DesignProcess";
import TestimonialsTable from "../servicecomponent/subService/Testimonial";
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
        <h2 className="text-lg font-semibold">Latest Projects Section</h2>
        <LatestProjects categoryId={categoryId} subcategoryId={subcategoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} subcategoryId={subcategoryId} />
      </div>
     {/* <div className="mt-6">
        <h2 className="text-lg font-semibold"> Packages Section</h2>
        <Packages categoryId={categoryId} subcategoryId={subcategoryId} />
      </div> */}
         <div className="mt-6">
        <h2 className="text-lg font-semibold">Design Process Section</h2>
        <DesignProcess categoryId={categoryId} subcategoryId={subcategoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Testimonial Section</h2>
        <TestimonialsTable categoryId={categoryId} subcategoryId={subcategoryId} />
      </div>
    </div>
  );
};

export default EditSubServicePage;
