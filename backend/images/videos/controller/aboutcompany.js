// mission.controller.js
const Aboutcompany = require('../model/aboutcompany');

exports.getAllAboutcompany = async (req, res) => {
    try {
        const aboutcompany = await Aboutcompany.findOne();
        res.status(200).json({ data:aboutcompany });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAboutcompany = async (req, res) => {
  const updateFields = req.body;

  try {
      // Fetch the existing Aboutcompany record
      const existingAboutcompany = await Aboutcompany.findOne();

      // Process new uploaded photos
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
          const newPhotoPaths = req.files['photo'].map(file => file.filename);
          updateFields.photo = existingAboutcompany 
              ? [...existingAboutcompany.photo, ...newPhotoPaths] // Append new photos to existing ones
              : newPhotoPaths; // Use new photos if no existing record
      } else {
          updateFields.photo = existingAboutcompany ? existingAboutcompany.photo : []; // Use existing photos or an empty array if no existing record
      }

      let updatedAboutcompany;
      if (existingAboutcompany) {
          // Update the existing document
          updatedAboutcompany = await Aboutcompany.findOneAndUpdate(
              {}, // Filter condition (empty means it will target the first document found)
              updateFields,
              { 
                  new: true, 
                  runValidators: true
              }
          );
      } else {
          // Create a new document
          updatedAboutcompany = new Aboutcompany(updateFields);
          await updatedAboutcompany.save();
      }

      

      res.status(200).json(updatedAboutcompany);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};


  exports.deletePhotoAndAltText = async (req, res) => {
   
    const { imageFilename, index } = req.params;
  
    try {
      // Find the service by ID
      const aboutcompany = await Aboutcompany.findOne();
  
      if (!aboutcompany) {
        return res.status(404).json({ message: 'aboutcompany not found' });
      }
  
      // Remove the photo and its alt text
      aboutcompany.photo = aboutcompany.photo.filter(photo => photo !== imageFilename);
      aboutcompany.alt.splice(index, 1);
      aboutcompany.imgtitle.splice(index, 1);

  
      const filePath = path.join(__dirname, '..', 'images', imageFilename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await aboutcompany.save();
  
      res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo and alt text:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
