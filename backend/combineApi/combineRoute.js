const express = require('express');
const serviceCategory = require('../model/serviceCategory');
const portfoliocategory = require('../model/portfoliocategory');
const HomeHero = require('../model/homeHero');
const Logo = require('../model/logo');

const Content = require('../model/content');
const Package = require('../model/packages');
const managecolor = require('../model/managecolor');
const getFormattedCategoriesFromAllSchemas = require('../controller/navbardata');
const router = express.Router();

// Modified functions to return data instead of sending responses

const getHomeHero = async () => {
    const homeHeros = await HomeHero.find();
    return homeHeros;
};

const getMarquee = async () => {
    const categories = await portfoliocategory.find().select('category -_id');
    return categories.map(cat => cat.category);
};

const getOurWork = async () => {
    const categories = await portfoliocategory.find()
        .select('category photo _id alt imgtitle slug');
    return categories.map(cat => ({
        id: cat._id,
        name: cat.category,
        photo: cat.photo,
        alt: cat.alt,
        imgtitle: cat.imgtitle,
        slug: cat.slug,
    }));
};

const getServiceCategory = async () => {
    const categories = await serviceCategory.find().select(
        "category description photo alt imgtitle slug tag"
    );
    return categories;
};

// Function to fetch standard packages
const getStandardPackage = async () => {
    try {
        const formatPackage = (pkg) => ({
            _id: pkg._id,
            title: pkg.title,
            status: pkg.status,
            categories: pkg.categories,
            subcategories: pkg.subcategories,
            subSubcategories: pkg.subSubcategories,
            servicecategories: pkg.servicecategories,
            servicesubcategories: pkg.servicesubcategories,
            servicesubSubcategories: pkg.servicesubSubcategories,
            description: pkg.description,
            price: pkg.price,
            whatIsTheir: pkg.whatIsTheir,
            whatIsNotTheir: pkg.whatIsNotTheir,
            slug: pkg.slug,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt
        });

        const packages = await Package.find({
            categories: { $in: ["", " "] },
            subcategories: { $in: ["", " "] },
            subSubcategories: { $in: ["", " "] },
            servicecategories: { $in: ["", " "] },
            servicesubcategories: { $in: ["", " "] },
            servicesubSubcategories: { $in: ["", " "] }
        });

        return {
            packages: packages.map(formatPackage),
            total: packages.length
        };

    } catch (error) {
        console.error('Error retrieving empty category packages:', error);
        return null; // Return null or empty array if error occurs
    }
};

// Placeholder for getHomeCard1_2() function
const getHomeCards = async () => {
    try {
        const contentTypes = ["homecard1", "homecard2", "everyplan", "globalsolution","weareexpertsin"];
        const contents = await Content.find({ contentType: { $in: contentTypes }, status: true });

        // Categorize contents based on contentType
        const categorizedContents = {
            homecard1: [],
            homecard2: [],
            everyplan: [],
            globalsolution: [],
            weareexpertsin: [],
        };

        contents.forEach(item => {
            if (categorizedContents[item.contentType]) {
                categorizedContents[item.contentType].push(item);
            }
        });

        return categorizedContents;
    } catch (error) {
        console.error("Error retrieving contents by type:", error);
        return {weareexpertsin:[], homecard1: [], homecard2: [], everyplan: [], globalsolution: [] }; // Return empty arrays in case of an error
    }
};


// Combined API endpoint
router.get('/combined', async (req, res) => {
    try {
        // Call all API functions concurrently
        const [
            homeCards, standardPackage,
            homeHero,
            marquee,
            ourWork,
            serviceCategories // Renamed to match the function
        ] = await Promise.all([
            getHomeCards(),
            getStandardPackage(),
            getHomeHero(),
            getMarquee(),
            getOurWork(),
            getServiceCategory()
        ]);

        // Combine all responses into a single object
        const combinedResponse = {
            homehero: homeHero, // Array of hero objects
            homepage: {
                marquee: marquee, // Array of category names
                ourwork: ourWork // Array of work objects
            },
            services: {
                categories: serviceCategories // Array of service category objects
            },
            WeAreExpert: homeCards.weareexpertsin || [],
            homecard1: homeCards.homecard1 || [],
            homecard2: homeCards.homecard2 || [],
            everyplan: homeCards.everyplan || [],
            globalsolution: homeCards.globalsolution || [],
            packages: {
                standard: standardPackage || { packages: [], total: 0 }
            }
        };

        res.status(200).json({
            success: true,
            data: combinedResponse
        });
    } catch (error) {
        console.error('Error in combined API:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;