<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import WhyChooseSection from "./WhyChoose";
import HireDevelopersSection from "./HireDeveloperSectio";
import TechBanner from "./TechBanner";
import ExpertiseComponent from "../WhatWeDo/Growth";
import Review from "../Websites/Review";
import { useParams } from "react-router-dom";
import ServicesLanding from "./Application";
import PlaceholderSection from "../../pages/Placeholder";

const TechnologyPage = () => {
  const { slug } = useParams();
  const [sections, setSections] = useState(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/technologySecData/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => setSections(data.sections || {}))
      .catch(() => setSections({}));
  }, [slug]);

  if (sections === null) {
    return null; // or loader/spinner
  }

  const { hireDeveloper, whyChoose, technologyApplication } = sections;

  // Case 1: If no section exists at all → placeholder
  if (!hireDeveloper && !whyChoose && !technologyApplication) {
    return <PlaceholderSection />;
  }

  // Case 2: If technologyApplication exists but others are missing → placeholder
  if (
    technologyApplication &&
    (!hireDeveloper || !whyChoose)
  ) {
    return <PlaceholderSection />;
  }

  // Case 3: Normal rendering
  return (
    <div>
      <TechBanner pageType={"technology"} />

      {/* Technology Application Section */}
      {technologyApplication && <ServicesLanding />}

      {/* Why Choose Section */}
      {whyChoose && <WhyChooseSection />}

      {/* Expertise (Always render) */}
      <ExpertiseComponent />

      {/* Hire Developers Section */}
      {hireDeveloper && <HireDevelopersSection />}

      {/* Reviews (Always render) */}
      <Review />
    </div>
  );
};

export default TechnologyPage;
=======
import React from 'react'
import WhyChooseSection from './WhyChoose'
import HireDevelopersSection from './HireDeveloperSectio'
import TechBanner from './TechBanner'
import ExpertiseComponent from '../WhatWeDo/Growth'
import Review from '../Websites/Review'
import ServicesLanding from './Application'

const TechnologyPage = () => {
  return (
    <div>
      <TechBanner pageType={"technology"}/>
      <ServicesLanding />
      <WhyChooseSection />
      <ExpertiseComponent />
      <HireDevelopersSection />
      <Review />
    </div>
  )
}

export default TechnologyPage
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
