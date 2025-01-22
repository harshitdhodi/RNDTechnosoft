const Benefit = require('../model/benefits');
const path = require('path');
const fs = require('fs');

// Get all benefits
const getAllBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find();
    res.json(benefits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new benefit
const addBenefit = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const { title, alt, description } = req.body;
    const newBenefit = new Benefit({ photo, title, alt, description });
    await newBenefit.save();

    res.status(200).json({ message: 'Benefit added successfully', photo, title, alt, description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a benefit
const deleteBenefit = async (req, res) => {
  const { id } = req.query;

  try {
    const benefit = await Benefit.findById(id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    benefit.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    await Benefit.findByIdAndDelete(id);

    res.status(200).json({ message: 'Benefit deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting benefit', error });
  }
};

// Update a benefit
const updateBenefit = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    const existingBenefit = await Benefit.findById(id);

    if (!existingBenefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename);
      updateFields.photo = [...existingBenefit.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingBenefit.photo;
    }

    const updatedBenefit = await Benefit.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBenefit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a benefit by ID
const getBenefitById = async (req, res) => {
  const { id } = req.query; // Assuming ID is passed as a query parameter

  try {
    const benefit = await Benefit.findById(id);

    if (!benefit) {
      return res.status(404).json({ error: 'Benefit not found' });
    }

    res.json({ data: benefit });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Download image
const downloadImage = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../images', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'File download failed' });
    }
  });
};

// Delete image and its alt text
const deleteImageAndAltText = async (req, res) => {
  const { id, imageFilename, index } = req.params;

  try {
    const benefit = await Benefit.findById(id);

    if (!benefit) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    // Remove the photo and its alt text
    benefit.photo = benefit.photo.filter(photo => photo !== imageFilename);
    benefit.alt.splice(index, 1);

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await benefit.save();

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBenefits,
  addBenefit,
  deleteBenefit,
  updateBenefit,
  getBenefitById,
  downloadImage,
  deleteImageAndAltText
};
