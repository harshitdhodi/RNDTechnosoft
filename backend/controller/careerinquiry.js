const CareerInquiry = require('../model/carrerinquiry');
const path = require('path')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP server
    port: 587, // Port
    secure: false, // Use `true` for 465, `false` for other ports
    auth: {
        user: process.env.EMAIL_HR,
        pass: process.env.HR_PASS
    }
});

exports.CreateCareerInquiry = async (req, res) => {
  try {
    const newInquiry = new CareerInquiry({
      name: req.body.name,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      message: req.body.message,
      resume: req.files['resume'] ? req.files['resume'][0].filename : null
    });

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
            width: 120px; 
            height: auto; 
            object-fit: contain; /* Ensures aspect ratio is maintained */
        }
        </style>
      </head>
      <body>
        <div class="container">
            <img class="logo" src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" alt="RND Technosoft Logo">
            <p class="centered-text">New Career Inquiry!!</p>
            <p><span class="field">Name:</span> ${newInquiry.name}</p>
            <p><span class="field">Email:</span> ${newInquiry.email}</p>
            <p><span class="field">Phone:</span> ${newInquiry.mobileNo}</p>
            <p>${newInquiry.message}</p>
        </div>
      </body>
      </html>
      `;

    // Resume file from Multer
    const resumeFile = req.files['resume'] ? req.files['resume'][0] : null;

    const mailOptions = {
      from: newInquiry.email,
      to: process.env.EMAIL_HR,
      replyTo: newInquiry.email,
      subject: 'New Career Inquiry',
      html: emailHTML,
      attachments: [
        {
          filename: resumeFile.originalname, // Use original file name
          path: resumeFile.path, // File path (in case of disk storage)
          contentType: resumeFile.mimetype // MIME type of the file
        }
      ]
    };

    console.log(mailOptions)

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
    const totalCount = await CareerInquiry.countDocuments();

    const countWithFields = await CareerInquiry.countDocuments({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const countWithoutFields = await CareerInquiry.countDocuments({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithFields = await CareerInquiry.find({
      $or: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const dataWithoutFields = await CareerInquiry.find({
      $nor: [
        { utm_source: { $exists: true, $ne: '' } },
        { utm_medium: { $exists: true, $ne: '' } },
        { utm_campaign: { $exists: true, $ne: '' } },
        { utm_id: { $exists: true, $ne: '' } },
        { gclid: { $exists: true, $ne: '' } },
        { gcid_source: { $exists: true, $ne: '' } }
      ]
    });

    const inquiries = await CareerInquiry.find();

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

// exports.CreateCareerInquiry = async (req, res) => {
//   try {
//     const { name, mobileNo, email, message } = req.body;
//     const resume = req.files.resume[0].filename; // Get the resume filename from the uploaded files

//     // Create a new CareerInquiry document
//     const newInquiry = new CareerInquiry({
//       name,
//       mobileNo,
//       email,
//       resume,
//       message,
//     });

//     // Save the inquiry to the database
//     const savedInquiry = await newInquiry.save();

//     res.status(201).json({
//       success: true,
//       data: savedInquiry,
//     });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({
//       success: false,
//       message: 'Failed to post career inquiry',
//       error: error.message,
//     });
//   }
// };

// exports.getAllCareerInquiries = async (req, res) => {
//   try {
//     const inquiries = await CareerInquiry.find();

//     res.status(200).json({
//       success: true,
//       data: inquiries,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch career inquiries',
//       error: error.message,
//     });
//   }
// };

exports.deleteCareerInquiry = async (req, res) => {
  try {
    const { id } = req.query
    const deletedInquiry = await CareerInquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return res.status(404).json({
        success: false,
        message: 'Career inquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: deletedInquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete career inquiry',
      error: error.message,
    });
  }
};


exports.downloadResume = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../resumes', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'File download failed' });
    }
  });
};

exports.viewResume = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'resumes', filename);
  res.sendFile(filePath);
};
