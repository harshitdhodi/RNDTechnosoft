import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobApplicationModal from './JobApplicationModal'; // Adjust the import path as needed

const TeamEngagementSection = () => {
  const [engagementData, setEngagementData] = useState({
    heading: '',
    subHeading: '',
    cardHTML: '',
    image: '',
    imageAlt: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/hire-talent/getByPageSection?pageSection=Applications');
        const data = response.data.data;

        if (data.length > 0) {
          const firstCard = data[0].card[0];

          setEngagementData({
            heading: data[0].heading || '',
            subHeading:
              data[0].subHeading ||
              'Acquire a dedicated team for your project. Our professionals integrate with your in-house workforce.',
            cardHTML: firstCard?.cardInfo || '',
            image: firstCard?.photo || '',
            imageAlt: firstCard?.altImg || 'Team working together in office',
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

  // Functions to open and close the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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

              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: engagementData.cardHTML }}
              ></div>

              <button
                onClick={openModal} // Open modal on click
                className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Hire Us Now →
              </button>
            </div>
          </div>
        )}
      </div>
      <JobApplicationModal
        job={null} // No specific job; using null for general application
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default TeamEngagementSection;