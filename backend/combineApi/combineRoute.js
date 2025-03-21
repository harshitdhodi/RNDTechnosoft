const express = require('express');
const serviceCategory = require('../model/serviceCategory');
const portfoliocategory = require('../model/portfoliocategory');
const HomeHero = require('../model/homeHero');
const Logo = require('../model/logo');
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

// Combined API endpoint
router.get('/combined', async (req, res) => {
    try {
        // Call all API functions concurrently
        const [
          
            homeHero,
            marquee,
            ourWork,
            serviceCategories // Renamed to match the function
        ] = await Promise.all([
          
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