const express = require('express');
const router = express.Router();
const {
  createIndustrySecData,
  getAllIndustrySecData,
  getIndustrySecDataById,
  updateIndustrySecData,
  deleteIndustrySecData,
<<<<<<< HEAD
  getDataByCategorySlug,
  getDataExistsBySlug
=======
  getDataByCategorySlug
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
} = require('../controller/caseStudy'); // Adjust path to your controller
const { handleCardImages } = require('../middleware/TechSecImage'); // Assuming you have a file TechSecImage middleware

// Routes
router.post('/', handleCardImages, createIndustrySecData);
router.get('/', getAllIndustrySecData);
router.get('/:id', getIndustrySecDataById);
router.put('/:id', handleCardImages, updateIndustrySecData);
router.delete('/:id', deleteIndustrySecData);
router.get('/category/:slug', getDataByCategorySlug);
<<<<<<< HEAD
router.get('/exists/:slug', getDataExistsBySlug);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

module.exports = router;