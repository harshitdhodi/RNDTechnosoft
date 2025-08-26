const Technology = require('../model/technology'); // Adjust path as needed
const fs = require('fs');
const path = require('path');

// CREATE - Create a new technology
const createTechnology = async (req, res) => {
  try {
    const { alt,category, imgTitle,slug } = req.body;
    let photo;
    console.log(category)
    // Handle image upload via multer
    if (req.file) {
      photo = req.file.filename;
    }
    
    const technology = new Technology({
      photo,
      alt,
      imgTitle,
      slug,
      category
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
   

    const technologies = await Technology.find()
      .populate({
        path: 'category',
<<<<<<< HEAD
        select: 'name' // optionally populate only the name or required fields
=======
        select: 'heading' // optionally populate only the name or required fields
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      })
   
    res.status(200).json({
      message: 'Technologies retrieved successfully',
      data: technologies,
     
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

    const technology = await Technology.findById(id).populate({
      path: 'category',
<<<<<<< HEAD
      select: 'heading' // optional: only return the category heading
=======
      select: 'name' // optional: only return the category name
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    });

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
    const { alt, imgTitle,category,slug } = req.body;
    
    // Find existing technology
    const existingTechnology = await Technology.findById(id);
    if (!existingTechnology) {
      return res.status(404).json({ 
        message: 'Technology not found' 
      });
    }

    // Prepare update data
    const updateData = { alt,category, imgTitle ,slug };
    
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