const ContactInquiry = require('../model/contactinquiry');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP server
    port: 587, // Port
    secure: false, // Use `true` for 465, `false` for other ports
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
    <title>New Inquiry Alert</title>
    <style>
        body {
            font-family: "Poppins", sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 2px solid;
            }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #eee;
        }
        .logo {
            width: 120px;
            margin-bottom: 10px;
        }
        h2 {
            color: #333;
            font-size: 22px;
            margin-bottom: 5px;
        }
        .sub-text {
            color: #777;
            font-size: 14px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .info-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .field {
            font-weight: 600;
            color: #222;
            width: 40%;
        }
        .message-box {
            background-color: #f9f9f9;
            padding: 15px;
            margin-top: 15px;
            border-left: 4px solid #007bff;
            font-style: italic;
            color: #444;
        }
        .footer {
            margin-top: 20px;
            padding-top: 15px;
            font-size: 12px;
            color: #777;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .admin-actions {
            text-align: center;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .contact-info {
            font-size: 14px;
            color: #555;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <img src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" class="logo" alt="RND Technosoft Logo">
            <h2>🔔 New Inquiry Alert</h2>
            <!--<p class="sub-text">A new inquiry has been submitted. Please review the details below.</p>-->
        </div>

        <!-- Inquiry Details -->
        <table class="info-table">
            <tr>
                <td class="field">Name:</td>
                <td>${newInquiry.name}</td>
            </tr>
            <tr>
                <td class="field">Email:</td>
                <td>${newInquiry.email}</td>
            </tr>
            <tr>
                <td class="field">Phone:</td>
                <td>${newInquiry.phone}</td>
            </tr>
            <tr>
                <td class="field">Subject:</td>
                <td>${newInquiry.subject}</td>
            </tr>
        </table>

        <!-- Message Section -->
        <div class="message-box">
            <strong>Message:</strong> <br>
            ${newInquiry.message}
        </div>


        <!-- Footer Section -->
        <div class="footer">
            <p>This is an automated notification for administrators. Do not reply.</p>
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
