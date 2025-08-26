const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const benefitsController = require('../controller/benefits');
const { uploadPhoto } = require('../middleware/fileUpload');

router.get('/getBenefits', requireAuth, benefitsController.getAllBenefits);
router.get('/getBenefitById', requireAuth, benefitsController.getBenefitById);
router.post('/createBenefit', requireAuth, uploadPhoto, benefitsController.addBenefit);
router.delete('/deleteBenefit', requireAuth, benefitsController.deleteBenefit);
router.put('/updateBenefit', requireAuth, uploadPhoto, benefitsController.updateBenefit);
router.get('/download/:filename', requireAuth, benefitsController.downloadImage);
router.delete('/:id/image/:imageFilename/:index', requireAuth, benefitsController.deleteImageAndAltText);

module.exports = router;
