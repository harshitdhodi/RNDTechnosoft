const NewsCategory = require("../model/newsCategory");
const ServiceCategory = require("../model/serviceCategory");
const PackageCategory = require("../model/packagecategory");
const PortfolioCategory = require("../model/portfoliocategory");
const Industriescategory = require("../model/industriescategory");

const getFormattedCategoriesFromAllSchemas = async () => {
  try {
    // Fetch only active categories and subcategories
    const serviceCategories = await ServiceCategory.find({ status: "active" }).lean();
    const packageCategories = await PackageCategory.find({ status: "active" }).lean();
    const portfolioCategories = await PortfolioCategory.find({ status: "active" }).lean();
    const industryCategories = await Industriescategory.find({ status: "active" }).lean();

    // Recursive function to format categories into the desired structure
    const formatCategories = (items, parentId = '', parentName = '') => {
      return items
        .filter((item) => item.status === "active") // Ensure only active items are included
        .map((item, index) => {
          const id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`;
          const formattedItem = {
            id,
            name: item.category || parentName,
            slug: item.slug,
            component: item.component || "DefaultComponent",
          };

          // Filter and format subcategories
          if (item.subCategories && item.subCategories.length > 0) {
            const activeSubCategories = item.subCategories.filter((sub) => sub.status === "active");
            if (activeSubCategories.length > 0) {
              formattedItem.subItems = formatCategories(activeSubCategories, id, item.category);
            }
          }

          // Filter and format sub-subcategories
          if (item.subSubCategory && item.subSubCategory.length > 0) {
            const activeSubSubCategories = item.subSubCategory.filter((sub) => sub.status === "active");
            if (activeSubSubCategories.length > 0) {
              if (!formattedItem.subItems) {
                formattedItem.subItems = [];
              }
              formattedItem.subItems = [
                ...formattedItem.subItems,
                ...formatCategories(activeSubSubCategories, id, item.category),
              ];
            }
          }

          return formattedItem;
        });
    };

    // Format Portfolio Categories
    const formatPortfolioCategories = (items, parentId = '', parentName = '') => {
      return items
        .filter((item) => item.status === "active") // Ensure only active portfolio categories are included
        .map((item, index) => {
          const id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`;
          return {
            id,
            name: item.category || parentName,
            slug: item.slug,
            component: item.component || "DefaultComponent",
          };
        });
    };

    // Create the formatted structure
    const formattedData = [
      {
        id: "1",
        name: "About Us",
        slug: "about-us",
        component: "Aboutus",
      },
      {
        id: "2",
        name: "Services",
        slug: "websites",
        component: "MainService",
        subItems: formatCategories(serviceCategories, "2"),
      },
      {
        id: "3",
        name: "Packages",
        slug: "website-packages",
        component: "MainPackage",
        subItems: formatCategories(packageCategories, "3"),
      },
      {
        id: "4",
        name: "Industries",
        slug: "educational-marketing",
        component: "MainIndustries",
        subItems: formatCategories(industryCategories, "4"),
      },
      {
        id: "5",
        name: "Blog",
        slug: "blogs",
        component: "MainBlogs",
      },
      {
        id: "6",
        name: "Contact Us",
        slug: "contact-us",
        component: "ContactUs",
      },
      {
        id: "7",
        name: "Portfolio",
        slug: "portfolio",
        component: "ProjectSection",
        subItems: formatPortfolioCategories(portfolioCategories, "7"),
      },
    ];

    return {
      success: true,
      data: formattedData,
    };

  } catch (err) {
    console.error("Error fetching categories:", err);
    return {
      success: false,
      message: "Failed to fetch categories due to an internal error.",
    };
  }
};

module.exports = getFormattedCategoriesFromAllSchemas;
