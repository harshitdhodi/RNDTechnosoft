import team from "../../images/team.png"
const TeamEngagementSection = () => {
  const keyBenefits = [
    "Enhanced technical control and real-time collaboration",
    "No burden of recruitment or talent management",
    "Greater transparency and involvement than project-based models",
  ]

  const idealForYou = [
    "You have a clear project vision and defined requirements",
    "You require team-level specific technical expertise",
    "You are focused on long-term development and strategic scaling",
    "You want to stay in control without operational overhead",
  ]

  return (
    <section className=" px-4">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 h-1/2">
            <img
              src={team}
              alt="Team working together in office"
             
              className="rounded-lg  w-full h-full object-contain"
            />
          </div>

          <div className="order-1 w-[80%] lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Dedicated Team Engagement</h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Acquire a dedicated team for your project. Our professionals integrate with your in-house workforce under
              shared responsibility and accountability. We ensure full responsibility for the resources we provide you,
              including Project Managers or Technical Leads, who collaborate closely with your internal counterparts.
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <ul className="space-y-2">
                {keyBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ideal For You If</h3>
              <ul className="space-y-2">
                {idealForYou.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
              Hire Us Now →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeamEngagementSection
