import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

function ServiceSlider() {
  const [services, setServices] = useState([]); // Initial state as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/services/getServicesBySlug?slug=${slug}`);
        const data = await response.json();

        // Check if the fetched data is an array before setting it
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]); // Reset to an empty array if data is not an array
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
     null
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  // If services array is empty, return null
  if (services.length === 0) {
    return null; // or <div>No services available</div>
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, // Set autoplay speed (in milliseconds)
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-medium">
          Our <span className="text-yellow-500">Services</span>
        </h2>
        <h3 className="mt-4 text-lg md:text-xl">
          Visualizing Success Through Our Work
        </h3>
      </div>

      {services.length > 5 ? (
        // If services > 5, show as a slider
        <div className="service-slider relative">
          <Slider {...settings}>
            {services.map((service) => (
              <div key={service.slug} className="service-card p-4">
                <Link to={`/${service.slug}`}>
                  <div className="relative h-56 md:h-72 lg:h-80 overflow-hidden">
                    <img
                      src={`/api/logo/download/${service.photo}`}
                      alt={service.alt}
                      title={service.imgtitle}
                      className="w-full h-full object-contain transition-transform duration-300 transform hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="mt-4 text-center">
                  <Link to={`/${service.slug}`} className="text-gray-600 mt-1 text-sm md:text-base">
                    {service.category}
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        // If services <= 5, show as a grid
        <div
        className={`flex justify-center items-center gap-4`}
      >
          {services.map((service) => (
            <div key={service.slug} className="service-card p-4 border border-gray-500">
              <Link to={`/${service.slug}`}>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`/api/logo/download/${service.photo}`}
                    alt={service.alt}
                    title={service.imgtitle}
                    className="w-full h-full object-contain transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
              </Link>
              <div className="mt-4 text-center">
                <Link to={`/${service.slug}`} className="text-gray-600 mt-1 text-sm md:text-base">
                  {service.category}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const NextArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white rounded-full shadow-lg cursor-pointer z-10"
    onClick={onClick}
  >
    <ChevronRightIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white rounded-full shadow-lg cursor-pointer z-10"
    onClick={onClick}
  >
    <ChevronLeftIcon className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
  </div>
);

export default ServiceSlider;
