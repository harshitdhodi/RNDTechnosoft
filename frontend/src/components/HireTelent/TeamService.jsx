import { Handshake, FileText, Users, Building } from "lucide-react"

const TeamServicesSection = () => {
  const services = [
    {
      icon: <Handshake className="w-8 h-8 text-white" />,
      title: "Project-Oriented",
      description:
        "Best suited for simpler, clearly defined projects—quickly start with clear requirements and timeline for smooth execution.",
    },
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "Risk-Free Trial",
      description:
        "This option allows you to try without risk or a high-time commitment. It is perfect for businesses that are determining whether larger projects are feasible.",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Dedicated",
      description:
        "Our expert team is fully focused on your project and built for speed, control, and long-term excellence.",
    },
    {
      icon: <Building className="w-8 h-8 text-white" />,
      title: "ODC/BOT",
      description:
        "Use the benefits of offshore, our clients mitigate risk, and gain specialized talent in a given domain.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Dedicated Software Development
          <br />
          Team Services
        </h2>
        <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
          Tap into top-tier tech talent tailored to your project. Hire dedicated software development team to move
          faster, stay agile, and scale seamlessly—without the hiring hassle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamServicesSection
