import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { IoMdClose, IoMdFunnel, IoMdEye } from "react-icons/io";
import { useParams } from "react-router-dom";

const ProjectsSection = () => {
  const [categories, setCategories] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    slug: "all",
    category: "All",
  });
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const imageRefs = useRef([]);
  const sectionRef = useRef(null);
  const { slug } = useParams();

  useEffect(() => {
    fetchCategories();
  }, [slug]);

  useEffect(() => {
    if (selectedCategory) {
      fetchPortfolios();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setPortfolios([]); // Clear portfolios when categories are fetched
      const response = await axios.get(`/api/Portfolio/getAllSubcategoriesBySlug?slug=${slug}`);
      const fetchedCategories = response.data.subcategories;
      const allCategories = [
        { slug: "all", category: "All" },
        ...fetchedCategories,
      ];
      setCategories(allCategories);
      setSelectedCategory(allCategories[0]); // Set default category to "All"
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const fetchPortfolios = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      let response;
      if (selectedCategory.slug === "all") {
        response = await axios.get(`/api/Portfolio/getCategoryPortfolio?categoryId=${slug}`);
      } else {
        response = await axios.get(`/api/Portfolio/getSubcategoryPortfolio?subcategoryId=${selectedCategory.slug}`);
      }
      setPortfolios(response.data);
      setLoading(false);

      // Reset the image refs array to match the new portfolios length
      imageRefs.current = Array(response.data.length).fill().map((_, i) => imageRefs.current[i] || createRef());

      // GSAP animation to fade out and in images
      gsap.to(imageRefs.current, {
        scale: 0,
        opacity: 0,
        duration: 0,
        onComplete: () => {
          gsap.to(imageRefs.current, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
          });
        },
      });
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setLoading(false);
    }
  };

  const createRef = () => React.createRef();

  const handleCategoryClick = (category) => {
    if (selectedCategory?.slug === category.slug) return;

    // GSAP animation to scale down images before changing category
    gsap.to(imageRefs.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setSelectedCategory(category);
        setIsFilterOpen(false); // Close the filter on category change
      },
    });
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
    // Prevent body scrolling when fullscreen is open
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    // Restore body scrolling
    document.body.style.overflow = "auto";
  };

  return (
    <div ref={sectionRef} className="flex flex-col w-full max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-6 sm:py-5 relative bg-white">
      {/* Mobile Filter Button */}
      <div className="flex justify-between items-center w-full mb-4 sm:mb-6">
        <button
          className="sm:hidden flex items-center justify-center px-3 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg shadow-sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <IoMdFunnel className="mr-2" />
          Filter
        </button>
      </div>

      {/* Category buttons for tablet/desktop view */}
      <div className="hidden sm:flex flex-wrap gap-4 mb-6">
        {categories.map((item) => (
          <button
            key={item.slug}
            onClick={() => handleCategoryClick(item)}
            className={`px-4 py-2 text-sm md:text-base lg:text-md font-medium rounded-full transition-all duration-300 ${
              selectedCategory?.slug === item.slug
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {item.category}
          </button>
        ))}
      </div>

      {/* Filter drawer for mobile view */}
      {isFilterOpen && (
        <div className="sm:hidden fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Select Category</h3>
            <button
              className="text-gray-800 text-2xl"
              onClick={() => setIsFilterOpen(false)}
            >
              <IoMdClose />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <div className="flex flex-col space-y-2">
              {categories.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleCategoryClick(item)}
                  className={`px-4 py-3 text-left text-base font-medium rounded-lg ${
                    selectedCategory?.slug === item.slug
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.category}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <button
              className="w-full py-3 bg-yellow-500 text-white rounded-lg font-medium shadow-md"
              onClick={() => setIsFilterOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Current filter indicator */}
      <div className="sm:hidden mb-4">
        <span className="text-sm font-medium text-gray-600">
          Showing: <span className="text-yellow-500">{selectedCategory?.category}</span>
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="w-full py-20 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Projects grid */}
      {!loading && selectedCategory && (
        <div className="w-full ">
          {portfolios.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No projects found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {portfolios.map((item, index) =>
                item.photo[0] ? (
                  <div 
                    key={index} 
                    className="relative h-[280px] sm:h-[320px] rounded-lg overflow-hidden shadow-md border border-gray-200"
                    ref={el => imageRefs.current[index] = el}
                  >
                    <img
                      src={`/api/image/download/${item.photo[0]}`}
                      alt={item.alt || "Project Image"}
                      className="w-full h-full object-fill transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
                      <h3 className="text-white text-lg font-semibold mb-2">{item.imgtitle[0]}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleImageClick(item.photo[1] ? item.photo[1] : item.photo[0])}
                          className="flex items-center justify-center px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                        >
                          <IoMdEye className="mr-1" />
                          View
                        </button>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="px-3 py-1.5 bg-white text-gray-800 rounded-md text-sm hover:bg-gray-100 transition-colors">
                              Visit
                            </button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50  overflow-auto">
         <div className="flex items-start justify-center  h-full">
           <img
            src={`/api/image/download/${fullscreenImage}`}
            alt="Fullscreen view"
            className="w-1/2 h-auto object-cover"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl md:text-4xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
            onClick={closeFullscreen}
          >
            <IoMdClose />
          </button>
         </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;