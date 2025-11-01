const Inquiry = require("../model/inquiry")
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is set correctly
    pass: process.env.EMAIL_PASS, // Ensure this is set correctly
  },
});

const postInquiry = async (req, res) => {
  try {
    // Destructure the entire request body
    const inquiryData = { ...req.body };

    // Create a new Inquiry document using the destructured data
    const newInquiry = new Inquiry(inquiryData);

    // Save the inquiry to the database
    const savedInquiry = await newInquiry.save();


    // Admin Email
    const adminEmailOptions = {
      from: savedInquiry.email,
      to: 'harshit.dhodi2108@gmail.com',
      subject: 'New Inquiry Submitted',
      html: `
        <h2>New Inquiry Submitted</h2>
        <p>A new inquiry has been submitted with the following details:</p>
        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
          <tr><th>Field</th><th>Value</th></tr>
          ${Object.entries(inquiryData).map(([key, value]) => `
            <tr>
              <td>${key}</td>
              <td>${value}</td>
            </tr>
          `).join('')}
        </table>
        <p>Please review the inquiry and take necessary action.</p>
      `,
    };

    // User Email
    const userEmailOptions = {
      from: 'harshit.dhodi2108@gmail.com',
      to: savedInquiry.email, // Ensure userEmail is provided in the inquiryData
      subject: 'Thank You for Your Inquiry',
      html: `
        <h2>Thank You for Your Inquiry</h2>
        <p>Dear ${inquiryData.userName || 'Valued Customer'},</p>
        <p>Thank you for your inquiry. We have received your submission and will get back to you soon.</p>
        <p><strong>Inquiry Details:</strong></p>
        <ul>
          ${Object.entries(inquiryData).map(([key, value]) => `
            <li><strong>${key}:</strong> ${value}</li>
          `).join('')}
        </ul>
        <p>Best regards,</p>
        <p>Your Company Name</p>
      `,
    };

    // Send emails
    await transporter.sendMail(adminEmailOptions);
    await transporter.sendMail(userEmailOptions);

    // Send a success response
    res.status(201).json({
      message: 'Inquiry created successfully and emails sent',
      data: savedInquiry,
    });
  } catch (error) {
    // Handle errors
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
module.exports = { postInquiry, getInquiries, deleteInquiries, getInquiriesById, UpdateInquirues }