// mission.controller.js
const Vision = require('../model/vision');

exports.getAllVisions = async (req, res) => {
    try {
        const vision = await Vision.findOne();
        res.status(200).json({ data:vision });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateVision = async (req, res) => {
    
    const updateFields = req.body;
 
    try {
      // Fetch the existing service to get its current photos and alt texts
      const existingVision = await Vision.findOne();
  
    
  
      // Process new uploaded photos and their alt texts
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename); 
        updateFields.photo = existingVision 
              ? [...existingVision.photo, ...newPhotoPaths]
              : newPhotoPaths;
      } else {
          updateFields.photo = existingVision ? existingVision.photo : [];
      }

  
      const updatedVision = await Vision.findOneAndUpdate({},
        updateFields,
        { new: true, runValidators: true,upsert:true }
      );
  
      res.status(200).json(updatedVision);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.deletePhotoAndAltText = async (req, res) => {
   
    const { imageFilename, index } = req.params;
  
    try {
      // Find the service by ID
      const mission = await Vision.findOne();
  
      if (!mission) {
        return res.status(404).json({ message: 'Vision not found' });
      }
  
      // Remove the photo and its alt text
      mission.photo = mission.photo.filter(photo => photo !== imageFilename);
      mission.alt.splice(index, 1);
  
      await mission.save();

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
  
