const express = require('express');
const router = express.Router();
const { uploadPhoto } = require('../middleware/fileUpload');
const {insertLogotype, getLogotype, updateLogotype, deleteLogotype, getLogotypeById,deletePhotoAndAltText} = require('../controller/logotype');
const { requireAuth } = require('../middleware/authmiddleware');


router.post("/insertLogotype",requireAuth,uploadPhoto,insertLogotype);
router.get('/getLogotype', getLogotype);
router.put('/updateLogotype',requireAuth,uploadPhoto, updateLogotype);
router.delete('/deleteLogotype',requireAuth, deleteLogotype);
router.get('/getLogotypeById',requireAuth,getLogotypeById);
router.delete('/:id/image/:imageFilename/:index',requireAuth,deletePhotoAndAltText);
module.exports = router;