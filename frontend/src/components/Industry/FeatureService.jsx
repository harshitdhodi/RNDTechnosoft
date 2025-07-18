import React, { useState, useEffect } from "react";
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import img from "../../images/Rectangle.png";

export default function Home() {
  const { slug } = useParams(); // Get slug from URL parameters
  const [applicationsData, setApplicationsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data using dynamic slug
        const response = await axios.get(`/api/caseStudy/category/${slug}`);
        console.log('Applications data:', response.data);

        // Handle response as an array
        const data = Array.isArray(response.data) ? response.data : [];

        // Find application type data
        const applicationData = data.find(item => item.type === 'applications') || null;

        setApplicationsData(applicationData);
      } catch (err) {
        console.error('Error fetching applications data:', err);
        setError('Failed to load applications information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationsData();
  }, [slug]); // Refetch if slug changes

  if (isLoading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 h-full">
          <img
            src={img}
            alt="Background"
            className="w-full h-full object-fill"
          />
        </div>
        <div className="container mx-auto px-4 z-0 py-16 relative">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !applicationsData) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 h-full">
          <img
            src={img}
            alt="Background"
            className="w-full h-full object-fill"
          />
        </div>
        <div className="container mx-auto px-4 z-0 py-16 relative">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg text-red-600">
              {error || 'No applications data available'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract applications from the card array
  const applications = applicationsData.card || [];
  const heading = applicationsData.heading || 'Trusted FinTech Software Development Partner';
  const subHeading = applicationsData.subHeading || (
    'We create custom FinTech solutions that work flawlessly, manage financial services, and accelerate your ' +
    'business success. As a forward-thinking fintech app development company, we deliver secure, scalable, and ' +
    'high-performing applications tailored to your unique goals.'
  );

  return (
    <div className="relative min-h-screen">
      {/* Background image */}
      <div className="absolute inset-0 h-full">
        <img
          src={img}
          alt="Background"
          className="w-full h-full object-fill"
        />
      </div>

      {/* Main content */}
      <div className="max-w-8xl xl:px-12 xl:mx-20 mx-auto px-4 z-0 relative">
        <div className="max-w-8xl pt-20 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h1>
          <p
            className="text-lg mb-12"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subHeading) }}
          />

          <div className="grid grid-cols-1 pb-20 md:grid-cols-2 gap-16">
            {applications.map((application, index) => (
              <FinTechCard
                key={index}
                title={application.title}
                features={
                  application.details
                    ? DOMPurify.sanitize(application.details, { ALLOWED_TAGS: [] }) // Strip HTML tags
                        .split('\n')
                        .filter(item => item.trim())
                    : []
                }
                topImage={application.photo ? `/api/logo/download/${application.photo}` : null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinTechCard({ title, features, topImage }) {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden border border-gray-800 flex flex-col">
      {/* Top image with title overlay */}
      <div className="p-6">
        <div className="relative w-full h-48 rounded-md overflow-hidden"> {/* Fixed height */}
          {topImage && (
            <img src={topImage} alt="Card Top" className="w-full h-full object-fill" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-60 rounded-md" />
          <div
            className="absolute left-0 bottom-[20%] px-4"
            style={{ width: "70%" }}
          >
            <h3 className="text-2xl font-medium text-white text-left">{title}</h3>
          </div>
        </div>
      </div>
      {/* Features list */}
      <div className="px-6 pb-6 flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-black">•</span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}