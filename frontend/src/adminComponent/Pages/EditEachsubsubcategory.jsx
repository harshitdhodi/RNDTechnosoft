import React from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../servicecomponent/subsubService/HeroSectionSubSub";
import ServicesTable from "../servicecomponent/subsubService/ServiceDetails";
import LatestProjects from "../servicecomponent/subsubService/LatestProject";
import Companies from "../servicecomponent/subsubService/Companies";
import DesignProcess from "../servicecomponent/subsubService/DesignProcess";
import TestimonialsTable from "../servicecomponent/subsubService/Testimonial";
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
        <h2 className="text-lg font-semibold">Latest Projects Section</h2>
        <LatestProjects categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId} />
      </div>
    <div className="mt-6">
        <h2 className="text-lg font-semibold">Companies Section</h2>
        <Companies categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId} />
      </div>
           {/* <div className="mt-6">
        <h2 className="text-lg font-semibold"> Packages Section</h2>
        <Packages categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId}/>
      </div> */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Design Process Section</h2>
        <DesignProcess categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId} />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Design Process Section</h2>
        <TestimonialsTable categoryId={categoryId} subcategoryId={subcategoryId} subsubcategoryId={subsubcategoryId} />
      </div>
    </div>
  );
};

export default EditSubSubServicePage;
