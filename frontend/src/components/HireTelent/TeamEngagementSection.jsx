import React, { useState, useEffect } from 'react';
import axios from 'axios';

const    TeamEngagementSection = () => {
  const [engagementData, setEngagementData] = useState({
    heading: '',
    subHeading: '',
    keyBenefits: [],
    idealForYou: [],
    image: '',
    imageAlt: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/hire-talent/getByPageSection?pageSection=Applications');
        const data = response.data.data;

        if (data.length > 0) {
          // Parse cardInfo to extract keyBenefits and idealForYou
          const keyBenefits = [];
          const idealForYou = [];

          // Handle cards if available
          if (data[0].card && data[0].card.length > 0) {
            data[0].card.forEach((card) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(card.cardInfo, 'text/html');
              const text = doc.querySelector('p')?.textContent || '';

              // If cardInfo is empty, skip or add fallback
              if (text) {
                // For simplicity, alternate between keyBenefits and idealForYou
                // Adjust this logic based on actual data structure
                if (keyBenefits.length < 2) {
                  keyBenefits.push(text);
                } else {
                  idealForYou.push(text);
                }
              }
            });
          }

          // Fallback content if lists are empty
          setEngagementData({
            heading: data[0].heading || '',
            subHeading:
              data[0].subHeading ||
              'Acquire a dedicated team for your project. Our professionals integrate with your in-house workforce.',
            keyBenefits: keyBenefits.length
              ? keyBenefits
              : [
                  'Enhanced technical control and real-time collaboration',
                  'No burden of recruitment or talent management',
                ],
            idealForYou: idealForYou.length
              ? idealForYou
              : [
                  'You have a clear project vision and defined requirements',
                  'You require team-level specific technical expertise',
                ],
            image: data[0].card[0]?.photo || '',
            imageAlt: data[0].card[0]?.altImg || 'Team working together in office',
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="px-4">
      <div className="max-w-8xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 h-1/2">
              <img
                src={engagementData.image ? `/api/logo/download/${engagementData.image}` : '/images/team.png'}
                alt={engagementData.imageAlt}
                className="rounded-lg w-full h-full object-contain"
              />
            </div>

            <div className="order-1 w-[80%] lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{engagementData.heading}</h2>

              <p className="text-gray-600 mb-8 leading-relaxed">{engagementData.subHeading}</p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
                <ul className="space-y-2">
                  {engagementData.keyBenefits.length === 0 ? (
                    <li className="text-gray-600 text-sm">No benefits available.</li>
                  ) : (
                    engagementData.keyBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{benefit}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ideal For You If</h3>
                <ul className="space-y-2">
                  {engagementData.idealForYou.length === 0 ? (
                    <li className="text-gray-600 text-sm">No conditions available.</li>
                  ) : (
                    engagementData.idealForYou.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Hire Us Now →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamEngagementSection;