const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin,getAdminProfile ,updateAdminProfile} = require('../controller/adminauth');
const {uploadLogo} =  require('../middleware/logoUpload')

const { requireAuth } = require('../middleware/authmiddleware');

// Admin registration route
router.post('/register',uploadLogo, registerAdmin);

router.get('/adminprofile', requireAuth, getAdminProfile);
router.put('/updateAdminprofile', requireAuth,uploadLogo,updateAdminProfile);

// Admin login route
router.post('/login', loginAdmin);

module.exports = router;
