const express = require('express');
const router = express.Router();
const {
  createIndustrySecData,
  getAllIndustrySecData,
  getIndustrySecDataById,
  updateIndustrySecData,
  deleteIndustrySecData,
  getDataByCategorySlug
} = require('../controller/caseStudy'); // Adjust path to your controller
const { TechSecImage } = require('../middleware/TechSecImage'); // Assuming you have a file TechSecImage middleware

// Routes
router.post('/', TechSecImage, createIndustrySecData);
router.get('/', getAllIndustrySecData);
router.get('/:id', getIndustrySecDataById);
router.put('/:id', TechSecImage, updateIndustrySecData);
router.delete('/:id', deleteIndustrySecData);
router.get('/category/:slug', getDataByCategorySlug);

module.exports = router;