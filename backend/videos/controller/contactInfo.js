const ContactInfo = require('../model/contactInfo'); // Adjust the path to your model
const mongoose = require('mongoose');

// Create a new ContactInfo entry
exports.createContactInfo = async (req, res) => {
  try {
    // Multer will store the file in req.file
    const { imgTitle, alt, title, address, type, phone1, phone2, email1, email2 } = req.body;
    const photo = req.file ? req.file.filename : null; // Get the filename from req.file

    if (!photo) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    const newContactInfo = new ContactInfo({
      photo,
      type,
      imgTitle,
      alt,
      title,
      address,
      phone1,
      phone2,
      email1,
      email2
    });

    const savedContactInfo = await newContactInfo.save();
    res.status(201).json({ message: 'Contact Info created successfully', data: savedContactInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Contact Info', error });
  }
};


// Get all ContactInfo entries
exports.getAllContactInfo = async (req, res) => {
  try {
    const contactInfos = await ContactInfo.find();
    res.status(200).json({ message: 'Contact Info fetched successfully', data: contactInfos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Contact Info', error });
  }
};

// Get a single ContactInfo by ID
exports.getContactInfoById = async (req, res) => {
  try {
    const { id } = req.query;
    const contactInfo = await ContactInfo.findById(id);

    if (!contactInfo) {
      return res.status(404).json({ message: 'Contact Info not found' });
    }

    res.status(200).json({ message: 'Contact Info fetched successfully', data: contactInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Contact Info', error });
  }
};

// Update a ContactInfo by ID
exports.updateContactInfo = async (req, res) => {
  try {
    const { imgTitle, alt, title, address, type, phone1, phone2, email1, email2 } = req.body;
    const photo = req.file ? req.file.filename : null;

    const updateFields = {
      type,
      imgTitle,
      alt,
      title,
      address,
      phone1, phone2, email1, email2
    };

    if (photo) {
      updateFields.photo = photo;
    }

    const updatedContactInfo = await ContactInfo.findByIdAndUpdate(
      req.query.id,
      updateFields,
      { new: true }
    );

    if (!updatedContactInfo) {
      return res.status(404).json({ message: 'Contact Info not found' });
    }

    res.status(200).json({ message: 'Contact Info updated successfully', data: updatedContactInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Contact Info', error });
  }
};


// Delete a ContactInfo by ID
exports.deleteContactInfo = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedContactInfo = await ContactInfo.findByIdAndDelete(id);

    if (!deletedContactInfo) {
      return res.status(404).json({ message: 'Contact Info not found' });
    }

    res.status(200).json({ message: 'Contact Info deleted successfully', data: deletedContactInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Contact Info', error });
  }
};
