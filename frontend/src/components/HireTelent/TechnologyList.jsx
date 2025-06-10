import React from 'react';
import css from "../../images/technology/css.png";
import html from "../../images/technology/html.png";
import js from "../../images/technology/js.png";
import react from "../../images/technology/react.png";
import next from "../../images/technology/next.png";
import node from "../../images/technology/node js.png";
import php from "../../images/technology/php.png";

const TechnologyList = () => {
  const techImages = {
    "React JS": react,
    "Next JS": next,
    "HTML": html,
    "CSS": css,
    "Javascript": js,
    "Node JS": node,
    "PHP": php,
    "Express JS": null,
    "Laravel": null,
    "Flutter": null,
    "Android": null,
    "Java": null,
    "Shopify": null,
    "Wordpress": null,
    "Magento": null,
    "Figma": null,
    "Adobe XD": null,
    "Sketch": null
  };

  const sections = [
    {
      title: "Front-end Development",
      icon: "🖥️",
      technologies: ["React JS", "Next JS", "HTML", "CSS", "Javascript"]
    },
    {
      title: "Back-end Development",
      icon: "💻",
      technologies: ["Node JS", "PHP", "Express JS", "Laravel"]
    },
    {
      title: "Mobile-App Development",
      icon: "📱",
      technologies: ["Flutter", "Android", "Java"]
    },
    {
      title: "Ecommerce",
      icon: "🛒",
      technologies: ["Shopify", "Wordpress", "Magento"]
    },
    {
      title: "UI/UX",
      icon: "🎨",
      technologies: ["Figma", "Adobe XD", "Sketch"]
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
     <div className="text-center mb-8 max-w-3xl mx-auto">
         <h1 className="text-4xl font-bold text-center mb-4">Our Software Development Team’s Core Strengths</h1>
      <p className="text-center text-gray-600 mb-8">
        Our software development team thrives on agility, precision, and innovation. From scalable architecture to seamless collaboration, we turn complex ideas into powerful digital solutions.
      </p>
     </div>
      {sections.map((section, index) => (
        <div key={index} className="flex items-center  py-4">
          <div className="flex  border-b-2 p-2 border-dashed border-gray-400 items-center ">
            <span className="text-2xl mr-2">{section.icon}</span>
            <h2 className="text-lg font-semibold  ">{section.title}</h2>
          </div>
          <div className="w-2/3 flex items-center">
            <span className="text-yellow-500 text-5xl mr-4">→</span>
            <div className="flex space-x-10">
              {section.technologies.map((tech, techIndex) => (
                <div key={techIndex} className="flex  items-center">
                  {techImages[tech] ? (
                    <img src={techImages[tech]} alt={tech} className="w-9 h-8 mr-2 object-contain" />
                  ) : (
                    <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-500">?</span>
                  )}
                  <span className="text-gray-700 font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnologyList;