const Newsletter = require('../model/newsletter');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});


exports.addEmail = async (req, res) => {
    try {
        const { email,name } = req.body;

        // Check if the email already exists
        const existingEmail = await Newsletter.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newEmail = new Newsletter({ email,name });
        await newEmail.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Newsletter Subscription Confirmation',
            text: `Hello,${name}\n\nThank you for subscribing to our newsletter! You will now receive updates from us.\n\nBest regards,\nRND Technosoft.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to send confirmation email', error });
            } else {
                res.status(201).json({ message: 'Email subscribed successfully and confirmation sent', data: newEmail });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// GET: Retrieve all subscribed emails
exports.getAllEmails = async (req, res) => {
    try {
        const emails = await Newsletter.find();
        res.status(200).json(emails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// DELETE: Remove an email from the newsletter by ID
exports.deleteEmail = async (req, res) => {
    try {
        const { id } = req.query;

        const deletedEmail = await Newsletter.findByIdAndDelete(id);
        if (!deletedEmail) {
            return res.status(404).json({ message: 'Email not found' });
        }

        res.status(200).json({ message: 'Email unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
