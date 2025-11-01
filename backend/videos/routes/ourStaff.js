const express = require('express');
const router = express.Router();
const { insertStaff, getStaff, updateStaff, deleteStaff , getStaffById ,countStaff,deletePhotoAndAltText} = require('../controller/ourStaff');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');


router.post('/insertStaff',requireAuth,uploadPhoto,insertStaff);
router.get('/getStaff',requireAuth, getStaff);
router.put('/updateStaff',requireAuth,uploadPhoto ,updateStaff);
router.delete('/deleteStaff',requireAuth, deleteStaff)
router.get('/getStaffById' ,requireAuth,getStaffById )
router.get('/getStaffById' ,requireAuth,getStaffById )
router.get('/countStaff' ,requireAuth,countStaff )
router.delete('/:id/image/:imageFilename/:index',requireAuth,deletePhotoAndAltText )
module.exports = router;