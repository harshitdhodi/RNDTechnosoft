import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FinTechServices from "./IndustryService";
import Home from "./FeatureService";
import TechBanner from "../technology/TechBanner";
import IndustryInfo from "./IndustryInfo";
import CaseStudy from "./CaseStudy";
import Review from "../Websites/Review";
import FAQ from "../Faq";
import BuildInfo from "./BuildInfo";
import PlaceholderSection from "../../pages/Placeholder";

const MainIndustry = () => {
  const { slug } = useParams();
  const [sections, setSections] = useState(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/caseStudy/exists/${slug}`)
      .then((res) => res.json())
      .then((data) => setSections(data.sections || {}))
      .catch(() => setSections({}));
  }, [slug]);

  if (sections === null) {
    return null; // could replace with loader
  }

  const { info, applications, softwareService, caseStudies } = sections;

  // Case 1: If no section exists → placeholder
  if (!info && !applications && !softwareService && !caseStudies) {
    return <PlaceholderSection />;
  }

  // Case 2: If "applications" exists but others are missing → placeholder
  if (applications && (!info || !softwareService)) {
    return <PlaceholderSection />;
  }

  // Case 3: Normal rendering
  return (
    <div>
      <TechBanner pageType={"industry"} />

      {/* Industry Info Section */}
      {info && <IndustryInfo />}

      {/* Feature Services */}
      {applications && <Home />}

      {/* Industry Services */}
      {softwareService && <FinTechServices />}

      {/* Case Studies */}
      {caseStudies && <CaseStudy />}

      {/* Build Info (Always render) */}
      <BuildInfo />

      {/* Reviews (Always render) */}
      <Review />

      {/* FAQ (Always render) */}
      <FAQ />
    </div>
  );
};

export default MainIndustry;
