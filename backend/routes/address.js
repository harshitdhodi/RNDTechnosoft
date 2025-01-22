const express = require('express');
const router = express.Router();
const { getAddress, editAddress } = require('../controller/address');
const {requireAuth}=require("../middleware/authmiddleware")

router.get('/getaddress', getAddress);
router.put('/putaddress',requireAuth, editAddress);

module.exports = router;
