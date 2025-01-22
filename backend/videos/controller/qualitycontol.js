// qualityControlController.js

const QualityControl = require('../model/qualitycontrol');
const path = require('path');
const fs = require('fs');

// Get all quality controls
const getAllQualityControls = async (req, res) => {
  try {
    const qualityControls = await QualityControl.find();
    res.json(qualityControls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new quality control
const addQualityControl = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const { title, alt, description } = req.body;
    const newQualityControl = new QualityControl({ photo, title, alt, description });
    await newQualityControl.save();

    res.status(200).json({ message: 'Quality control added successfully', photo, title, alt, description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a quality control
const deleteQualityControl = async (req, res) => {
  const { id } = req.query;

  try {
    const qualityControl = await QualityControl.findById(id);

    if (!qualityControl) {
      return res.status(404).json({ message: 'Quality control not found' });
    }

    qualityControl.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    await QualityControl.findByIdAndDelete(id);

    res.status(200).json({ message: 'Quality control deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting quality control', error });
  }
};

// Update a quality control
const updateQualityControl = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    const existingQualityControl = await QualityControl.findById(id);

    if (!existingQualityControl) {
      return res.status(404).json({ message: 'Quality control not found' });
    }

    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingQualityControl.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingQualityControl.photo;
    }

    const updatedQualityControl = await QualityControl.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedQualityControl);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getQualityControlById = async (req, res) => {
    const { id } = req.query; // Assuming ID is passed as a query parameter
  
    try {
      const qualityControl = await QualityControl.findById(id);
  
      if (!qualityControl) {
        return res.status(404).json({ error: 'Quality control not found' });
      }
  
      res.json({ data: qualityControl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

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

// Controller to delete image and its alt text for quality control
const deleteImageAndAltText = async (req, res) => {
   
    const { id, imageFilename, index } = req.params;

    try {
        // Find the quality control by ID
        const qualityControl = await QualityControl.findById(id);

        if (!qualityControl) {
            return res.status(404).json({ message: 'Quality control not found' });
        }

        // Remove the photo and its alt text
        qualityControl.photo = qualityControl.photo.filter(photo => photo !== imageFilename);
        qualityControl.alt.splice(index, 1);

        await qualityControl.save();

        const filePath = path.join(__dirname, '..', 'images', imageFilename);

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo and alt text:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  getAllQualityControls,
  addQualityControl,
  deleteQualityControl,
  updateQualityControl,
  getQualityControlById,
  downloadImage,
  deleteImageAndAltText
};
