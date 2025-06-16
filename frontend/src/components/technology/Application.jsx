import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify'; // Optional for sanitizing HTML

const ServicesLanding = () => {
  const { slug } = useParams();
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/technologySecData/get/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services data');
        }
        
        const data = await response.json();
        setServicesData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching services data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchServicesData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services data...</p>
        </div>
      </div>
    );
  }

  if (error || servicesData.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error || "No services data found for this section."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Services Grid */}
      {servicesData.map((section, sectionIndex) => (
        <div key={sectionIndex} className="max-w-8xl pt-10 mx-auto px-32 pb-20">
          {section.heading && (
            <div className="text-center mb-12">
              <ReactQuill
                value={DOMPurify.sanitize(section.heading)} // Sanitize HTML
                readOnly={true}
                theme={null} // Disable Quill's editor UI
                className="quill-heading"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(section.card || []).map((service, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20"
              >
                {/* Icon/Image */}
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.photo ? (
                    <img 
                      src={`/api/logo/download/${service.photo}`}
                      alt={service.altName || service.heading}
                      title={service.imgTitle || service.heading}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <div 
                    className="text-4xl flex items-center justify-center w-16 h-16 text-gray-400"
                    style={{ display: service.photo ? 'none' : 'flex' }}
                  >
                    {service.type || '🔧'}
                  </div>
                </div>
                
                {/* Title */}
                <h3   dangerouslySetInnerHTML={{ __html: service.heading }}>
               
                </h3>
                {/* <ReactQuill
                  value={DOMPurify.sanitize(service.heading)} // Sanitize HTML
                  readOnly={true}
                  theme={null}
                  className="quill-heading text-xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-yellow-500 transition-colors duration-300"
                /> */}
                
                {/* Description */}
              <h4 className="text-gray-600 leading-relaxed text-sm lg:text-base" 
                  dangerouslySetInnerHTML={{ __html: service.subHeading }}>
              
                </h4>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesLanding;