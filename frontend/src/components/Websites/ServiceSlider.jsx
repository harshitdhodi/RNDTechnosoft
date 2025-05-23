import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

function ServiceSlider() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/services/getServicesBySlug?slug=${slug}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
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
      <div className="py-16 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-16 text-center text-gray-600">
        No services available
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: services.length > 1, // Prevent infinite loop for single item
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: services.length > 1, // Disable autoplay for single item
    autoplaySpeed: 3000,
    pauseOnHover: true, // Pause autoplay on hover
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
          arrows: false, // Hide arrows on smaller screens
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4  ">
      <div className="mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium">
          Our <span className="text-yellow-500">Services</span>
        </h2>
        <h3 className="mt-3 text-base sm:text-lg lg:text-xl text-gray-600">
          Visualizing Success Through Our Work
        </h3>
      </div>

      {services.length >= 5 ? (
        <div className="service-slider mb-20 relative">
          <Slider {...settings}>
            {services.map((service) => (
              <div key={service.slug} className="service-card   px-2 sm:px-4">
                <Link to={`/${service.slug}`} className="block">
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-lg">
                    <img
                      src={`/api/logo/download/${service.photo}`}
                      alt={service.alt}
                      title={service.imgtitle}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      loading="lazy" // Optimize image loading
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-gray-600 text-sm sm:text-base hover:text-yellow-500 transition-colors">
                      {service.category}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service) => (
            <div
              key={service.slug}
              className="service-card p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
            >
              <Link to={`/${service.slug}`} className="block">
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-lg">
                  <img
                    src={`/api/logo/download/${service.photo}`}
                    alt={service.alt}
                    title={service.imgtitle}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-3 text-center">
                  <span className="text-gray-600 text-sm sm:text-base hover:text-yellow-500 transition-colors">
                    {service.category}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -right-4 sm:-right-6 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 sm:p-3 z-10 hover:bg-gray-100 transition-colors"
    onClick={onClick}
    aria-label="Next slide"
  >
    <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 -left-4 sm:-left-6 transform -translate-y-1/2 bg-white rounded-full shadow-lg p-2 sm:p-3 z-10 hover:bg-gray-100 transition-colors"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-gray-700" />
  </button>
);

export default ServiceSlider;