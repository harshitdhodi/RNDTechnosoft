const ContactInquiry = require('../model/contactinquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createInquiry = async (req, res) => {
    try {
        const newInquiry = new ContactInquiry(req.body);
        await newInquiry.save();

        // HTML Email Template
        const emailHTML = `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px; 
            max-width: 500px;
            margin: 20px auto;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center; /* Center the heading */
        }
        p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
        }
        .field {
            font-weight: bold;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
            text-align: center;
        }
        .centered-text {
            text-align: center; /* Center text */
            margin: 20px 0; /* Add margin above and below */
            font-size: 20px; /* Adjust font size as needed */
            color: #333; /* Text color */
        }
           
                 .logo {
            display: block;
            margin: 0 auto 20px;
            width: 120px; /* Adjusted width */
            height: auto;
            object-fit: contain; /* Ensures aspect ratio is maintained */
        } 
            
    </style>
</head>
<body>
    <div class="container">
       <img class="logo" src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" alt="RND Technosoft Logo">
        <p class="centered-text">New Inquiry!!</p>
        <p><span class="field">Name:</span> ${newInquiry.name}</p>
        <p><span class="field">Email:</span> ${newInquiry.email}</p>
        <p><span class="field">Phone:</span> ${newInquiry.phone}</p>
        <p><span class="field">Subject:</span> ${newInquiry.subject}</p>
        <p><span class="field">Message:</span></p>
        <p>${newInquiry.message}</p>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
        `;

        const mailOptions = {
            from: newInquiry.email,
            to: process.env.EMAIL_USER,
            replyTo: newInquiry.email,
            subject: 'New Contact Inquiry',
            html: emailHTML
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond to the client
        res.status(201).json({ success: true, data: newInquiry });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get counts and data based on field presence
exports.getCountsAndData = async (req, res) => {
    try {
        const totalCount = await ContactInquiry.countDocuments();

        const countWithFields = await ContactInquiry.countDocuments({
            $or: [
                { utm_source: { $exists: true, $ne: '' } },
                { utm_medium: { $exists: true, $ne: '' } },
                { utm_campaign: { $exists: true, $ne: '' } },
                { utm_id: { $exists: true, $ne: '' } },
                { gclid: { $exists: true, $ne: '' } },
                { gcid_source: { $exists: true, $ne: '' } }
            ]
        });

        const countWithoutFields = await ContactInquiry.countDocuments({
            $nor: [
                { utm_source: { $exists: true, $ne: '' } },
                { utm_medium: { $exists: true, $ne: '' } },
                { utm_campaign: { $exists: true, $ne: '' } },
                { utm_id: { $exists: true, $ne: '' } },
                { gclid: { $exists: true, $ne: '' } },
                { gcid_source: { $exists: true, $ne: '' } }
            ]
        });

        const dataWithFields = await ContactInquiry.find({
            $or: [
                { utm_source: { $exists: true, $ne: '' } },
                { utm_medium: { $exists: true, $ne: '' } },
                { utm_campaign: { $exists: true, $ne: '' } },
                { utm_id: { $exists: true, $ne: '' } },
                { gclid: { $exists: true, $ne: '' } },
                { gcid_source: { $exists: true, $ne: '' } }
            ]
        });

        const dataWithoutFields = await ContactInquiry.find({
            $nor: [
                { utm_source: { $exists: true, $ne: '' } },
                { utm_medium: { $exists: true, $ne: '' } },
                { utm_campaign: { $exists: true, $ne: '' } },
                { utm_id: { $exists: true, $ne: '' } },
                { gclid: { $exists: true, $ne: '' } },
                { gcid_source: { $exists: true, $ne: '' } }
            ]
        });

        const inquiries = await ContactInquiry.find();

        res.status(200).json({
            totalCount,
            countWithFields,
            countWithoutFields,
            dataWithFields,
            dataWithoutFields,
            inquiries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteInquiry = async (req, res) => {
    const { id } = req.query;
    try {
        const deletedInquiry = await ContactInquiry.findByIdAndDelete(id);
        if (!deletedInquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
