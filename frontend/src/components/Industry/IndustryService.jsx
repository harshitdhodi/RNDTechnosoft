import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

export default function FinTechServices() {
  const { slug } = useParams();
  const [servicesData, setServicesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicesData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`/api/caseStudy/category/${slug}`);
        console.log('Services data:', response.data);

        // Handle different response structures
        const data = response.data.data || response.data;

        // Filter for software-service type data
        let softwareServiceData = null;
        if (Array.isArray(data)) {
          softwareServiceData = data.find(item => item.type === 'software-service');
        } else {
          softwareServiceData = data.type === 'software-service' ? data : null;
        }

        setServicesData(softwareServiceData);
      } catch (err) {
        console.error('Error fetching services data:', err);
        setError('Failed to load services information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !servicesData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">
          {error || 'No services data available'}
        </div>
      </div>
    );
  }

  const handleConsultationClick = () => {
    navigate('/contact');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading industry information...</p>
      </div>
    );
  }

  // Extract services from the card array
  const services = servicesData.card || [];
  const heading = servicesData.heading || '';
  const subHeading = servicesData.subHeading || '';

  return (
    <div className="max-w-8xl mx-auto px-4 xl:mx-20 xl:px-12 py-12">
      {heading && (
        <h1 className="text-3xl font-bold text-center mb-4">{heading}</h1>
      )}
      {subHeading && (
        <h2 className="text-xl text-gray-600 text-center mb-8">{subHeading}</h2>
      )}

      {services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl  lg:grid-cols-3 ">
          {services.map((service, index) => (
            <div
              key={index}
              className={`px-6 py-10 border ${
                index % 2 === 1
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">
                {service.title || service.heading || service.name}
              </h3>
              {service.details && (
                <p
                  className={`text-md ${
                    index % 2 === 1 ? 'opacity-90' : 'text-gray-600'
                  }`}
                  style={{ lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(service.details),
                  }}
                />
              )}
            </div>
          ))}
          
        </div>
      )}
      <div className="flex justify-center py-10">
      <button 
        onClick={handleConsultationClick}
        className="btn-yellow p-3 px-4 *:rounded-lg flex items-center space-x-2"
      >
        <span>{'Get a Consultation'}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      </div>
    </div>
  );
}