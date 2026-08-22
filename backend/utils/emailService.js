const nodemailer = require('nodemailer');

/**
 * Get available credential pairs from process.env
 */
const getCredentialPairs = () => {
  const pairs = [];
  const addedUsers = new Set();

  const userPass = process.env.EMAIL_PASS || process.env.BDM_PASS || process.env.EMAIL_APP_PASSWORD;
  const ownerPass = process.env.OWNER_PASS;
  const hrPass = process.env.HR_PASS;

  const userPair = (process.env.EMAIL_USER || process.env.BDM_EMAIL) && userPass ? { user: process.env.EMAIL_USER || process.env.BDM_EMAIL, pass: userPass, name: 'EMAIL_USER (BDM)' } : null;
  const ownerPair = process.env.OWNER_EMAIL && ownerPass ? { user: process.env.OWNER_EMAIL, pass: ownerPass, name: 'OWNER_EMAIL' } : null;
  const hrPair = process.env.EMAIL_HR && hrPass ? { user: process.env.EMAIL_HR, pass: hrPass, name: 'EMAIL_HR' } : null;

  if (userPair && !addedUsers.has(userPair.user)) {
    pairs.push(userPair);
    addedUsers.add(userPair.user);
  }

  if (ownerPair && !addedUsers.has(ownerPair.user)) {
    pairs.push(ownerPair);
    addedUsers.add(ownerPair.user);
  }

  if (hrPair && !addedUsers.has(hrPair.user)) {
    pairs.push(hrPair);
    addedUsers.add(hrPair.user);
  }

  return pairs;
};

/**
 * Creates a Nodemailer Transporter for a specific auth pair (Zoho Mail SMTP by default)
 */
const createTransporterForAuth = (user, pass) => {
  const host = process.env.SMTP_HOST || 'smtp.zoho.in';
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465;
  const secure = process.env.SMTP_SECURE !== undefined ? (process.env.SMTP_SECURE === 'true') : (port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 14,
  });
};

/**
 * Generates a modern HTML Thank-You email template with WhatsApp redirect button (9510152350)
 */
const generateThankYouTemplate = ({
  name = 'Valued Customer',
  subject = 'Thank You for Reaching Out to RND Technosoft',
  formType = 'Inquiry',
  inquiryDetails = {},
}) => {
  const logoUrl = 'https://www.rndtechnosoft.com/api/logo/download/rndlogo.png';
  const whatsappNumber = '919510152350';
  const whatsappDisplay = '+91 9510152350';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi RND Technosoft Team, I recently submitted an inquiry on your website.')}`;
  
  let detailsHtml = '';
  if (inquiryDetails && Object.keys(inquiryDetails).length > 0) {
    const items = Object.entries(inquiryDetails)
      .filter(([_, val]) => val !== undefined && val !== null && val !== '')
      .map(([key, val]) => `
        <div style="background: #fafafa; padding: 16px 20px; border-radius: 8px; border-left: 4px solid #ffd333; border-top: 1px solid #ececec; border-right: 1px solid #ececec; border-bottom: 1px solid #ececec;">
          <span style="font-size: 11px; font-weight: 700; color: #8a8a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; display: block;">${key.replace(/([A-Z])/g, ' $1')}</span>
          <div style="font-size: 15px; color: #111111; font-weight: 600; word-break: break-word;">${val}</div>
        </div>
      `).join('');

    if (items) {
      detailsHtml = `
        <div style="margin: 26px 0 10px 0;">
          <span style="font-size: 12px; font-weight: 700; color: #8a8a8a; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px; display: block;">📋 Your Submission Summary</span>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            ${items}
          </div>
        </div>
      `;
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f2;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 650px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
            border: 1px solid #1a1a1a;
        }
        .header {
            background: linear-gradient(135deg, #3a3a3a 0%, #1c1c1c 55%, #0d0d0d 100%);
            color: #ffffff;
            padding: 34px 30px;
            text-align: center;
            position: relative;
            border-bottom: 4px solid #ffd333;
        }
        .logo-wrap {
            display: inline-block;
            background: #ffffff;
            border-radius: 10px;
            padding: 10px 18px;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }
        .logo {
            width: 160px;
            height: auto;
            display: block;
        }
        .header h2 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.3px;
        }
        .header .sub-text {
            margin: 8px 0 0 0;
            font-size: 15px;
            color: #ffd333;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .message-section {
            background: #111111;
            padding: 26px;
            border-radius: 10px;
            margin-top: 24px;
        }
        .message-label {
            font-size: 13px;
            font-weight: 700;
            color: #ffd333;
            margin-bottom: 12px;
            display: block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .message-content {
            color: #f0f0f0;
            font-size: 15px;
            line-height: 1.7;
            background: #1c1c1c;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #2e2e2e;
        }
        .action-buttons {
            text-align: center;
            margin: 28px 0 10px 0;
        }
        .btn-whatsapp {
            display: inline-block;
            background: #25D366;
            color: #ffffff !important;
            padding: 13px 26px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.45);
            border: 2px solid #1ebe5d;
            margin: 6px;
        }
        .btn {
            display: inline-block;
            background: #ffd333;
            color: #111111 !important;
            padding: 13px 26px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 14px rgba(255, 211, 51, 0.45);
            border: 2px solid #111111;
            margin: 6px;
        }
        .footer {
            background: #111111;
            color: #bdbdbd;
            padding: 26px 30px;
            text-align: center;
            font-size: 13px;
            border-top: 3px solid #ffd333;
        }
        .footer-logo {
            font-weight: 700;
            color: #ffd333;
            font-size: 15px;
            margin-bottom: 8px;
            letter-spacing: 0.3px;
        }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .btn-whatsapp, .btn { display: block; width: 100%; box-sizing: border-box; margin: 8px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header Section -->
        <div class="header">
            <div class="logo-wrap">
                <img src="${logoUrl}" class="logo" alt="RND Technosoft Logo">
            </div>
            <h2>🎉 Thank You for Reaching Out!</h2>
            <p class="sub-text">We have received your ${formType.toLowerCase()}</p>
        </div>

        <!-- Content Section -->
        <div class="content">
            <p style="font-size: 16px; color: #111111; margin: 0 0 16px 0;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 15px; color: #444444; margin: 0 0 16px 0; line-height: 1.7;">
                Thank you for contacting <strong>RND Technosoft</strong>. We appreciate your interest in our services and solutions.
            </p>

            ${detailsHtml}

            <!-- What Happens Next Section -->
            <div class="message-section">
                <span class="message-label">⚡ What Happens Next?</span>
                <div class="message-content">
                    Our specialized technical team is currently reviewing your submission and will get back to you within 24 business hours.<br><br>
                    Need immediate assistance? Click below to chat directly with us on WhatsApp or email us at 
                    <a href="mailto:info@rndtechnosoft.com" style="color: #ffd333; font-weight: 700; text-decoration: underline;">info@rndtechnosoft.com</a>.
                </div>
            </div>

            <!-- Action Buttons with WhatsApp Redirect -->
            <div class="action-buttons">
                <a href="${whatsappUrl}" class="btn-whatsapp" target="_blank">
                    💬 Chat on WhatsApp (${whatsappDisplay})
                </a>
                <a href="https://rndtechnosoft.com" class="btn" target="_blank">
                    🌐 Visit Our Website
                </a>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <div class="footer-logo">RND Technosoft</div>
            <p>This is an automated confirmation email for your submission records.<br>
            Thank you for choosing RND Technosoft.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send email trying available credential pairs with automatic fallback if auth fails
 */
const sendMailWithFallback = async (mailOptions) => {
  const credentialPairs = getCredentialPairs();

  if (credentialPairs.length === 0) {
    throw new Error('No email credentials configured in environment variables.');
  }

  let lastError = null;

  for (const pair of credentialPairs) {
    try {
      const transporter = createTransporterForAuth(pair.user, pair.pass);
      const options = {
        ...mailOptions,
        from: mailOptions.from || `"RND Technosoft" <${pair.user}>`,
      };

      console.log(`[sendMailWithFallback] Attempting email send via ${pair.name} (${pair.user}) on Zoho SMTP...`);
      const info = await transporter.sendMail(options);
      console.log(`✓ Email sent successfully via ${pair.user}. MessageId: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`✗ Email sending failed via ${pair.user}:`, err.message);
      lastError = err;
    }
  }

  throw lastError;
};

/**
 * Helper to safely send auto thank-you emails to submitters
 */
const sendThankYouEmail = async ({
  to,
  name = 'Valued Customer',
  subject = 'Thank You for Your Submission - RND Technosoft',
  formType = 'Inquiry',
  inquiryDetails = {},
}) => {
  if (!to) {
    console.warn(`[sendThankYouEmail] Skipped sending Thank-You email: recipient email missing.`);
    return null;
  }

  try {
    const htmlContent = generateThankYouTemplate({
      name,
      subject,
      formType,
      inquiryDetails,
    });

    const mailOptions = {
      to,
      subject,
      html: htmlContent,
    };

    console.log(`Sending auto Thank-You email to ${to} (${formType})...`);
    return await sendMailWithFallback(mailOptions);
  } catch (error) {
    console.error(`✗ Failed to send Thank-You email to ${to}:`, error.message);
    return null;
  }
};

module.exports = {
  getTransporter: () => {
    const pairs = getCredentialPairs();
    if (pairs.length > 0) {
      return createTransporterForAuth(pairs[0].user, pairs[0].pass);
    }
    return createTransporterForAuth(process.env.EMAIL_USER || process.env.BDM_EMAIL, process.env.EMAIL_PASS || process.env.BDM_PASS);
  },
  generateThankYouTemplate,
  sendThankYouEmail,
  sendMailWithFallback,
};
