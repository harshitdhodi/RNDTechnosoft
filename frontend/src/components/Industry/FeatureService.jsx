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

      const response = await axios.get(`/api/caseStudy/category/${slug}`);
      console.log("Applications data:", response.data);

      // ✅ Correctly extract the array
      const data = Array.isArray(response.data.data) ? response.data.data : [];

      // ✅ Find the "applications" type
      const applicationData = data.find(
        (item) => item.type === "applications"
      ) || null;

      setApplicationsData(applicationData);
    } catch (err) {
      console.error("Error fetching applications data:", err);
      setError("Failed to load applications information");
    } finally {
      setIsLoading(false);
    }
  };

  fetchApplicationsData();
}, [slug]);


    if (isLoading) {
      return (
        <div className="relative min-h-screen">
          <div className="absolute inset-0 h-full w-full">
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-16 relative">
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
          <div className="absolute inset-0 h-full w-full">
            <img
              src={img}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-16 relative">
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
    const heading = applicationsData.heading || 'Trusted Healthcare Software Development Partner';
    const subHeading = applicationsData.subHeading || (
      'We create custom FinTech solutions that work flawlessly, manage financial services, and accelerate your ' +
      'business success. As a forward-thinking fintech app development company, we deliver secure, scalable, and ' +
      'high-performing applications tailored to your unique goals.'
    );

    return (
      <div className="relative min-h-screen">
        {/* Background image */}
        <div className="absolute inset-0 h-full w-full">
          <img
            src={img}
            alt="Background"
            className="w-full h-full object-cover xl:object-fill"
          />
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 xl:py-36 relative">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h1>
            <p
              className="text-lg mb-12 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subHeading) }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
              {applications.map((application, index) => (
                <FinTechCard
                  key={index}
                  title={application.title}
                  features={
                    application.details
                      ? DOMPurify.sanitize(application.details)
                      : ""
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
      <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col max-w-[600px] mx-auto">
        {/* Top image with title overlay */}
        <div className="p-6">
          <div className="relative w-full h-[236px] rounded-md overflow-hidden">
            {topImage && (
              <img src={topImage} alt="Card Top" className="w-[548px] h-[236px] object-cover" />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md" />
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
          <div
            className="prose prose-sm max-w-none text-sm text-left"
            dangerouslySetInnerHTML={{ __html: features }}
          />
        </div>
      </div>
    );
  }