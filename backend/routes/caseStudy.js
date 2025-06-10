const express = require('express');
const router = express.Router();
const { uploadLogo } = require('../middleware/logoUpload'); // Assuming you have a file uploadLogo middleware
const controller = require('../controller/caseStudy');

// Create
router.post('/', uploadLogo, controller.createCaseStudy);

// Read
router.get('/', controller.getAllCaseStudies);
router.get('/:id', controller.getCaseStudyById);

// Update
router.put('/:id', uploadLogo, controller.updateCaseStudy);

// Delete
router.delete('/:id', controller.deleteCaseStudy);

module.exports = router;
