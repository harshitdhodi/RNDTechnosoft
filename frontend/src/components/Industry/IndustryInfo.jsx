import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const IndustryInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [industryData, setIndustryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustryData = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/caseStudy/category/${slug}`);
        console.log('Industry data:', response.data);
        
        // Handle different response structures
        const data = response.data.data || response.data;
        
        // Filter for applications type data
        let applicationsData = null;
        if (Array.isArray(data)) {
          applicationsData = data.find(item => item.type === 'info');
        } else {
          applicationsData = data.type === 'applications' ? data : null;
        }
        
        setIndustryData(applicationsData);
        
      } catch (err) {
        console.error('Error fetching industry data:', err);
        setError('Failed to load industry information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustryData();
  }, [slug]);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/industries')}
            className="bg-[#f3ca0d] font-semibold py-3 px-6 rounded-lg text-gray-700 transition"
          >
            Back to Industries
          </button>
        </div>
      </div>
    );
  }

  if (!industryData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Not Found</h2>
          <p className="text-gray-600 mb-6">The requested industry information could not be found.</p>
          <button 
            onClick={() => navigate('/industries')}
            className="bg-[#f3ca0d] font-semibold py-3 px-6 rounded-lg text-gray-700 transition"
          >
            Back to Industries
          </button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const title = industryData?.heading || industryData?.title || industryData?.name;
  const description = industryData?.subHeading || industryData?.description || industryData?.content;
  const buttonText = industryData?.ctaText;

  return (
    <div className="flex flex-col items-center justify-center py-10 my-10 px-4">
      {title && (
        <h1 className="md:text-3xl max-w-5xl text-xl lg:text-4xl font-bold text-center text-gray-900 mb-6">
          {title}
        </h1>
      )}
      
      {description && (
        <p className="text-lg md:text-xl text-center text-gray-600 mb-8 max-w-5xl">
          {description}
        </p>
      )}
      
      <button 
        onClick={handleConsultationClick}
        className="btn-yellow rounded flex items-center space-x-2 hover:text-white"
      >
        <span >{buttonText || 'Get a Consultation'}</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
};

export default IndustryInfo;