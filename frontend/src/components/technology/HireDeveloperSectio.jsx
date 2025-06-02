const HireDevelopersSection = () => {
  const benefits = [
    {
      title: "React JS Expertise That Delivers Impact:",
      description:
        "We create responsive, reactive components and modern interfaces for web and mobile apps using React JS.",
    },
    {
      title: "Proven Solutions Across Domains:",
      description:
        "Our developers have successfully built React JS applications across sectors like retail, healthcare, SaaS, and enterprise tech.",
    },
    {
      title: "Agile, Transparent Execution:",
      description:
        "We ensure fast, flexible project delivery through agile methods and clear communication at every stage.",
    },
    {
      title: "Built for Speed & Scalability:",
      description:
        "Our React JS solutions are optimized for high performance, maintainability, and seamless scalability.",
    },
  ]

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-8xl 2xl:px-28 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hire Dedicated <span className="text-yellow-500">React JS Developers</span>
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              At IT Idol Technologies, we build high-performing, scalable React JS applications tailored to your growth
              goals. From interactive UIs to enterprise-grade solutions, our React JS services bring speed, flexibility,
              and reliability to every project.
            </p>

            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Hire React JS Developer
            </button>
          </div>

          {/* Right Content - Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                {/* Bullet Point */}
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HireDevelopersSection
