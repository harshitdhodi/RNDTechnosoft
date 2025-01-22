const express = require('express');
const router = express.Router();
const whatsappSettingsController = require('../controller/whatsappsettings');

// Route to fetch WhatsApp settings
router.get('/getwhatsappsettings', whatsappSettingsController.getWhatsAppSettings);

// Route to update WhatsApp settings
router.put('/editwhatsappsettings', whatsappSettingsController.updateWhatsAppSettings);

module.exports = router;