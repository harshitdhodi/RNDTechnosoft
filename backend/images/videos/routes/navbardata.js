const express = require('express');
const router = express.Router();
const getFormattedCategoriesFromAllSchemas = require('../controller/navbardata');

// GET route to fetch all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await getFormattedCategoriesFromAllSchemas();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

module.exports = router;
