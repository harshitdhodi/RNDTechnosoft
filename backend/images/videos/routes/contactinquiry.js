const express = require('express');
const router = express.Router();
const inquiryController = require('../controller/contactinquiry');
const { requireAuth } = require('../middleware/authmiddleware');

router.get('/getcontactInquiries', requireAuth, inquiryController.getCountsAndData);
router.post('/createcontactInquiry', inquiryController.createInquiry);
router.delete('/deletecontactInquiries', requireAuth, inquiryController.deleteInquiry);

module.exports = router;
