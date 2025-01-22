import React from 'react'
import ProjectFeatures from '../components/Project/ProjectFeature'
import Marquee from '../components/Project/Marquee'
import ProjectsSection from '../components/Project/ProjectSection'
import PremiumTemplatesSection from '../components/PrimiumTemplateSection'
import GlobalSolution from '../components/GlobalSolution'
import Review from "../components/Websites/Review"

export default function Projects() {
  return (
   <div>
   <ProjectFeatures/>
   {/* <Marquee/> */}
   <ProjectsSection/>
   {/* <Review/> */}
   <PremiumTemplatesSection/>
   <GlobalSolution/>
   </div>
  )
}
