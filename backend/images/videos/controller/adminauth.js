const jwt = require('jsonwebtoken');
const Admin = require('../model/admin');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path=require('path')
const fs=require('fs')


const createToken = (id) => {
  return jwt.sign({ id }, 'secret');
};

// Admin registration
const registerAdmin = async (req, res) => {
  try {

    const { email, notpassword, firstname, lastname} = req.body;

    let photo = null;

    if (req.file) {
      photo = req.file.filename;
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (!email || !notpassword || !firstname || !lastname) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const password = await bcrypt.hash(notpassword, 10);

    const newAdmin = new Admin({ email, password, firstname, lastname, photo });

    await newAdmin.save();
    return res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Incorrect email ' });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect  password' });
    }

    const token = createToken(admin._id);
    res.cookie('jwt', token, {
      httpOnly: false,
      sameSite: 'None', // Set SameSite attribute to None
      secure: false // Ensure the cookie is sent over HTTPS
    });
    

    return res.status(200).json({ success: true, admin: admin._id, token: token });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.newAdmin; // Access admin ID from req object set by middleware
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Return admin details excluding sensitive information like password
    const { _id, email, firstname, lastname, photo } = admin;
    return res.status(200).json({ success: true, admin: { _id, email, firstname, lastname, photo } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.newAdmin; // Access admin ID from req object set by middleware
    const { email, firstname, lastname } = req.body;
    
    let photo;

    if (req.file) {
      photo = req.file.filename;

      // Optionally, you may want to delete the old photo from the server if a new one is uploaded
      const admin = await Admin.findById(adminId);
      if (admin.photo) {
        const oldPhotoPath = path.join(__dirname, '../logos', admin.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const updatedData = { email, firstname, lastname };
    if (photo) {
      updatedData.photo = photo;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updatedData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', admin: updatedAdmin });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { registerAdmin, loginAdmin ,getAdminProfile,updateAdminProfile};
