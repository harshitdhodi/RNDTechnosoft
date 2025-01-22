const express = require('express');
const router = express.Router();
const {uploadLogo}=require("../middleware/logoUpload")
const {
  getCountries,
  addGlobalPresence,
  getGlobalPresenceEntries,
  deleteGlobalPresence
} = require('../controller/globalpresence');

router.get('/countries', getCountries);
router.post('/addGlobalPresence', uploadLogo,addGlobalPresence);
router.get('/globalPresenceEntries', getGlobalPresenceEntries);
router.delete('/deleteGlobalPresence', deleteGlobalPresence);

module.exports = router;
