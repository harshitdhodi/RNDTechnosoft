const Technology = require('../model/technology'); // Adjust path as needed
const fs = require('fs');
const path = require('path');

// CREATE - Create a new technology
const createTechnology = async (req, res) => {
  try {
    const { alt, imgTitle,slug } = req.body;
    let photo;
    
    // Handle image upload via multer
    if (req.file) {
      photo = req.file.filename;
    }
    
    const technology = new Technology({
      photo,
      alt,
      imgTitle,
      slug
    });

    const savedTechnology = await technology.save();
    res.status(201).json({
      message: 'Tech category created successfully',
      data: savedTechnology,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating tech category', 
      error: error.message 
    });
  }
};

// READ - Get all technologies
const getAllTechnologies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const technologies = await Technology.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Technology.countDocuments();
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: 'Technologies retrieved successfully',
      data: technologies,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving technologies', 
      error: error.message 
    });
  }
};

// READ - Get technology by ID
const getTechnologyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const technology = await Technology.findById(id);
    
    if (!technology) {
      return res.status(404).json({ 
        message: 'Technology not found' 
      });
    }

    res.status(200).json({
      message: 'Technology retrieved successfully',
      data: technology,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid technology ID format' 
      });
    }
    res.status(500).json({ 
      message: 'Error retrieving technology', 
      error: error.message 
    });
  }
};

// UPDATE - Update technology by ID
const updateTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const { alt, imgTitle,slug } = req.body;
    
    // Find existing technology
    const existingTechnology = await Technology.findById(id);
    if (!existingTechnology) {
      return res.status(404).json({ 
        message: 'Technology not found' 
      });
    }

    // Prepare update data
    const updateData = { alt, imgTitle ,slug };
    
    // Handle new image upload
    if (req.file) {
      // Delete old image file if it exists
      if (existingTechnology.photo) {
        const oldImagePath = path.join(__dirname, '../uploads', existingTechnology.photo);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.photo = req.file.filename;
    }

    const updatedTechnology = await Technology.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Technology updated successfully',
      data: updatedTechnology,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid technology ID format' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: 'Error updating technology', 
      error: error.message 
    });
  }
};

// DELETE - Delete technology by ID
const deleteTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    
    const technology = await Technology.findById(id);
    if (!technology) {
      return res.status(404).json({ 
        message: 'Technology not found' 
      });
    }

    // Delete associated image file if it exists
    if (technology.photo) {
      const imagePath = path.join(__dirname, '../uploads', technology.photo);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Technology.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Technology deleted successfully',
      data: technology,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid technology ID format' 
      });
    }
    res.status(500).json({ 
      message: 'Error deleting technology', 
      error: error.message 
    });
  }
};



module.exports = {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology
};