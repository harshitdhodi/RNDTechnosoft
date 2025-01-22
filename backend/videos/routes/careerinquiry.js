const express = require('express');
const router = express.Router();
const careerInquiryController = require('../controller/careerinquiry');
const {uploadPhoto}=require("../middleware/fileUpload")
const {requireAuth}=require("../middleware/authmiddleware")

router.post('/createCareerInquiry', uploadPhoto,careerInquiryController.CreateCareerInquiry);
router.get('/getcareerInquiries', requireAuth, careerInquiryController.getCountsAndData);
router.delete('/deleteCareerInquiries',requireAuth, careerInquiryController.deleteCareerInquiry);
router.get('/download/:filename', requireAuth,careerInquiryController.downloadResume);
router.get('/view/:filename',requireAuth, careerInquiryController.viewResume);

module.exports = router;
