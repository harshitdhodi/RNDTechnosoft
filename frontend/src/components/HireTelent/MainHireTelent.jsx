import React from 'react'
import TechBanner from '../technology/TechBanner'
import TeamServicesSection from './TeamService'
import TeamEngagementSection from './TeamEngagementSection'
import DedicatedTeam from './DedicatedTeam'
import TechnologyList from './TechnologyList'
import Faq from './../../pages/Faq';

const MainHireTelent = () => {
  return (
    <div>
       <TechBanner pageType={"technology"}/>
       <TeamServicesSection />
       <TeamEngagementSection />
       <DedicatedTeam />
       <TechnologyList />
       <Faq/>
    </div>
  )
}

export default MainHireTelent
