const express = require('express');
const multer = require('multer');
const router = express.Router();
const Achievements=require("../model/achievements")
const path = require('path');
const {uploadPhoto} =  require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');
const fs=require('fs')


// Get all images
router.get('/', async (req, res) => {
    try {
        const photo = await Achievements.find();
        res.json(photo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new image
router.post('/',requireAuth, uploadPhoto, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }

        // Save the image paths and description to the database
        const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
        const title = req.body.title || 'No description provided';
        const alt=req.body.alt
        const newAchievements = new Achievements({ photo, title , alt});
        await newAchievements.save();

        res.status(200).json({ message: 'Images uploaded successfully', photo, title,alt });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/deleteAchievements',requireAuth, async (req, res) => {
    const { id } = req.query;
  
    try {
      const achievements = await Achievements.findById(id); 
    
      achievements.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete file synchronously if it exists
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });
    
      if (!achievements) {
        return res.status(404).json({ message: 'Achievement not found' });
      }
  
      await Achievements.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Achievement deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting achievement', error });
    }
  });


// Download an image
router.get('/download/:filename', requireAuth,(req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../images', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
});


router.get('/getAchievementById',requireAuth, async (req, res) => {
    const { id } = req.query;
    try {
      const achievement = await Achievements.findById(id);
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found' });
      }
      res.json({ data: achievement });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.put('/updateAchievement',requireAuth, uploadPhoto, async (req, res) => {
    const { id } = req.query;
    const updateFields = req.body;
  
    try {
      // Fetch the existing achievement to get its current photos
      const existingAchievement = await Achievements.findById(id);
  
      if (!existingAchievement) {
        return res.status(404).json({ message: 'Achievement not found' });
      }
  
     
       // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingAchievement.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingAchievement.photo; // Keep existing photos if no new photos are uploaded
    }

      const updatedAchievement = await Achievements.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  router.delete('/:id/image/:imageFilename/:index', async (req, res) => {
  
    const { id, imageFilename, index } = req.params;
  
    try {
      // Find the achievement by ID
      const achievement = await Achievements.findById(id);
  
      if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found' });
      }
  
      // Remove the photo and its alt text
      achievement.photo = achievement.photo.filter(photo => photo !== imageFilename);
      achievement.alt.splice(index, 1);
  
      const filePath = path.join(__dirname, '..', 'images', imageFilename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await achievement.save();
  
      res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo and alt text:', error);
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
