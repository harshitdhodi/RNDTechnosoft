// mission.routes.js
const express = require('express');
const router = express.Router();
const corevalueController = require('../controller/corevalue');
const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/createCoreValue',requireAuth,uploadPhoto, corevalueController.createCoreValue);
router.get('/getCorevalue', corevalueController.getAllCorevalue);
router.get('/getCorevalueById',requireAuth, corevalueController.getCorevalueById);
router.put('/updateCorevalue', requireAuth,uploadPhoto,corevalueController.updateCorevalue);
router.delete('/:id/image/:imageFilename/:index',requireAuth,corevalueController.deletePhotoAndAltText );
router.delete('/deleteCorevalue',requireAuth,corevalueController.deleteCoreValue )

module.exports = router;
