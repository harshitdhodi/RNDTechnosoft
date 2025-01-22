import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { IoMdClose, IoMdFunnel } from "react-icons/io";
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
  const imageRefs = useRef([]);
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
      setPortfolios([]);  // Clear portfolios when categories are fetched
      const response = await axios.get(`/api/Portfolio/getAllSubcategoriesBySlug?slug=${slug}`);
      const fetchedCategories = response.data.subcategories;
      const allCategories = [
        { slug: "all", category: "All" },
        ...fetchedCategories,
      ];
      setCategories(allCategories);
      setSelectedCategory(allCategories[0]);  // Set default category to "All"
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPortfolios = async () => {
    if (!selectedCategory) return;

    try {
      let response;
      if (selectedCategory.slug === "all") {
        response = await axios.get(`/api/Portfolio/getCategoryPortfolio?categoryId=${slug}`);
      } else {
        response = await axios.get(`/api/Portfolio/getSubcategoryPortfolio?subcategoryId=${selectedCategory.slug}`);
      }
      setPortfolios(response.data);

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
    }
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory?.slug === category.slug) return;

    // GSAP animation to scale down images before changing category
    gsap.to(imageRefs.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setSelectedCategory(category);
        setIsFilterOpen(false);  // Close the filter on category change
      },
    });
  };

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div className="flex flex-col items-center justify-center my-16 relative bg-white overflow-hidden">
      <button
        className="sm:hidden mx-0 w-auto h-auto flex items-center justify-start px-4 py-2 text-xl font-inter focus:outline-none bg-yellow-500 text-white rounded-lg"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <IoMdFunnel className="mr-2" />
        Filter
      </button>

      {/* Category buttons for desktop view */}
      <div className="hidden sm:flex space-x-8">
        {categories.map((item) => (
          <button
            key={item.slug}
            onClick={() => handleCategoryClick(item)}
            className={`px-4 py-2 sm:text-lg md:text-xl lg:text-2xl font-inter focus:outline-none ${
              selectedCategory?.slug === item.slug
                ? "text-yellow-500"
                : "text-gray-800 border-transparent"
            }`}
          >
            {item.category}
          </button>
        ))}
      </div>

      {/* Filter options for mobile view */}
      {isFilterOpen && (
        <div className="sm:hidden fixed inset-0 bg-white z-50 p-4">
          <button
            className="absolute top-4 right-4 text-gray-800 text-3xl"
            onClick={() => setIsFilterOpen(false)}
          >
            <IoMdClose />
          </button>
          <div className="flex flex-col space-y-4 mt-10">
            {categories.map((item) => (
              <button
                key={item.slug}
                onClick={() => handleCategoryClick(item)}
                className={`px-4 py-2 text-lg font-inter focus:outline-none ${
                  selectedCategory?.slug === item.slug
                    ? "text-yellow-500"
                    : "text-gray-800 border-transparent"
                }`}
              >
                {item.category}
              </button>
            ))}
            <button
              className="px-4 py-2 text-lg font-inter mt-4 bg-yellow-500 text-white rounded-lg"
              onClick={() => setIsFilterOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Current Filter Text */}
      <div className="mt-4 sm:hidden text-[#F55F42] text-base">
        <span>Current Filter: {selectedCategory?.category}</span>
      </div>

      {selectedCategory && (
        <div className="mt-12 text-center mx-10 sm:mx-20">
          <div className="grid lg:grid-cols-4 grid-cols-3 sm:grid-cols-2 gap-6 mt-6">
            {portfolios.map((item, index) =>
              item.photo[0] ? (
                <div key={index} className="relative cursor-pointer group">
                  <img
                    src={`/api/image/download/${item.photo[0]}`}
                    alt={item.alt || "Project Image"}
                    className="w-full h-96 object-cover rounded-lg shadow-xl border"
                    loading="lazy"
                  />
                  <div
                    onClick={() =>
                      handleImageClick(item.photo[1] ? item.photo[1] : item.photo[0])
                    }
                    className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-40 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 ease-in-out"
                  >
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-semibold p-2">
                        {item.imgtitle[0]}
                      </h3>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="px-4 py-2 bg-[#f5e042] text-white rounded-lg hover:bg-[#e6d43d] transition-colors">
                            Visit Website
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-auto">
          <img
            src={`/api/image/download/${fullscreenImage}`}
            alt="Fullscreen view"
            className="w-full h-auto object-cover"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl md:text-4xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
            onClick={closeFullscreen}
          >
            <IoMdClose />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
