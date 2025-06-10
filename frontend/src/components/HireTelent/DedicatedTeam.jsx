import React, { useState, useEffect } from 'react';
import axios from 'axios';
import image from '../../images/Rectangle.png';
import react from '../../images/technology/react.png';

const DedicatedTeam = () => {
  const [hireTalentData, setHireTalentData] = useState({
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
        const response = await axios.get('/api/hire-talent/getByPageSection?pageSection=WhyChoose');
        const data = response.data.data;

        // Assuming the API returns an array, take the first record (or adjust based on your backend logic)
        if (data.length > 0) {
          setHireTalentData({
            heading: data[0].heading || '',
            subHeading: data[0].subHeading || '',
            cards: data[0].cards || [], // Use 'cards' to match backend schema
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
    <div className="relative py-16 min-h-screen">
      {/* Background image with overlay */}
      <div className="absolute inset-0 h-full">
        <img src={image} alt="Background" className="w-full h-full object-fill" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-black">
        {/* Header Section */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <h1 className="text-4xl font-bold mb-4">{hireTalentData.heading}</h1>
              <p
                className="text-lg max-w-3xl mx-auto text-black text-opacity-80"
                dangerouslySetInnerHTML={{ __html: hireTalentData.subHeading }}
              />
            </>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-8xl mx-auto">
          {loading ? (
            <p>Loading cards...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : hireTalentData.cards.length === 0 ? (
            <p>No cards available.</p>
          ) : (
            hireTalentData.cards.map((card, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-md border-t-4 border-yellow-400 text-black text-center"
              >
                <div className="flex flex-col justify-start items-start space-y-3">
                  <img
                    src={card.photo ? `/api/logo/download/${card.photo}` : react}
                    alt={card.altImg || 'Card Image'}
                    className="object-contain w-5 h-5"
                  />
                  <h2 className="text-xl font-semibold">{card.imgTitle || 'Card Title'}</h2>
                  <div
                    className="text-gray-700 text-left"
                    dangerouslySetInnerHTML={{ __html: card.cardInfo }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <button className="bg-yellow-400 text-black font-medium py-3 px-16 rounded-md hover:bg-yellow-500 transition">
            Hire Us Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default DedicatedTeam;