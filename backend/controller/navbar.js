const NewsCategory = require("../model/newsCategory");
const ServiceCategory = require("../model/serviceCategory");
const PackageCategory = require("../model/packagecategory");
const PortfolioCategory = require("../model/portfolioCategory");

const getFormattedCategoriesFromAllSchemas = async () => {
    try {
        // Fetch data from all schemas
        // const newsCategories = await NewsCategory.find().lean();
        const serviceCategories = await ServiceCategory.find().lean();
        const packageCategories = await PackageCategory.find().lean();
        const portfolioCategories = await PortfolioCategory.find().lean();

        // Recursive function to format the categories into the desired structure
        const formatCategories = (items, parentId = '', parentName = '') => {
            return items.map((item, index) => {
                const id = parentId ? `${ parentId }-${ index + 1 }` : `${ index + 1 }`;
                const formattedItem = {
                    id,
                    name: item.category || parentName,  // Use 'name' if available, otherwise default
                    slug: item.slug,
                    component: item.component || 'DefaultComponent',  // Fallback to 'DefaultComponent' if undefined
                };

                // Check for sub-items and format them recursively
                if (item.subCategories && item.subCategories.length > 0) {
                    formattedItem.subItems = formatCategories(item.subCategories, id, item.category);
                }
                if (item.subSubCategory && item.subSubCategory.length > 0) {
                    if (!formattedItem.subItems) {
                        formattedItem.subItems = [];
                    }
                    formattedItem.subItems = [
                        ...formattedItem.subItems,
                        ...formatCategories(item.subSubCategory, id, item.category),
                    ];
                }

                return formattedItem;
            });
        };

        // Create the formatted structure based on the provided example format
        const formattedData = [
            {
                id: '1',
                name: 'About Us',
                slug: 'about-us',
                component: 'Aboutus',
            },
            {
                id: '2',
                name: 'Services',
                slug: 'websites',
                component: 'MainService',
                subItems: formatCategories(serviceCategories, '2'),
            },
            {
                id: '3',
                name: 'Packages',
                subItems: formatCategories(packageCategories, '3'),
            },
            {
                id: '4',
                name: 'Industries',
                slug: 'industries',
                component: 'Industries',
                subItems: [],  // Add sub-items for industries if needed
            },
            {
                id: '5',
                name: 'Blog',
                // subItems: formatCategories(newsCategories, '5'),
            },
            {
                id: '6',
                name: 'Contact Us',
                slug: 'contact-us',
                component: 'ContactUs',
            },
            {
                id: '7',
                name: 'Portfolio',
                subItems: formatCategories(portfolioCategories, '7'),
            },
        ];

        return {
            success: true,
            data: formattedData,
        };

    } catch (err) {
        console.error('Error fetching categories:', err);
        throw new Error('Failed to fetch categories.');
    }
};

module.exports = getFormattedCategoriesFromAllSchemas;