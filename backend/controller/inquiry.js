const Inquiry = require("../model/inquiry");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const postInquiry = async (req, res) => {
  try {
    const inquiryData = { ...req.body };
    const newInquiry = new Inquiry(inquiryData);
    const savedInquiry = await newInquiry.save();

    const logoImageUrl = "https://rndtechnosoft.com/api/logo/download/rndlogo.png";
    const logoStyle = "width: 100px; height: auto;";

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
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              }
              h2 {
                  color: #333;
                  text-align: center;
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
          </style>
      </head>
      <body>
          <div class="container">
              <img src="${logoImageUrl}" style="${logoStyle}" alt="RND Technosoft Logo"/>
              <h2>New Inquiry</h2>
              <p><span class="field">First Name:</span> ${newInquiry.firstname}</p>
              <p><span class="field">Last Name:</span> ${newInquiry.lastname}</p>
              <p><span class="field">Email:</span> ${newInquiry.email}</p>
              <p><span class="field">Mobile No:</span> ${newInquiry.mobileNo}</p>
              <p><span class="field">Company Size:</span> ${newInquiry.companysize}</p>
              <p><span class="field">Active User:</span> ${newInquiry.activeuser}</p>
              <p><span class="field">Topic:</span> ${newInquiry.topic}</p>
              <p><span class="field">Message:</span> ${newInquiry.message}</p>
              <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    const adminEmailOptions = {
      from: savedInquiry.email,
      to: process.env.EMAIL_USER,
      replyTo: savedInquiry.email,
      subject: 'New Inquiry Submitted',
      html: emailHTML
    };

    const userEmailOptions = {
      from: process.env.EMAIL_USER,
      to: savedInquiry.email,
      subject: 'Thank You for Your Inquiry',
      html: `
        <html>
        <body>
          <div style="text-align: center; padding: 20px;">
            <img src="${logoImageUrl}" style="${logoStyle}" alt="RND Technosoft Logo"/>
            <h2>Thank You for Your Inquiry</h2>
            <p>Dear ${inquiryData.firstname || 'Valued Customer'},</p>
            <p>Thank you for reaching out. We have received your inquiry and will get back to you soon.</p>
            <p>Best regards,</p>
            <p>RND Technosoft</p>
             <div class="footer">
                  <p>This is an automated email. Please do not reply.</p>
              </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(adminEmailOptions);
    await transporter.sendMail(userEmailOptions);

    res.status(201).json({
      message: 'Inquiry created successfully and emails sent',
      data: savedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create inquiry',
      error: error.message,
    });
  }
};


const getInquiries = async (req, res) => {
  try {
    const totalCount = await Inquiry.countDocuments();

    const countWithFields = await Inquiry.countDocuments({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const countWithoutFields = await Inquiry.countDocuments({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithFields = await Inquiry.find({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithoutFields = await Inquiry.find({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const inquiries = await Inquiry.find();

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

const getInquiriesById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.query.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve inquiry',
      error: error.message,
    });
  }
}

const UpdateInquirues = async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.query.id,
      { ...req.body },
      { new: true, runValidators: true } // Return the updated document
    );
    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({
      message: 'Inquiry updated successfully',
      data: updatedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update inquiry',
      error: error.message,
    });
  }
}

const deleteInquiries = async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findByIdAndDelete(req.query.id);
    if (!deletedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.status(200).json({
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete inquiry',
      error: error.message,
    });
  }
}

module.exports = { postInquiry, getInquiries, deleteInquiries, getInquiriesById, UpdateInquirues };
