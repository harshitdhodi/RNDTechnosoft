// routes/techCategoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTechCategory,
  getAllTechCategories,
  getTechCategoryById,
  updateTechCategory,
  deleteTechCategory,
  getTechCategoryPhoto,
} = require('../controller/techCategory');
const { uploadLogo } = require('../middleware/logoUpload'); // Assuming you have a file uploadLogo middleware


// Routes
router.post('/', uploadLogo, createTechCategory); // Create a new tech category
router.get('/', getAllTechCategories); // Get all tech categories
router.get('/:id', getTechCategoryById); // Get a single tech category by ID
router.put('/:id', uploadLogo, updateTechCategory); // Update a tech category
router.delete('/:id', deleteTechCategory); // Delete a tech category
router.get('/photo/:id', getTechCategoryPhoto); // Serve the photo file

module.exports = router;