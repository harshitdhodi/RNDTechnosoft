// infrastructureController.js

const Infrastructure = require('../model/infrastructure');
const path = require('path');
const fs = require('fs');

// Get all infrastructures
const getAllInfrastructures = async (req, res) => {
  try {
    const infrastructures = await Infrastructure.find();
    res.json(infrastructures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new infrastructure
const addInfrastructure = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];

    const { title, alt, description } = req.body;
    const newInfrastructure = new Infrastructure({ photo, title, alt, description });
    await newInfrastructure.save();

    res.status(200).json({ message: 'Infrastructure added successfully', photo, title, alt, description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an infrastructure
const deleteInfrastructure = async (req, res) => {
  const { id } = req.query;

  try {
    const infrastructure = await Infrastructure.findById(id);

    if (!infrastructure) {
      return res.status(404).json({ message: 'Infrastructure not found' });
    }

    infrastructure.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    await Infrastructure.findByIdAndDelete(id);

    res.status(200).json({ message: 'Infrastructure deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting infrastructure', error });
  }
};

// Update an infrastructure
const updateInfrastructure = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    const existingInfrastructure = await Infrastructure.findById(id);

    if (!existingInfrastructure) {
      return res.status(404).json({ message: 'Infrastructure not found' });
    }

    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingInfrastructure.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingInfrastructure.photo;
    }

    const updatedInfrastructure = await Infrastructure.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedInfrastructure);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getInfrastructureById = async (req, res) => {
    const { id } = req.query; // Assuming ID is passed as a query parameter
  
    try {
      const infrastructure = await Infrastructure.findById(id);
  
      if (!infrastructure) {
        return res.status(404).json({ error: 'Infrastructure not found' });
      }
  
      res.json({ data: infrastructure });
    } catch (error) {
     
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

// Controller to delete image and its alt text
const deleteImageAndAltText = async (req, res) => {
   
    const { id, imageFilename, index } = req.params;

    try {
        // Find the infrastructure by ID
        const infrastructure = await Infrastructure.findById(id);

        if (!infrastructure) {
            return res.status(404).json({ message: 'Infrastructure not found' });
        }

        // Remove the photo and its alt text
        infrastructure.photo = infrastructure.photo.filter(photo => photo !== imageFilename);
        infrastructure.alt.splice(index, 1);

      

        await infrastructure.save();

        const filePath = path.join(__dirname, '..', 'images', imageFilename);

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  getAllInfrastructures,
  addInfrastructure,
  deleteInfrastructure,
  updateInfrastructure,
  getInfrastructureById,
  downloadImage,
  deleteImageAndAltText
};
