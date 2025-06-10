import React from 'react';

const ServicesLanding = () => {
  const services = [
    {
      title: "Custom ReactJS Web Application Development",
      description: "Hire our experienced and certified ReactJS experts to develop custom and feature-rich web and mobile applications for your businesses.",
      icon: "💻"
    },
    {
      title: "Enterprise Web Application Development",
      description: "At Rnd, we use agile methodology to develop fast, secure, and enterprise-level web applications with ReactJS framework.",
      icon: "🏢"
    },
    {
      title: "ReactJS Plugin And API Development",
      description: "We ensure seamless API integration that allows the exploration of third-party solutions. And a powerful plugin to improve overall performance as a web app.",
      icon: "🔌"
    },
    {
    
      title: "UI/UX Development",
      description: "Our react js development service ensures your business gets unique and innovative applications with eye-catching and dynamic UI/UX design to exceed our client's expectations.",
      icon: "🎨"
    },
    {
      title: "ReactJS Front-end Development",
      description: "Our qualified front-end developers have resolved various challenges like multiple frameworks, SPA, and many more using their expertise in react js.",
      icon: "⚛️"
    },
    {
      title: "App Development",
      description: "Ours ReactJS web and mobile app development company in India creates business-oriented & feature-rich mobile apps that function smoothly on android and IOs platforms.",
      icon: "📱"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl  font-bold text-gray-800 mb-4 leading-tight">
            Build Fast, Scalable Apps with{' '}
            <span className="text-[#f3ca0d]">
              React JS
            </span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Empower your digital products with fast, scalable, and high-performing React JS solutions tailored to meet your business goals.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-8xl mx-auto px-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-yellow-500 transition-colors duration-300">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                {service.description}
              </p>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

   
    </div>
  );
};

export default ServicesLanding;