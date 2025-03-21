const express = require('express');
const axios = require('axios');
const Content = require('../model/content');
const Package = require('../model/packages');
const router = express.Router();

// Functions to fetch data from different endpoints
const getContent = async (req, res) => {
    try {
      const contents = await Content.find();
      return res.status(200).json(contents);
    } catch (error) {
      console.error("Error retrieving contents:", error);
      return res
        .status(500)
        .json({ message: "Error retrieving contents", error });
    }
  };
  

const getStandardPackage = async (req, res) => {
  try {
    // Helper function to format package data
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

    // Query to find packages where all specified fields are empty or contain only empty spaces
    const packages = await Package.find({
      categories: { $in: ["", " "] },
      subcategories: { $in: ["", " "] },
      subSubcategories: { $in: ["", " "] },
      servicecategories: { $in: ["", " "] },
      servicesubcategories: { $in: ["", " "] },
      servicesubSubcategories: { $in: ["", " "] }
    });

    // If no packages are found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message: 'No packages found with all categories, subcategories, and service categories empty'
      });
    }

    // Return the found packages
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length
      }
    });

  } catch (error) {
    console.error('Error retrieving empty category packages:', error);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Combined API endpoint
router.get('/api/combined2', async (req, res) => {
    try {
        // Fetch all data concurrently
        const [
            content,
            homecard1,
            standardPackage
        ] = await Promise.all([
            getContent(),
            getHomeCard1_2(),
          
            getStandardPackage()
        ]);

        // Structure the combined response
        const combinedResponse = {
            content: content,
            homepage: {
                homecard1: homecard1,
                homecard2: homecard1,
                everyplan: homecard1,
                globalsolution: homecard1
            },
            packages: {
                standard: standardPackage
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
