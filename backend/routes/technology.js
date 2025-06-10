const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology
} = require('../controller/technology'); // Adjust path as needed
const { uploadLogo } = require('../middleware/logoUpload'); // Assuming you have a file uploadLogo middleware

// GET /api/technologies - Get all technologies with pagination
router.get('/', getAllTechnologies);

// GET /api/technologies/:id - Get technology by ID
router.get('/:id', getTechnologyById);

// POST /api/technologies - Create new technology
router.post('/', uploadLogo, createTechnology);

// PUT /api/technologies/:id - Update technology by ID
router.put('/:id', uploadLogo, updateTechnology);

// DELETE /api/technologies/:id - Delete technology by ID
router.delete('/:id', deleteTechnology);

module.exports = router;