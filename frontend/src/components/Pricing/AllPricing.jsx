import React, { useState, useEffect } from "react";
import { IoMdClose, IoMdFunnel } from "react-icons/io";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const PricingSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pricingData, setPricingData] = useState({});
  const [heading, setHeading] = useState("");
  const [subHeading, setSubheading] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get('/api/pageHeading/heading?pageType=package', { withCredentials: true });
        const { heading, subheading } = response.data;
        setHeading(heading || '');
        setSubheading(subheading || '');
      } catch (error) {
        console.error(error);
      }
    };
    fetchHeadings();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = location.pathname.split('/').filter(Boolean).pop();
        const response = await axios.get(`/api/packages/front/${slug}`, { withCredentials: true });
        setPricingData(response.data.data);
        if (Object.keys(response.data.data).length > 0) {
          setSelectedCategory(Object.keys(response.data.data)[0]);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };
    fetchData();
  }, [location.pathname]);

  const categories = Object.keys(pricingData);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const parseJsonArray = (jsonArray) => {
    try {
      return JSON.parse(jsonArray);
    } catch {
      return [];
    }
  };

  const renderPricingCards = () => {
    let items = [];
    if (selectedCategory && pricingData[selectedCategory]) {
      if (Array.isArray(pricingData[selectedCategory])) {
        items = pricingData[selectedCategory];
      } else if (selectedSubcategory && pricingData[selectedCategory][selectedSubcategory]) {
        items = pricingData[selectedCategory][selectedSubcategory];
      }
    }

    return items.map((item) => {
      const whatYouGet = parseJsonArray(item.whatYouGet[0]);
      const whatIsTheir = parseJsonArray(item.whatIsTheir[0]);
      const whatIsNotTheir = parseJsonArray(item.whatIsNotTheir[0]);

      return (
        <div key={item._id} className="bg-[#F7F4EE] border border-gray-300 shadow-lg rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <span dangerouslySetInnerHTML={{ __html: item.description }}/>
          <p className="text-4xl text-black font-bold pb-2">${item.price}</p>
          <button className="mt-2 w-full px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm sm:text-base">
            Get Started
          </button>
          <div className="mb-2 pt-3">
            <strong>What you get with {item.title}</strong>
            <ul className="mt-2 mb-4 text-md text-black">
              {whatYouGet.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="mt-2 mb-4 text-md text-gray-600">
            <ul className="list-disc list-inside">
              {whatIsTheir.map((detail, index) => (
                <li key={index} className="flex items-center gap-1"><FaCheck className="text-green-600 text-md" />{detail}</li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <ul className="mt-2 mb-4 text-md text-gray-600">
              {whatIsNotTheir.map((exclusion, index) => (
                <li key={index} className="flex items-center gap-1"><RxCross2 className="text-red-600 text-md" />{exclusion}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mt-20">
      <div className="text-center p-6 rounded-lg shadow-md">
        <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-800 mb-4">{heading}</h2>
        <p className="text-lg md:text-2xl px-4 md:px-20 text-gray-600">{subHeading}</p>
      </div>

      <div className="relative bg-white overflow-hidden  ">
        {/* Filter button for small screens */}
        <button
          className="sm:hidden mt-20 mx-0 w-auto flex items-center justify-center px-4 py-2 text-lg font-inter focus:outline-none bg-[#333] text-white rounded-lg"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-expanded={isFilterOpen}
        >
          <IoMdFunnel className="mr-2" />
          Filter
        </button>

        {/* Filter options for small screens */}
        {isFilterOpen && (
          <div className="sm:hidden fixed h-auto inset-0 bg-white z-10 p-4">
            <button
              className="absolute top-4 right-4 text-gray-800 text-3xl"
              onClick={() => setIsFilterOpen(false)}
              aria-label="Close filter"
            >
              <IoMdClose />
            </button>
            <div className="flex flex-col space-y-4 mt-10">
            {categories.filter(category => pricingData[category] && 
              (Array.isArray(pricingData[category]) ? pricingData[category].length > 0 : Object.keys(pricingData[category]).length > 0)
            ).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 text-lg font-inter focus:outline-none ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white rounded-lg"
                      : "text-gray-800 border-transparent"
                  }`}
                >
                  {category}
                </button>
              ))}
              {selectedCategory && pricingData[selectedCategory] && !Array.isArray(pricingData[selectedCategory]) && (
                <div className="mt-4">
                  {Object.keys(pricingData[selectedCategory]).map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => handleSubcategoryClick(subcategory)}
                      className={`px-4 py-2 text-lg font-inter focus:outline-none ${
                        selectedSubcategory === subcategory
                          ? "bg-yellow-500 text-white rounded-lg"
                          : "text-gray-800 border-transparent"
                      }`}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              )}
          
            </div>
          </div>
        )}

        {/* Filter options for larger screens */}
        <div className="hidden sm:flex flex-col items-center justify-center bg-white mt-10">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.filter(category => pricingData[category] && 
              (Array.isArray(pricingData[category]) ? pricingData[category].length > 0 : Object.keys(pricingData[category]).length > 0)
            ).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 text-lg font-inter focus:outline-none ${
                  selectedCategory === category
                    ? "bg-black text-white rounded-lg"
                    : "text-gray-800 border border-gray-300 rounded-lg"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {selectedCategory && pricingData[selectedCategory] && !Array.isArray(pricingData[selectedCategory]) && (
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {Object.keys(pricingData[selectedCategory]).map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  className={`px-4 py-2 text-lg font-inter focus:outline-none ${
                    selectedSubcategory === subcategory
                      ? "bg-black text-white rounded-lg"
                      : "text-gray-800 border border-gray-300 rounded-lg"
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 px-4">
          {renderPricingCards()}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
