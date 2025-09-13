const { default: axios } = require('axios');
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
    console.log('Request body:', req.body);
    
    // Step 1: Save to database
    const newInquiry = new ContactInquiry(req.body);
    await newInquiry.save();
    console.log('✓ Inquiry saved to database successfully');

    // Send immediate response to client
    res.status(201).json({ 
      success: true, 
      message: 'Inquiry submitted successfully',
      data: {
        id: newInquiry._id,
        name: newInquiry.name,
        email: newInquiry.email
      }
    });

    // Process email and external API asynchronously
    processContactInquiryAsync(newInquiry);

  } catch (error) {
    console.error('✗ Main error in createInquiry:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Async function to handle email and external API calls
async function processContactInquiryAsync(inquiry) {
  // Process email and external API in parallel
  const emailPromise = sendContactEmail(inquiry);
  const externalApiPromise = sendContactToExternalAPI(inquiry);

  // Execute both operations in parallel
  const [emailResult, apiResult] = await Promise.allSettled([emailPromise, externalApiPromise]);

  // Log results
  if (emailResult.status === 'fulfilled') {
    console.log('✓ Email processing completed');
  } else {
    console.error('✗ Email processing failed:', emailResult.reason);
  }

  if (apiResult.status === 'fulfilled') {
    console.log('✓ External API processing completed');
  } else {
    console.error('✗ External API processing failed:', apiResult.reason);
  }
}

// Email sending function with proper error handling
async function sendContactEmail(inquiry) {
  try {
    // Verify email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_APP_PASSWORD environment variables.');
    }

    // HTML Email Template
    const emailHTML = generateContactEmailTemplate(inquiry);

    const mailOptions = {
      from: `"RND Technosoft Contact Form" <${process.env.EMAIL_USER}>`, // Use your email as sender
      to: process.env.EMAIL_USER,
      cc: process.env.OWNER_EMAIL || undefined,
      replyTo: inquiry.email, // Client can reply directly to inquirer
      subject: `New Contact Inquiry: ${inquiry.subject}`,
      html: emailHTML
    };

    console.log('Attempting to send contact email...');
    console.log('Email config check:', {
      from: mailOptions.from,
      to: mailOptions.to,
      cc: mailOptions.cc,
      hasAuth: !!process.env.EMAIL_APP_PASSWORD
    });

    // Verify transporter configuration before sending
    await transporter.verify();
    console.log('✓ Email transporter verified');

    const emailResult = await transporter.sendMail(mailOptions);
    console.log('✓ Contact email sent successfully:', emailResult.messageId);
    return emailResult;

  } catch (emailError) {
    console.error('✗ Contact email sending failed:', emailError);
    
    // Specific error handling for common Gmail issues
    if (emailError.message.includes('Invalid login')) {
      console.error('Gmail Authentication Error: Please use App Password instead of regular password');
      console.error('Steps to fix:');
      console.error('1. Enable 2-Factor Authentication on your Gmail account');
      console.error('2. Generate an App Password for this application');
      console.error('3. Use the App Password in EMAIL_APP_PASSWORD environment variable');
    }
    
    throw emailError;
  }
}

// External API call function
async function sendContactToExternalAPI(inquiry) {
  try {
    console.log('Attempting to send contact data to external API...');
    
    const apiKey = process.env.EXTERNAL_API_KEY || "A78A8BC90C6F6235";
    const apiId = process.env.EXTERNAL_API_ID || "MW1V";
    
    console.log('Using Contact API_ID:', apiId);
    
    const payload = {
      API_KEY: apiKey,
      API_ID: apiId,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message
    };

    console.log('External API payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      'https://leads.rndtechnosoft.com/api/contactform/message',
      payload,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'RND-Contact-Portal/1.0'
        }
      }
    );
    
    console.log('✓ External API call successful:', response.data);
    return response.data;

  } catch (externalError) {
    console.error('✗ Failed to send contact data to external DB:', externalError.message);
    if (externalError.response) {
      console.error('External API Error Status:', externalError.response.status);
      console.error('External API Error Details:', externalError.response.data);
    }
    throw externalError;
  }
}

// Enhanced email template generator
function generateContactEmailTemplate(inquiry) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry</title>
        <style>
            body {
                font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 650px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: 1px solid #e9ecef;
            }
            .header {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            .logo {
                width: 100px;
                height: auto;
                margin-bottom: 15px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                padding: 10px;
                position: relative;
                z-index: 1;
            }
            .header h2 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                position: relative;
                z-index: 1;
            }
            .header .sub-text {
                margin: 8px 0 0 0;
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 40px 30px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 30px;
            }
            .info-item {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #007bff;
                transition: transform 0.2s ease;
            }
            .info-item:hover {
                transform: translateY(-2px);
            }
            .info-label {
                font-size: 12px;
                font-weight: 600;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                display: block;
            }
            .info-value {
                font-size: 16px;
                color: #212529;
                font-weight: 500;
                word-break: break-word;
            }
            .message-section {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 25px;
                border-radius: 10px;
                border: 1px solid #dee2e6;
                margin-top: 20px;
            }
            .message-label {
                font-size: 14px;
                font-weight: 600;
                color: #495057;
                margin-bottom: 12px;
                display: block;
            }
            .message-content {
                color: #212529;
                font-size: 15px;
                line-height: 1.7;
                white-space: pre-wrap;
                background: white;
                padding: 20px;
                border-radius: 6px;
                border: 1px solid #dee2e6;
            }
            .metadata {
                margin-top: 30px;
                padding: 20px;
                background: #f1f3f4;
                border-radius: 8px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .metadata-item {
                font-size: 13px;
                color: #6c757d;
            }
            .metadata-label {
                font-weight: 600;
                display: block;
                margin-bottom: 4px;
            }
            .footer {
                background: #343a40;
                color: #adb5bd;
                padding: 25px 30px;
                text-align: center;
                font-size: 13px;
            }
            .footer-logo {
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 8px;
            }
            .action-buttons {
                text-align: center;
                margin: 25px 0;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            }
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                .metadata {
                    grid-template-columns: 1fr;
                }
                .container {
                    margin: 10px;
                    border-radius: 8px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header Section -->
            <div class="header">
                <img src="https://rndtechnosoft.com/api/logo/download/rndlogo.png" class="logo" alt="RND Technosoft Logo">
                <h2>🔔 New Contact Inquiry</h2>
                <p class="sub-text">A potential client has reached out through your website</p>
            </div>

            <!-- Content Section -->
            <div class="content">
                <!-- Contact Information Grid -->
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Full Name</span>
                        <div class="info-value">${inquiry.name}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email Address</span>
                        <div class="info-value">${inquiry.email}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone Number</span>
                        <div class="info-value">${inquiry.phone}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Subject</span>
                        <div class="info-value">${inquiry.subject}</div>
                    </div>
                </div>

                <!-- Message Section -->
                <div class="message-section">
                    <span class="message-label">📝 Message Details</span>
                    <div class="message-content">${inquiry.message}</div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <a href="mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}" class="btn">
                        📧 Reply to Client
                    </a>
                </div>

                <!-- Metadata -->
                <div class="metadata">
                    <div class="metadata-item">
                        <span class="metadata-label">Received Date</span>
                        ${new Date().toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Received Time</span>
                        ${new Date().toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZoneName: 'short'
                        })}
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Source</span>
                        Website Contact Form
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Priority</span>
                        Normal
                    </div>
                </div>
            </div>

            <!-- Footer Section -->
            <div class="footer">
                <div class="footer-logo">RND Technosoft</div>
                <p>This is an automated notification from your website contact form.<br>
                Please respond to the client within 24 hours for best customer experience.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

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
