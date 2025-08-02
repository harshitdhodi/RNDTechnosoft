const express = require('express');
const router = express.Router();
const {
  createTechnologySecData,
  getAllTechnologySecData,
  getTechnologySecDataById,
  updateTechnologySecData,
  deleteTechnologySecData,
  getDataByTechnologySlug
} = require('../controller/technologySecData'); // Adjust path to your controller file
const { handleCardImages } = require('../middleware/TechSecImage'); // Assuming you have a file TechSecImage middleware

// Define routes
router.post('/',handleCardImages, createTechnologySecData);
router.get('/', getAllTechnologySecData);
router.get('/get/:slug', getDataByTechnologySlug);
router.get('/:id', getTechnologySecDataById);

router.put('/:id',handleCardImages, updateTechnologySecData);
router.delete('/:id', deleteTechnologySecData);

module.exports = router;