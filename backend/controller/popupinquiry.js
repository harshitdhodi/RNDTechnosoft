const nodemailer = require("nodemailer");
const PopupInquiry = require("../model/popupinquiry");

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Admin email address
    pass: process.env.EMAIL_PASS, // Admin email password or app-specific password
  },
});

// POST: Create a new inquiry
const createPopupInquiry = async (req, res) => {
  try {
    // Create a new inquiry
    const newInquiry = new PopupInquiry(req.body);

    // Save to the database
    await newInquiry.save();

    // Prepare the email content for the admin
    const adminMailOptions = {
      from: email, // Sender email
      replyto: email,
      to: process.env.EMAIL_USER, // Admin's email address
      subject: "New Inquiry Received",
      html: `
                <div style="text-align: center;">
                    <img src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" alt="RND Technosoft Logo" style="width: 150px; height: auto;"/>
                    <h2>A new inquiry has been submitted</h2>
                    <p><strong>Name:</strong> ${newInquiry.name}</p>
                    <p><strong>Email:</strong> ${newInquiry.email}</p>
                    <p><strong>Mobile:</strong> ${newInquiry.mobile}</p>
                    <p><strong>Message:</strong> ${newInquiry.description}</p>
                </div>
            `,
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // User's email address
      subject: "Inquiry Submitted Successfully",
      html: `
                <div style="text-align: center;">
                    <img src="https://rndtechnosoft.com/api/logo/download/photo_1730452853512.png" alt="RND Technosoft Logo" style="width: 150px; height: auto;"/>
                    <h2>Thank You for Your Inquiry</h2>
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out to us! Your inquiry has been submitted successfully.</p>
                    <p>Our team will get back to you shortly.</p>
                    <p>Best regards,<br>RND Technosoft</p>
                </div>
            `,
    };

    // Send emails to both the admin and the user
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    // Send a success response
    res
      .status(201)
      .json({ message: "Inquiry submitted successfully", inquiry: newInquiry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit inquiry", error: error.message });
  }
};

// GET: Retrieve all inquiries (optional, for admin or internal use)
const getPopupInquiries = async (req, res) => {
  try {
    const totalCount = await PopupInquiry.countDocuments();

    const countWithFields = await PopupInquiry.countDocuments({
        $or: [
            { utm_source: { $exists: true, $ne: '' } },
            { utm_medium: { $exists: true, $ne: '' } },
            { utm_campaign: { $exists: true, $ne: '' } },
            { utm_id: { $exists: true, $ne: '' } },
            { gclid: { $exists: true, $ne: '' } },
            { gcid_source: { $exists: true, $ne: '' } }
        ]
    });

    const countWithoutFields = await PopupInquiry.countDocuments({
        $nor: [
            { utm_source: { $exists: true, $ne: '' } },
            { utm_medium: { $exists: true, $ne: '' } },
            { utm_campaign: { $exists: true, $ne: '' } },
            { utm_id: { $exists: true, $ne: '' } },
            { gclid: { $exists: true, $ne: '' } },
            { gcid_source: { $exists: true, $ne: '' } }
        ]
    });

    const dataWithFields = await PopupInquiry.find({
        $or: [
            { utm_source: { $exists: true, $ne: '' } },
            { utm_medium: { $exists: true, $ne: '' } },
            { utm_campaign: { $exists: true, $ne: '' } },
            { utm_id: { $exists: true, $ne: '' } },
            { gclid: { $exists: true, $ne: '' } },
            { gcid_source: { $exists: true, $ne: '' } }
        ]
    });

    const dataWithoutFields = await PopupInquiry.find({
        $nor: [
            { utm_source: { $exists: true, $ne: '' } },
            { utm_medium: { $exists: true, $ne: '' } },
            { utm_campaign: { $exists: true, $ne: '' } },
            { utm_id: { $exists: true, $ne: '' } },
            { gclid: { $exists: true, $ne: '' } },
            { gcid_source: { $exists: true, $ne: '' } }
        ]
    });

    const inquiries = await PopupInquiry.find();

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

const deleteCareerInquiry = async (req, res) => {
  
    const { id } = req.query;
    try {
        const deletedInquiry = await PopupInquiry.findByIdAndDelete(id);
        if (!deletedInquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  deleteCareerInquiry,
  createPopupInquiry,
  getPopupInquiries,
};
