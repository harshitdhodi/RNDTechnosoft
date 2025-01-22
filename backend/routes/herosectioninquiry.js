const express = require('express');
const router = express.Router();
const careerInquiryController = require('../controller/herosectioninquiry');
const {requireAuth}=require("../middleware/authmiddleware")

router.post('/createHomesectionInquiry',careerInquiryController.CreateCareerInquiry);
router.get('/getHomesectionInquiries', requireAuth, careerInquiryController.getCountsAndData);
router.delete('/deleteHomesectionInquiries',requireAuth, careerInquiryController.deleteCareerInquiry);

module.exports = router;
