import React from "react";

const services = [
  {
    title: "Mobile App Development",
    description:
      "With expertise in cross-platform FinTech mobile applications, we create innovative solutions—from digital wallets to neo-banks—designed for both Android and iOS, ensuring seamless, intuitive user experiences.",
    image: "/images/mobile-app.png",
    dark: false,
  },
  {
    title: "Cloud-Based Application Development",
    description:
      "We specialize in building secure, scalable cloud-based FinTech applications that enable financial institutions to stay connected with clients, stakeholders, and teams, offering access from any device, at any time.",
    image: "/images/cloud-app.png",
    dark: true,
  },
  {
    title: "Software Modernization & Migration",
    description:
      "We transform outdated financial systems by re-engineering them with cloud-native architectures, microservices, and APIs, enhancing functionality, scalability, and integration.",
    image: "/images/modernization.png",
    dark: false,
  },
  {
    title: "Data Analytics Solutions",
    description:
      "Our team develops advanced analytics solutions using technologies like Power BI, Apache Superset, R, SAS, and TensorFlow, delivering actionable insights to empower smarter financial decision-making.",
    image: "/images/analytics.png",
    dark: true,
  },
  {
    title: "Software Integration",
    description:
      "We seamlessly integrate custom software solutions with your existing systems, both internal and external, through APIs and EDIs, streamlining cloud-based operations and ensuring smooth data flow across platforms.",
    image: "/images/integration.png",
    dark: false,
  },
  {
    title: "Digital Process Automation",
    description:
      "As experts in digital process automation, we design and implement intelligent bots using platforms like Microsoft Power Platform, UiPath, and Robocorp to optimize and automate business processes, driving operational efficiency.",
    image: "/images/automation.png",
    dark: true,
  },
];

export default function FinTechServices() {
  return (
    <div className="max-w-8xl mx-auto xl:mx-32 py-12">
      <div className="text-center  mb-12">
        <h1 className="text-3xl max-w-xl mx-auto font-bold mb-5">
          End-to-End Full-Stack FinTech Software Development Services
        </h1>
        <p className="max-w-3xl mx-auto text-sm text-gray-600"    style={{ lineHeight: 1.7 }}>
          Whether you're seeking to automate traditional banking systems, modernize legacy software, integrate fraud
          detection systems, or develop cutting-edge automated trading platforms, we have the expertise to meet all your
          FinTech software and technology requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {services.map((service, index) => (
        <div
  key={index}
  className={`${service.dark ? "bg-gray-900 text-white" : "bg-white"}`}
  style={{
    border: "1px solid",
    borderColor: service.dark ? "#374151" : "#e5e7eb", // gray-700 or gray-200
    }}
>
            <div className="p-6 pb-20">
              
              <h2 className="text-xl w-[55%] font-semibold mb-2">{service.title}</h2>
              <p className={`text-md  ${service.dark ? "opacity-80" : "text-gray-600"}`}
                style={{ lineHeight: 1.7 }}>
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
