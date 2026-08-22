const nodemailer = require('nodemailer');
const CatalogueInquiry = require('../models/catalogueInquiry');
const AppError = require('../utils/appError');
const axios = require('axios');
const { sendThankYouEmail } = require('../utils/emailService');

// Create email transporter with connection pooling
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true, // Use true for port 465
  auth: {
    user: process.env.EMAIL_HR,
    pass: process.env.HR_PASS
  },
  // Performance optimizations
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateLimit: 14,
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
});

// Email template generator function
function generateEmailTemplate(inquiry) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Catalogue Request</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
          }
          .container {
              width: 100%;
              padding: 30px;
              background-color: #ffffff;
              border-radius: 12px; 
              max-width: 600px;
              margin: 30px auto;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f0f0f0;
          }
          .logo {
              width: 120px; 
              height: auto; 
              object-fit: contain;
              margin-bottom: 20px;
          }
          .title {
              font-size: 24px;
              color: #2c3e50;
              margin: 0;
              font-weight: 600;
          }
          .subtitle {
              font-size: 16px;
              color: #7f8c8d;
              margin: 5px 0 0 0;
          }
          .content {
              padding: 20px 0;
          }
          .field-row {
              margin: 15px 0;
              padding: 12px;
              background-color: #f8f9fa;
              border-radius: 6px;
              border-left: 4px solid #3498db;
          }
          .field-label {
              font-weight: 600;
              color: #2c3e50;
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
          }
          .field-value {
              color: #34495e;
              font-size: 16px;
              line-height: 1.5;
              word-break: break-word;
          }
          .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ecf0f1;
              font-size: 12px;
              color: #95a5a6;
              text-align: center;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
              font-weight: 600;
          }
      </style>
    </head>
    <body>
      <div class="container">
          <div class="header">
              <img class="logo" src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" alt="RND Technosoft Logo">
              <h1 class="title">New Catalogue Request</h1>
              <p class="subtitle">Catalogue Portal Submission</p>
          </div>
          
          <div class="content">
              <div class="field-row">
                  <span class="field-label">Client Name</span>
                  <div class="field-value">${inquiry.name}</div>
              </div>
              
              <div class="field-row">
                  <span class="field-label">Email Address</span>
                  <div class="field-value">${inquiry.email}</div>
              </div>
              
              <div class="field-row">
                  <span class="field-label">Phone Number</span>
                  <div class="field-value">${inquiry.mobileNo}</div>
              </div>
              
              <div class="field-row">
                  <span class="field-label">Page Visited</span>
                  <div class="field-value">${inquiry.path || 'Not specified'}</div>
              </div>
              
              <div style="text-align: center;">
                  <a href="mailto:${inquiry.email}" class="button">Reply to Client</a>
              </div>
          </div>
          
          <div class="footer">
              <p>This email was generated automatically by the RND Technosoft Catalogue Portal.</p>
              <p>Request submitted on: ${new Date().toLocaleString()}</p>
          </div>
      </div>
    </body>
    </html>
  `;
}

// Async function to handle email and external API calls
async function processInquiryAsync(newInquiry) {
  // Process email and external API in parallel
  const emailPromise = sendEmail(newInquiry);
  const thankYouPromise = sendThankYouEmail({
    to: newInquiry.email,
    name: newInquiry.name,
    subject: 'Thank You for Requesting RND Technosoft Catalogue',
    formType: 'Catalogue Request',
    inquiryDetails: {
      'Client Name': newInquiry.name,
      'Email': newInquiry.email,
      'Mobile': newInquiry.mobileNo
    },
    useHrAccount: true
  });
  const externalApiPromise = sendToExternalAPI(newInquiry);

  // Execute operations in parallel
  const [emailResult, thankYouResult, apiResult] = await Promise.allSettled([emailPromise, thankYouPromise, externalApiPromise]);

  // Log results
  if (emailResult.status === 'fulfilled') {
    console.log('✓ HR Email processing completed');
  } else {
    console.error('✗ HR Email processing failed:', emailResult.reason);
  }

  if (thankYouResult.status === 'fulfilled') {
    console.log('✓ Thank-You email processing completed');
  } else {
    console.error('✗ Thank-You email processing failed:', thankYouResult.reason);
  }

  if (apiResult.status === 'fulfilled') {
    console.log('✓ External API processing completed');
  } else {
    console.error('✗ External API processing failed:', apiResult.reason);
  }
}

// Optimized email sending function
async function sendEmail(newInquiry) {
  try {
    const emailHTML = generateEmailTemplate(newInquiry);

    const adminRecipient = process.env.OWNER_EMAIL || process.env.EMAIL_HR || process.env.EMAIL_USER;
    if (!adminRecipient) {
      throw new Error('Email recipient environment variable is not configured');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"RND Technosoft Catalogue Portal" <${adminRecipient}>`,
      to: adminRecipient,
      replyTo: newInquiry.email,
      subject: `New Catalogue Request - ${newInquiry.name}`,
      html: emailHTML
    };

    console.log('Attempting to send email...');
    const emailResult = await sendMailWithFallback(mailOptions);
    console.log('✓ Email sent successfully:', emailResult.messageId);
    return emailResult;

  } catch (emailError) {
    console.error('✗ Email sending failed:', emailError);
    throw emailError;
  }
}

// External API call function with improved error handling
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
      linkedin: '',
      subject: "Catalogue Request",
      message: `New catalogue request from ${newInquiry.name}. Phone: ${newInquiry.mobileNo}`,
      source: 'catalogue-portal',
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
          'User-Agent': 'RND-Catalogue-Portal/1.0',
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

    console.log('✓ External API call successful:', externalApiResponse.data);
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

// Main controller function
exports.createCatalogueInquiry = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);

    const { name, email, mobileNo, path } = req.body;

    // Basic validation
    if (!name || !email || !mobileNo) {
      return next(new AppError('Please provide name, email, and mobile number', 400));
    }

    // Step 1: Save to database
    const newInquiry = new CatalogueInquiry({
      name,
      email,
      mobileNo,
      path: path || ''
    });

    console.log('Attempting to save inquiry to database...');
    await newInquiry.save();
    console.log('✓ Inquiry saved to database successfully');

    // Send immediate response to client
    res.status(201).json({
      status: 'success',
      message: 'Catalogue request submitted successfully',
      data: {
        inquiry: {
          id: newInquiry._id,
          name: newInquiry.name,
          email: newInquiry.email
        }
      }
    });

    // Process email and external API asynchronously (non-blocking)
    processInquiryAsync(newInquiry);

  } catch (error) {
    console.error('✗ Main error in createCatalogueInquiry:', error);
    console.error('Error stack:', error.stack);

    return next(new AppError(
      'Error processing your request',
      500,
      process.env.NODE_ENV === 'development' ? error.stack : undefined
    ));
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

// Admin function to delete inquiry
exports.deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedInquiry = await CatalogueInquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return next(new AppError('No inquiry found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Inquiry deleted successfully',
      data: null
    });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return next(new AppError('Error deleting inquiry', 500));
  }
};