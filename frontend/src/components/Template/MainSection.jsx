import React, { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import axios from "axios";

const valuetext = (value) => `${value}`;

const marks = [
  { value: 1, label: "$1" },
  { value: 1000, label: "$1000" },
];

const App = () => {
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 1000]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [categories, setCategories] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    selectedSortOption,
    selectedAssetTypes,
    selectedIndustries,
    priceRange,
    allProducts,
  ]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "/api/product/front"
      );
      console.log("API Response:", response.data);

      setCategories(response.data.data);

      const products = Object.values(response.data.data).flatMap((category) =>
        Object.values(category).flat()
      );
      console.log("Extracted Products:", products);

      setAllProducts(products);
      setFilteredCards(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

 // Handler for sorting option change
const handleSortOptionChange = (option) => {
  console.log("Selected Sort Option:", option);
  setSelectedSortOption(option);
};

// Handler for asset type change
const handleAssetTypeChange = (type, checked) => {
  console.log("Asset Type Change:", type, "Checked:", checked);
  if (checked) {
    setSelectedAssetTypes([...selectedAssetTypes, type]);
  } else {
    setSelectedAssetTypes(selectedAssetTypes.filter((t) => t !== type));
  }
};

// Handler for industry change
const handleIndustryChange = (industry, checked) => {
  console.log("Industry Change:", industry, "Checked:", checked);
  if (checked) {
    setSelectedIndustries([...selectedIndustries, industry]);
  } else {
    setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
  }
};

// Handler for price range change
const handlePriceRangeChange = (event, newValue) => {
  console.log("Price Range Change:", newValue);
  setPriceRange(newValue);
};

// Handler for resetting filters
const handleResetFilters = () => {
  console.log("Reset Filters");
  setSelectedSortOption("");
  setSelectedAssetTypes([]);
  setSelectedIndustries([]);
  setPriceRange([1, 1000]);
  setFilteredCards(allProducts);
};

const applyFilters = () => {
  let filtered = allProducts;

  console.log("Initial All Products:", allProducts);
  console.log("Applying Filters with:", {
    selectedAssetTypes,
    selectedIndustries,
    priceRange,
    selectedSortOption,
  });

  if (selectedAssetTypes.length > 0) {
    console.log("Asset Types Filter Criteria:", selectedAssetTypes);
    filtered = filtered.filter((product) => {
      console.log(`Product ID: ${product._id}, Product Categories: ${product.categories}`);
      const matchesCategory = selectedAssetTypes.some((type) =>
        categoryNames.includes(type) && product.categories.includes(type)
      );
      console.log(`Product ID: ${product._id}, Matches Category: ${matchesCategory}`);
      return matchesCategory;
    });
    console.log("Filtered by Asset Types:", filtered);
  }
  

  if (selectedIndustries.length > 0) {
    console.log("Industries Filter Criteria:", selectedIndustries);
    filtered = filtered.filter((product) => {
      console.log(`Product ID: ${product._id}, Product Subcategories: ${product.subcategories}`);
      const matchesSubcategory = selectedIndustries.some((industry) =>
        subcategoryNames.includes(industry) && product.subcategories.includes(industry)
      );
      console.log(`Product ID: ${product._id}, Matches Subcategory: ${matchesSubcategory}`);
      return matchesSubcategory;
    });
    console.log("Filtered by Industries:", filtered);
  }
  

  // Filter based on price range
  console.log("Filtering by Price Range...");
  filtered = filtered.filter((product) => {
    const withinPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    console.log(`Product ID: ${product._id}, Within Price Range: ${withinPriceRange}`);
    return withinPriceRange;
  });
  console.log("Filtered by Price Range:", filtered);

  // Sort products based on the selected option
  if (selectedSortOption) {
    console.log("Sorting Products...");
    switch (selectedSortOption) {
      case "Sort by price: low to high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Sort by price: high to low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "Sort by latest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    console.log("Sorted Products:", filtered);
  }

  console.log("Final Filtered Products:", filtered);
  setFilteredCards(filtered);
};



// Flatten categories and subcategories
const categoryNames = Object.keys(categories);
const subcategoryNames = [...new Set(Object.values(categories).flatMap(category => Object.keys(category)))];

  return (
    <div className="px-4 py-8 md:px-20 lg:px-40">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <select
            value={selectedSortOption}
            onChange={(e) => handleSortOptionChange(e.target.value)}
            className="w-full border border-gray-400 shadow-lg text-xl text-gray-800 rounded-sm px-3 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white"
          >
            <option value="" disabled className="text-sm">
              Select sorting option
            </option>
            <option className="text-sm">Sort by latest</option>
            <option className="text-sm">Sort by price: low to high</option>
            <option className="text-sm">Sort by price: high to low</option>
          </select>
        </div>
        <button
          onClick={handleResetFilters}
          className="bg-black text-white px-4 py-2 rounded-md w-full md:w-auto"
        >
          Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="col-span-1">
  <h3 className="font-bold mb-2 text-xl text-gray-800">Asset type</h3>
  <div>
    {categoryNames.map((type) => (
      <label key={type} className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectedAssetTypes.includes(type)}
          onChange={(e) =>
            handleAssetTypeChange(type, e.target.checked)
          }
          className="mr-2"
        />
        {type}
      </label>
    ))}
  </div>

  <div>
    <h3 className="font-bold mb-2 mt-4 text-xl text-gray-800">
      Industry
    </h3>
    <div>
      {subcategoryNames.map((industry) => (
        <label key={industry} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={selectedIndustries.includes(industry)}
            onChange={(e) =>
              handleIndustryChange(industry, e.target.checked)
            }
            className="mr-2 text-gray-700 font-bold"
          />
          {industry}
        </label>
      ))}
    </div>
  </div>

  <h3 className="font-bold mb-2 mt-4 text-xl text-gray-800">Price</h3>
  <div className="flex items-center mb-2">
    <Slider
      value={priceRange}
      onChange={handlePriceRangeChange}
      step={1}
      min={1}
      max={1000}
      valueLabelDisplay="on"
      marks={marks}
    />
  </div>
</div>


        <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md overflow-hidden"
            >
              <img
                src={`/api/image/download/${product.photo[0]}`}
                alt={product.alt}
                title={product.imgtitle}
                className="w-full h-48 object-cover"
              />
              <div className="">
                {product.status === "inactive" ? (
                  <p className="text-lg font-bold text-[#333] mt-4 py-1 text-center border-4 border-[#333]">
                    Coming Soon
                  </p>
                ) : (
                  <>
                    <h3 className="font-bold mb-2 pt-4 px-4">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold pb-4 px-4">
                      ${product.price}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
