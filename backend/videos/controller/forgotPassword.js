const Admin = require("../model/admin"); // Import the Admin model
const {sendEmail } = require('./mailformateController');
const bcrypt = require('bcrypt');

const forgetPassword = async(req,res)=>{
    try{
        const{email}=req.body;
       
        const user = await Admin.findOne({email})
      
        if(!user)
        {
            return res.status(404).json({success:false,message:'User not found'})
        }

        

        const generateOTP = () => {
            return Math.floor(100000 + Math.random()* 900000);
        };

        const otp = generateOTP();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 600000;

        await user.save();

        await sendEmail(email,otp);

        return res.status(200).json({ success: true, message: 'OTP sent to your email', redirect: '/password/verifyOtp' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const verifyOTP = async (req,res)=>{
    try{
        const {email,otp}=req.body;
     
        const user = await Admin.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires:{ $gt:Date.now()}
       
        })

       
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
        return res.status(200).json({ success: true, message: 'OTP verified', redirect: '/password/resetPassword' });
    }
    catch (error) {
       
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const resetPassword= async (req,res)=>{
    try{
        const {email,newPassword}=req.body;
        const user = await Admin.findOne({email})
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

         user.resetPasswordOTP = undefined;
         user.resetPasswordExpires = undefined;
         await user.save();
         return res.status(200).json({ success: true, message: 'Password reset successful', redirect: '/admin/login' });
    }
    catch (error) {

        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const ManagePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

      
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

       
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid current password' });
        }

        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

      
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = { forgetPassword, resetPassword, verifyOTP,ManagePassword };
