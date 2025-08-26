
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authmiddleware');
const infrastructureController = require('../controller/infrastructure');
const { uploadPhoto } = require('../middleware/fileUpload');


router.get('/getInfrastructure', requireAuth,infrastructureController.getAllInfrastructures);
router.get('/getInfrastructureById', requireAuth, infrastructureController.getInfrastructureById);
router.post('/createInfrastructure', requireAuth, uploadPhoto, infrastructureController.addInfrastructure);
router.delete('/deleteInfrastructure', requireAuth, infrastructureController.deleteInfrastructure);
router.put('/updateInfrastructure',requireAuth,uploadPhoto, infrastructureController.updateInfrastructure);
router.get('/download/:filename', requireAuth, infrastructureController.downloadImage);
router.delete('/:id/image/:imageFilename/:index', requireAuth, infrastructureController.deleteImageAndAltText);

module.exports = router;
