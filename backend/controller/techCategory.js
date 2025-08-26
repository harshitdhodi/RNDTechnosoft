// controllers/techCategoryController.js
const TechCategory = require('../model/TechCategory');
const path = require('path');
const fs = require('fs');

// Create a new TechCategory
const createTechCategory = async (req, res) => {
  try {
    const { heading, subheading, alt, imgTitle } = req.body;
<<<<<<< HEAD

    // Check if heading already exists
    const existingCategory = await TechCategory.findOne({ heading });
    if (existingCategory) {
      return res.status(400).json({ message: 'Tech category with this heading already exists' });
    }

    let photo;
    // Handle image upload via multer
    if (req.file) {
      photo = req.file.filename;
    }

=======
  let photo;
  // Handle image upload via multer
  if (req.file) {
    photo = req.file.filename;
  }
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    const techCategory = new TechCategory({
      heading,
      subheading,
      photo,
      alt,
      imgTitle,
    });

    const savedCategory = await techCategory.save();
    res.status(201).json({
      message: 'Tech category created successfully',
      data: savedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating tech category', error: error.message });
  }
};

// Get all TechCategories
const getAllTechCategories = async (req, res) => {
  try {
    const techCategories = await TechCategory.find();
    res.status(200).json({
      message: 'Tech categories retrieved successfully',
      data: techCategories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tech categories', error: error.message });
  }
};

// Get a single TechCategory by ID
const getTechCategoryById = async (req, res) => {
  try {
    const techCategory = await TechCategory.findById(req.params.id);
    if (!techCategory) {
      return res.status(404).json({ message: 'Tech category not found' });
    }
    res.status(200).json({
      message: 'Tech category retrieved successfully',
      data: techCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tech category', error: error.message });
  }
};

// Update a TechCategory
const updateTechCategory = async (req, res) => {
  try {
    const { heading, subheading, alt, imgTitle } = req.body;
    const updateData = {
      heading,
      subheading,
      alt,
      imgTitle,
    };

<<<<<<< HEAD
    // Check if heading already exists for another category
    if (heading) {
      const existingCategory = await TechCategory.findOne({
        heading,
        _id: { $ne: req.params.id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Tech category with this heading already exists' });
      }
    }

=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    if (req.file) {
      // If a new photo is uploaded, update the photo field and delete the old one
      const oldCategory = await TechCategory.findById(req.params.id);
      if (oldCategory && oldCategory.photo) {
        const oldPhotoPath = path.join(__dirname, '..', 'uploads', oldCategory.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath); // Delete old photo
        }
      }
      updateData.photo = req.file.filename;
    }

    const updatedCategory = await TechCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Tech category not found' });
    }

    res.status(200).json({
      message: 'Tech category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tech category', error: error.message });
  }
};

// Delete a TechCategory
const deleteTechCategory = async (req, res) => {
  try {
    const techCategory = await TechCategory.findById(req.params.id);
    if (!techCategory) {
      return res.status(404).json({ message: 'Tech category not found' });
    }

    // Delete associated photo if it exists
    if (techCategory.photo) {
      const photoPath = path.join(__dirname, '..', 'uploads', techCategory.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await TechCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tech category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tech category', error: error.message });
  }
};

// Serve uploaded photo
const getTechCategoryPhoto = async (req, res) => {
  try {
    const techCategory = await TechCategory.findById(req.params.id);
    if (!techCategory || !techCategory.photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const photoPath = path.join(__dirname, '..', 'uploads', techCategory.photo);
    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ message: 'Photo file not found on server' });
    }

    res.sendFile(photoPath);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving photo', error: error.message });
  }
};

module.exports = {
  createTechCategory,
  getAllTechCategories,
  getTechCategoryById,
  updateTechCategory,
  deleteTechCategory,
  getTechCategoryPhoto,
};