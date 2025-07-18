import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TechnologyList = () => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const categoryResponse = await axios.get('/api/techCategory');
        const categories = categoryResponse.data.data;

        // Fetch technologies
        const technologyResponse = await axios.get('/api/technology');
        const technologies = technologyResponse.data.data;

        // Format sections to match the original component structure
        const formattedSections = categories.map((category) => ({
          title: category.heading,
          icon: category.photo ? `/api/logo/download/${category.photo}` : '❓',
          technologies: technologies
            .filter((tech) => tech.category && tech.category._id === category._id)
            .map((tech) => ({
              name: tech.imgTitle,
              logo: tech.photo ? `/api/logo/download/${tech.photo}` : null,
            })),
        }));

        setSections(formattedSections);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching technology data:', error);
        setError('Failed to load technology data');
        setIsLoading(false);
      }
    };

    fetchTechnologyData();
  }, []);

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-serif font-medium mb-4">Our <span className='text-yellow-500'>Software Development</span> Team’s Core Strengths</h1>
        <p className="text-lg text-gray-600 mb-6 sm:mb-8">
          Our software development team thrives on agility, precision, and innovation. From scalable architecture to seamless collaboration, we turn complex ideas into powerful digital solutions.
        </p>
      </div>
      {sections.map((section, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center py-2 sm:py-4 ">
          <div className="flex items-center border-b-2 border-dashed border-gray-400 p-2">
            {section.icon.startsWith('/api/logo/download') ? (
              <img
                src={section.icon}
                alt={section.title}
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 object-contain"
                onError={(e) => (e.target.outerHTML = '<span class="text-lg sm:text-2xl mr-2">❓</span>')}
              />
            ) : (
              <span className="text-lg sm:text-2xl mr-2">{section.icon}</span>
            )}
            <h2 className="text-base sm:text-lg font-semibold">{section.title}</h2>
          </div>
          <div className="flex flex-wrap items-center mt-2 sm:mt-0 sm:w-2/3">
            <span className="text-yellow-500 text-3xl sm:text-5xl mr-3 sm:mr-4 hidden sm:inline">→</span>
            <div className="flex flex-wrap ">
              {section.technologies.map((tech, techIndex) => (
                <div key={techIndex} className="flex items-center">
                  {tech.logo ? (
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="w-full h-10 sm:w-1/4 sm:h-[95%] mr-2 object-fill"
                      onError={(e) => (e.target.outerHTML = '<span class="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex items-center justify-center text-gray-500">?</span>')}
                    />
                  ) : (
                    <span className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex items-center justify-center text-gray-500">?</span>
                  )}
                  <span className="text-gray-700 text-sm sm:text-base font-medium">{tech.name}</span>
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