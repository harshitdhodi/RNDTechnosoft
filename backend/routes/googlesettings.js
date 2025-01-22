// routes/googleSettingsRoutes.js

const express = require('express');
const router = express.Router();
const googleSettingsController = require('../controller/googlesettings');

// Route to fetch Google settings
router.get('/getGoogleSettings', googleSettingsController.getGoogleSettings);

// Route to update Google settings
router.put('/updateGoogleSettings', googleSettingsController.updateGoogleSettings);

module.exports = router;
