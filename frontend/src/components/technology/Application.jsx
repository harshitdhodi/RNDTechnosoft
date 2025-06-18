import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import img1 from '../../images/HowRnd/agile.png';

const ServicesLanding = () => {
  const { slug } = useParams();
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to normalize heading tags to <h2>
  const normalizeHeading = (html) => {
    // Strip tags and wrap content in <h2>
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(html, {
      FORBID_ATTR: ['style', 'class'],
      FORBID_TAGS: ['h1', 'h3', 'h5'], // Remove unwanted heading tags
      ADD_TAGS: ['h2'], // Allow h2
    });

    // Extract text content and wrap in <h2>
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return `<h2>${textContent}</h2>`;
  };

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/technologySecData/get/${slug}?type=Technology Application`);
        if (!response.ok) {
          throw new Error('Failed to fetch services data');
        }
        const data = await response.json();
        console.log('Fetching services data for slug:', data);
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

  // Quill configuration
  const quillConfig = {
    readOnly: true,
    theme: null,
    modules: {
      toolbar: false,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || servicesData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 font-medium">
          <p>{error || 'No services data found for this section.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 services-landing">
      {servicesData.map((section, sectionIndex) => (
        <section key={sectionIndex} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Section Heading */}
          {section.heading && (
            <div className="text-center max-w-5xl mx-auto mb-12">
              <ReactQuill
                value={DOMPurify.sanitize(section.heading, {
                  FORBID_ATTR: ['style', 'class'],
                  ADD_TAGS: ['h2'],
                })}
                {...quillConfig}
                className="quill-heading border-none"
              />
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(section.card || []).map((service, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none"
                role="article"
                aria-label={`Service: ${service.heading || 'Service Card'}`}
              >
                {/* Icon/Image */}
                <div className="mb-4 flex justify-center group-hover:scale-105 transition-transform duration-300">
                  {service.photo ? (
                    <img
                      src={`/api/logo/download/${service.photo}`}
                      alt={service.altName || service.heading || 'Service icon'}
                      title={service.imgTitle || service.heading}
                      className="w-12 h-12 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="flex items-center justify-center w-12 h-12 text-gray-400"
                    style={{ display: service.photo ? 'none' : 'flex' }}
                  >
                    <img src={img1} alt="Fallback icon" className="object-contain w-12 h-12" loading="lazy" />
                  </div>
                </div>

                {/* Service Heading */}
                <ReactQuill
                  value={normalizeHeading(service.heading)} // Normalize to <h2>
                  {...quillConfig}
                  className="quill-heading text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 border-none"
                />

                {/* Service Description */}
                <ReactQuill
                  value={DOMPurify.sanitize(service.subHeading, {
                    FORBID_ATTR: ['style', 'class'],
                    ADD_TAGS: ['p'],
                  })}
                  {...quillConfig}
                  className="quill-description text-gray-600 text-sm lg:text-base leading-relaxed border-none"
                />

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ServicesLanding;