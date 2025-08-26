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
  const [sliderError, setSliderError] = useState(false);
  const [showAsGrid, setShowAsGrid] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/services/getServicesBySlug?slug=${slug}`);
        const data = await response.json();
        console.log('Fetched services:', data);
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

  // Handle slider initialization error
  const handleSliderError = () => {
    console.warn('Slider failed to initialize, falling back to grid view');
    setSliderError(true);
    setShowAsGrid(true);
  };

  if (loading) {
    return (
      <div className="pb-16 text-center">
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
    infinite: services.length > 1,
    speed: 500,
    slidesToShow: Math.min(5, services.length),
    slidesToScroll: 1,
    autoplay: services.length > 1,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    onInit: () => {
      // Slider initialized successfully
      setSliderError(false);
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(4, services.length),
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, services.length),
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, services.length),
          slidesToScroll: 1,
          dots: false,
          arrows: false,
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

  // Determine whether to show slider or grid
  // Only show slider if we have 3 or more services AND no errors AND user hasn't manually chosen grid
  const shouldShowSlider = services.length >= 3 && !sliderError && !showAsGrid;

  const renderServiceCard = (service) => (
    <div key={service.slug} className="service-card px-2  sm:px-4">
      <Link to={`/${service.slug}`} className="block">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-lg">
          <img
            src={`/api/logo/download/${service.photo}`}
            alt={service.alt}
            title={service.imgtitle}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.warn(`Failed to load image: ${service.photo}`);
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="mt-3 text-center">
          <span className="text-gray-600 text-sm sm:text-base hover:text-yellow-500 transition-colors">
            {service.category}
          </span>
        </div>
      </Link>
    </div>
  );

  const renderGridCard = (service) => (
    <div
      key={service.slug}
      className="service-card px-4 border shadow-xl mt-5  border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
    >
      <Link to={`/${service.slug}`} className="block">
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-lg">
          <img
            src={`/api/logo/download/${service.photo}`}
            alt={service.alt}
            title={service.imgtitle}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.warn(`Failed to load image: ${service.photo}`);
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="mt-3 text-center">
          <span className="text-gray-600 text-sm sm:text-base hover:text-yellow-500 transition-colors">
            {service.category}
          </span>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="container 2xl:max-w-[85rem] 2xl:px-0  mx-auto px-4">
      <div className="mb-4 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium">
          Our <span className="text-yellow-500">Services</span>
        </h2>
        <h3 className="mt-3 text-base sm:text-lg lg:text-xl text-gray-600">
          Visualizing Success Through Our Work
        </h3>
      </div>

      {/* Toggle button for manual switching - only show if we have enough items for slider */}
      {/* {services.length >= 3 && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowAsGrid(!showAsGrid)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
          >
            {showAsGrid ? 'Show as Slider' : 'Show as Grid'}
          </button>
        </div>
      )} */}

      {shouldShowSlider ? (
        <div className="service-slider mb-20 relative">
          <ErrorBoundary onError={handleSliderError}>
            <Slider {...settings}>
              {services.map(renderServiceCard)}
            </Slider>
          </ErrorBoundary>
        </div>
      ) : (
        <div className={`grid gap-4 mb-20 ${
          services.length === 1 
            ? 'grid-cols-1 justify-items-center max-w-sm mx-auto' 
            : services.length <= 3 
            ? 'grid-cols-1 sm:grid-cols-2 justify-items-center max-w-2xl mx-auto' 
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {services.map(renderGridCard)}
        </div>
      )}

      {sliderError && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Slider view unavailable - showing grid layout
        </div>
      )}
    </div>
  );
}

// Error boundary component to catch slider errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Slider error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent component handle fallback
    }

    return this.props.children;
  }
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