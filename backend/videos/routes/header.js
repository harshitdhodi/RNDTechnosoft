const express = require('express');
const router = express.Router();
const footerController = require('../controller/header');
const { requireAuth } = require('../middleware/authmiddleware');
const {uploadLogo} =  require('../middleware/logoUpload')

router.get('/getHeader', requireAuth,footerController.getHeader);
router.put('/updateHeader', requireAuth,uploadLogo,footerController.updateHeader);
router.get('/download/:filename', requireAuth,footerController.downloadFile);

module.exports = router;
