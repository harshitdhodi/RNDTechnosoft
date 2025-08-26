const express = require('express');
const router = express.Router();
const {insertFAQ , getFAQ, updateFAQ ,deleteFAQ, getFAQById ,countFaq,getFAQWebsite} = require('../controller/FAQ')
const { requireAuth } = require('../middleware/authmiddleware');
const {uploadPhoto} = require('../middleware/fileUpload')


router.post('/insertFAQ',requireAuth,uploadPhoto,insertFAQ);
router.get('/getFaq',requireAuth, getFAQ);
router.put('/updateFaq',requireAuth, uploadPhoto,updateFAQ);
router.delete('/deleteFAQ' ,requireAuth, deleteFAQ)
router.get('/getFAQById',requireAuth,getFAQById);
router.get('/countFaq',requireAuth,countFaq);

// website side route
router.get('/getFAQWebsite',getFAQWebsite)

module.exports = router;