import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TechnologyList = () => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hireTalentData, setHireTalentData] = useState({
    heading: '',
    subHeading: '',
    cards: [],
  });

  // Fetch heading + subheading
  useEffect(() => {
    const fetchHireTalentData = async () => {
      try {
        const response = await axios.get('/api/hire-talent/getByPageSection?pageSection=Technologies');
        const data = response.data.data;

        if (data.length > 0) {
          setHireTalentData({
            heading: data[0].heading || '',
            subHeading: data[0].subHeading || '',
            cards: data[0].card || [],
          });
        }
      } catch (err) {
        console.error('Error fetching hire talent data:', err);
        setError('Error loading heading/subheading');
      }
    };

    fetchHireTalentData();
  }, []);

  // Fetch categories + technologies
  useEffect(() => {
    const fetchTechnologyData = async () => {
      try {
        setIsLoading(true);

        const categoryResponse = await axios.get('/api/techCategory');
        const categories = categoryResponse.data.data;

        const technologyResponse = await axios.get('/api/technology');
        const technologies = technologyResponse.data.data;

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
    <div className="sm:p-8 max-w-6xl mx-auto font-sans">
      <div className="text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {hireTalentData.heading || (
            <>
              Our <span className="text-yellow-500">Software Development</span> Team’s Core Strengths
            </>
          )}
        </h1>
        <p className="text-lg text-gray-600 mb-6 sm:mb-8">
          {hireTalentData.subHeading ||
            'Our software development team thrives on agility, precision, and innovation. From scalable architecture to seamless collaboration, we turn complex ideas into powerful digital solutions.'}
        </p>
      </div>

      {sections.map((section, index) => (
        <div
          key={index}
          className="flex justify-center py-6 border-b border-gray-200"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center max-w-5xl w-full px-4">
            
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2 min-w-[220px] mx-auto">
              {section.icon.startsWith('/api/logo/download') ? (
                <img
                  src={section.icon}
                  alt={section.title}
                  className="w-6 h-6 object-contain"
                />
              ) : (
                <span className="text-2xl">{section.icon}</span>
              )}
              <h2 className="text-base font-semibold">{section.title}</h2>
            </div>

            {/* Arrow — visible only on sm+ */}
            <div className="hidden sm:block w-[30px] text-yellow-500 text-2xl">→</div>

            {/* Logos section */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4">
                {section.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center gap-2">
                    {tech.logo ? (
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                      />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center text-gray-500">?</span>
                    )}
                    <span className="text-sm text-gray-800">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnologyList;