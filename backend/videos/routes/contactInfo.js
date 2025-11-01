const express = require('express');
const router = express.Router();
const contactInfoController = require('../controller/contactInfo');
const {uploadPhoto} = require('../middleware/imageUpload'); // Adjust the path based on your file structure
const { requireAuth } = require('../middleware/authmiddleware');
// Route to create ContactInfo with photo upload
router.post('/addContactInfo', requireAuth, uploadPhoto, contactInfoController.createContactInfo);

// Other CRUD operations can go here (if needed)
router.get('/getcontactinfo',contactInfoController.getAllContactInfo);
router.get('/getcontactinfobyid',requireAuth, contactInfoController.getContactInfoById);
router.put('/putcontactinfo',requireAuth, uploadPhoto, contactInfoController.updateContactInfo);
router.delete('/deletecontactinfo',requireAuth, contactInfoController.deleteContactInfo);

module.exports = router;
