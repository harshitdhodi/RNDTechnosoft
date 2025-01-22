const express = require('express');
const { createPopupInquiry, getPopupInquiries,deleteCareerInquiry } = require('../controller/popupinquiry');
const router = express.Router();
const {requireAuth}=require("../middleware/authmiddleware")

// POST route to submit an inquiry
router.post('/createpopupinquiry', createPopupInquiry);
router.get('/getpopupinquiries',requireAuth, getPopupInquiries);
router.delete('/deletePopupInquiries',requireAuth, deleteCareerInquiry);


module.exports = router;
