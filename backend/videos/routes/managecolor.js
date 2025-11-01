const express = require('express');
const router = express.Router();
const colorController = require('../controller/managecolor');

router.post('/save-colors', colorController.saveColors);
router.get('/get-colors', colorController.getColors);

module.exports = router;