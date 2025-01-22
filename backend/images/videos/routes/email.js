const express = require('express');
const router = express.Router();
const { sendVerificationEmail, sendBlockEmail, sendEmail, generateOTP } = require('../controller/mailformateController');

router.post('/sendVerificationEmail', async (req, res) => {
    const { email } = req.body;
    try {
        await sendVerificationEmail(email);
        res.status(200).json({ success: true, message: 'Verification email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send verification email' });
    }
});

router.post('/sendBlockEmail', async (req, res) => {
    const { email } = req.body;
    try {
        await sendBlockEmail(email);
        res.status(200).json({ success: true, message: 'Block email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send block email' });
    }
});

router.post('/sendEmail', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    try {
        await sendEmail(email, otp);
        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

module.exports = router;
