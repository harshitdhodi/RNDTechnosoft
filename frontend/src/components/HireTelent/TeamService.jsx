import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamServicesSection = () => {
  const [teamServicesData, setTeamServicesData] = useState({
    heading: '',
    subHeading: '',
    cards: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/hire-talent/getByPageSection?pageSection=TeamService');
        const data = response.data.data;

        if (data.length > 0) {
          // Parse cardInfo to extract title and description
          const parsedCards = data[0].card.map((card) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(card.cardInfo, 'text/html');
            const title = doc.querySelector('h3')?.textContent || '';
            const description = doc.querySelector('p')?.textContent || '';
            return {
              title,
              description,
              photo: card.photo,
              altImg: card.altImg || 'Service Image',
              _id: card._id,
            };
          });

          setTeamServicesData({
            heading: data[0].heading || '',
            subHeading: data[0].subHeading || '',
            cards: parsedCards,
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
    <section className="pt-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              dangerouslySetInnerHTML={{ __html: teamServicesData.heading }}
            />
            <p className="text-gray-600 mb-12 max-w-3xl mx-auto">{teamServicesData.subHeading}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamServicesData.cards.length === 0 ? (
                <p>No services available.</p>
              ) : (
                teamServicesData.cards.map((service) => (
                  <div key={service._id} className="text-center">
                    <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      <img
                        src={`/api/logo/download/${service.photo}`}
                        alt={service.altImg}
                        className="w-28 h-28 object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TeamServicesSection;