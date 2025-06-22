import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useParams } from "react-router-dom";
import DOMPurify from 'dompurify';

const HireDevelopersSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  // Function to normalize heading tags to <h3>
  const normalizeHeading = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = DOMPurify.sanitize(html, {
      FORBID_ATTR: ['style', 'class'],
      FORBID_TAGS: ['h1', 'h2', 'h4', 'h5', 'h6'],
      ADD_TAGS: ['h3'],
    });
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return `<h3>${textContent}</h3>`;
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/technologySecData/get/${slug}?type=hire developer`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result[0]);
        console.log("Fetched data for slug:", result[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Quill configuration
  const quillConfig = {
    readOnly: true,
    theme: null,
    modules: {
      toolbar: false,
    },
  };

  // Render loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !data) {
    return (
      <div className="text-center py-16 text-red-500">
        Error: {error || 'No data found'}
      </div>
    );
  }

  // Map API card data to the benefits structure
  const benefits = data?.card?.map((item) => ({
    title: item.heading,
    description: item.subHeading,
  })) || [];

  return (
    <div className="bg-white py-16 px-4 services-landing3">
      <div className="max-w-8xl 2xl:px-28 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <ReactQuill
              value={DOMPurify.sanitize(data?.heading || "Hire Dedicated <span class='text-yellow-500'>React JS Developers</span>", {
                FORBID_ATTR: ['style', 'class'],
                ADD_TAGS: ['h2'],
              })}
              {...quillConfig}
              className="quill-heading text-4xl md:text-xl mb-6 border-none"
            />
            <button className="bg-[#f3ca0d]  text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Hire {data?.technologyId?.imgTitle || 'React JS'} Developer
            </button>
          </div>

          {/* Right Content - Benefits List */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3" role="article" aria-label={`Benefit: ${DOMPurify.sanitize(benefit.title, { ALLOWED_TAGS: [] })}`}>
                {/* Bullet Point */}
                <div className="w-2 h-2 bg-[#f3ca0d] rounded-full mt-2 flex-shrink-0"></div>

                {/* Content */}
                <div>
                  <ReactQuill
                    value={normalizeHeading(benefit.title)}
                    {...quillConfig}
                    className="quill-heading3 text-lg font-semibold text-gray-800 mb-1 border-none"
                  />
                  <ReactQuill
                    value={DOMPurify.sanitize(benefit.description, {
                      FORBID_ATTR: ['style', 'class'],
                      ADD_TAGS: ['p'],
                    })}
                    {...quillConfig}
                    className="quill-description text-gray-600 text-sm leading-relaxed border-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireDevelopersSection;