const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const qualityControlController = require('../controller/qualitycontol');
const { uploadPhoto } = require('../middleware/fileUpload');

router.get('/getQualityControls', requireAuth, qualityControlController.getAllQualityControls);
router.get('/getQualityControlById', requireAuth, qualityControlController.getQualityControlById);
router.post('/createQualityControl', requireAuth, uploadPhoto, qualityControlController.addQualityControl);
router.delete('/deleteQualityControl', requireAuth, qualityControlController.deleteQualityControl);
router.put('/updateQualityControl', requireAuth, uploadPhoto, qualityControlController.updateQualityControl);
router.get('/download/:filename', requireAuth, qualityControlController.downloadImage);
router.delete('/:id/image/:imageFilename/:index', requireAuth, qualityControlController.deleteImageAndAltText);

module.exports = router;
