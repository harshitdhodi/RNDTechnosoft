const express = require('express');
const router = express.Router();

const {
    forgetPassword,
    resetPassword,
    ManagePassword,
    verifyOTP
} = require('../controller/forgotPassword');

router.post('/forgetPassword', forgetPassword);
router.post('/resetPassword', resetPassword);
router.post('/verifyOtp', verifyOTP);
router.post('/managePassword', ManagePassword);

module.exports = router;
