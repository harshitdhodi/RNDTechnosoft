const express = require('express');
const catalogueController = require('../controllers/catalogueController');

const router = express.Router();

// Public routes
router.post('/inquiry', catalogueController.createCatalogueInquiry);

router
  .route('/')
  .get(catalogueController.getAllInquiries);

router
  .route('/:id')
  .get(catalogueController.getInquiry);

module.exports = router;
