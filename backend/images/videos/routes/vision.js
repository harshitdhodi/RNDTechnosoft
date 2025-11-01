// mission.routes.js
const express = require('express');
const router = express.Router();
const visionController = require('../controller/vision');
const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/getVision',requireAuth, visionController.getAllVisions);
router.put('/updateVision', requireAuth,uploadPhoto,visionController.updateVision);
router.delete('/image/:imageFilename/:index',requireAuth,visionController.deletePhotoAndAltText )

module.exports = router;
