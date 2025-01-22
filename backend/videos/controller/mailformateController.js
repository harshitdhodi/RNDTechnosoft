const nodemailer = require('nodemailer');
require("dotenv").config();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail email address
        pass: process.env.EMAIL_PASS, // Your Gmail password
    }
});



const sendVerificationEmail = async (email) => {
    try {
      
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: 'Account Verified', // Subject line
            text: 'Your account has been verified , you can now login to E-Kirana website with your register email id and password  .', // Plain text body
            html: '<b>Your account has been verified , you can now login now login to E-Kirana website with your register email id and password  .</b>' // HTML body
        });

       
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendBlockEmail = async (email) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: 'Account has been Blocked', // Subject line
            text: 'Your account has been Blocked on E-Kirana because inappropriate use, you cannot access your account now .', // Plain text body
            html: '<b>Your account has been Blocked on E-Kirana because inappropriate use, you cannot access your account now .</b>' // HTML body
        });

    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendEmail = async (email,otp) => {
    try {
        // Create a transporter object using SMTP transport
      
   

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject:"password reset OTP",
            text:`Your OPT (experises in one hour ): ${otp}`,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};





module.exports = { sendVerificationEmail,sendBlockEmail,sendEmail };
