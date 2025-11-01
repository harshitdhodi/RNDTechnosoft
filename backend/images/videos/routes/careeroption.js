// routes/career.routes.js
const express = require('express');
const router = express.Router();
const careerController = require('../controller/careeroption');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');


router.post('/createCareeroption',requireAuth,uploadPhoto, careerController.createCareer);
router.get('/getCareeroption', requireAuth,careerController.getAllCareers);
router.get('/getActiveCareeroption',careerController.getAllActiveCareers);
router.get('/getCareeroptionById', requireAuth,careerController.getCareerById);
router.put('/updateCareeroption',requireAuth,uploadPhoto, careerController.updateCareer);
router.delete('/deleteCareeroption', requireAuth,careerController.deleteCareer);
router.delete('/:id/image/:imageFilename/:index', requireAuth,careerController.deletePhotoAndAltText);


module.exports = router;
