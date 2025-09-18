const nodemailer = require('nodemailer');
const CatalogueInquiry = require('../models/catalogueInquiry');
const AppError = require('../utils/appError');
const axios = require('axios');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_HR,
    pass: process.env.HR_PASS
  }
});

// Email template
const createEmailTemplate = (inquiry) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; background-color: #fff; border: 1px solid #e9ecef; border-top: none; }
        .footer { margin-top: 20px; padding-top: 20px; text-align: center; color: #6c757d; font-size: 0.9em; }
        .details { margin: 20px 0; }
        .detail-row { margin-bottom: 10px; }
        .label { font-weight: bold; color: #495057; }
        .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background-color: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 4px; 
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Catalogue Request</h2>
        </div>
        <div class="content">
            <p>Hello Team,</p>
            <p>A new catalogue request has been submitted with the following details:</p>
            
            <div class="details">
                <div class="detail-row"><span class="label">Name:</span> ${inquiry.name}</div>
                <div class="detail-row"><span class="label">Email:</span> ${inquiry.email}</div>
                <div class="detail-row"><span class="label">Phone:</span> ${inquiry.mobileNo}</div>
                <div class="detail-row"><span class="label">Requested On:</span> ${new Date(inquiry.createdAt).toLocaleString()}</div>
                <div class="detail-row"><span class="label">Page Visited:</span> ${inquiry.path || 'Unknown'}</div>
            </div>

            <p>Please follow up with the client at your earliest convenience.</p>
            
            <a href="mailto:${inquiry.email}" class="button">Reply to Client</a>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} RND Technosoft. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

// External API integration function
async function sendToExternalAPI(newInquiry) {
  try {
    console.log('Attempting to send data to external API...');
    
    // Verify API credentials are configured
    const apiKey = process.env.EXTERNAL_API_KEY || "A78A8BC90C6F6235";
    const apiId = process.env.EXTERNAL_API_ID || "MW1V";
    
    console.log('Using API_ID:', apiId);
    
    const payload = {
      API_KEY: apiKey,
      API_ID: apiId,
      name: newInquiry.name,
      email: newInquiry.email,
      phone: newInquiry.mobileNo,
      linkedin: newInquiry.linkedin || '',
      subject: newInquiry.subject || "Catalogue Request",
      message: newInquiry.message,
      source: newInquiry.source || 'catalogue-portal',
      ip_address: newInquiry.ipaddress || ''
    };

    console.log('External API request:', {
      url: 'https://leads.rndtechnosoft.com/api/contactform/message',
      method: 'POST',
      payload
    });

    const externalApiResponse = await axios.post(
      'https://leads.rndtechnosoft.com/api/contactform/message', 
      payload,
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'RND-Career-Portal/1.0',
          'X-Request-Source': 'catalogue-portal'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      }
    );
    
    console.log('External API response:', {
      status: externalApiResponse.status,
      statusText: externalApiResponse.statusText,
      data: externalApiResponse.data
    });

    if (externalApiResponse.status !== 200) {
      throw new Error(`External API returned status ${externalApiResponse.status}: ${externalApiResponse.statusText}`);
    }

    return externalApiResponse.data;

  } catch (externalError) {
    console.error('✗ Failed to send data to external DB:', externalError.message);
    if (externalError.response) {
      console.error('External API Error Status:', externalError.response.status);
      console.error('External API Error Details:', externalError.response.data);
    }
    throw externalError;
  }
}

exports.createCatalogueInquiry = async (req, res, next) => {
  const { name, email, mobileNo, path } = req.body;

  // Basic validation
  if (!name || !email || !mobileNo) {
    return next(new AppError('Please provide name, email, and mobile number', 400));
  }

  try {
    // Create new inquiry
    const newInquiry = await CatalogueInquiry.create({
      name,
      email,
      mobileNo,
      path: path || ''
    });

    // Send email notification
    const mailOptions = {
      from: `"RND Technosoft" <${process.env.EMAIL_HR}>`,
      to: process.env.EMAIL_HR,
      subject: `New Catalogue Request from ${name}`,
      html: createEmailTemplate(newInquiry)
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    // Send data to external API
    try {
      await sendToExternalAPI({
        ...newInquiry._doc,
        subject: "Catalogue Request",
        source: 'catalogue-portal',
        message: `New catalogue request from ${name}. Email: ${email}, Phone: ${mobileNo}`
      });
      console.log('✓ External API call successful');
    } catch (externalError) {
      console.error('External API Error:', externalError.message);
      // Don't fail the request if external API call fails
    }

    res.status(201).json({
      status: 'success',
      data: {
        inquiry: newInquiry
      }
    });

  } catch (error) {
    console.error('Error creating inquiry:', error);
    return next(new AppError('Error processing your request', 500));
  }
};

// Admin function to get all inquiries
exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await CatalogueInquiry.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: inquiries.length,
      data: {
        inquiries
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return next(new AppError('Error fetching inquiries', 500));
  }
};

// Admin function to get a single inquiry
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await CatalogueInquiry.findById(req.params.id);
    
    if (!inquiry) {
      return next(new AppError('No inquiry found with that ID', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    return next(new AppError('Error fetching inquiry', 500));
  }
};