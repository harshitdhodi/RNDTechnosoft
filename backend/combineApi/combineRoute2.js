const express = require('express');
const Content = require('../model/content');
const Package = require('../model/packages');
const router = express.Router();

// Function to fetch content data
const getContent = async () => {
    try {
        return await Content.find();
    } catch (error) {
        console.error("Error retrieving contents:", error);
        return null; // Return null or empty array if error occurs
    }
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
router.get('/combined2', async (req, res) => {
    try {
        // Fetch all data concurrently
        const [ homeCards, standardPackage] = await Promise.all([
           
            getHomeCards(),
            getStandardPackage()
        ]);

        // Structure the combined response with separated content types
        const combinedResponse = {
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
