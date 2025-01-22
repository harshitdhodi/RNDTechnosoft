// mission.controller.js
const Mission = require('../model/mission');

exports.getAllMissions = async (req, res) => {
    try {
        const mission = await Mission.findOne();
        res.status(200).json({ data:mission });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMission = async (req, res) => {
  const updateFields = req.body;

  try {
      // Fetch the existing Mission record
      const existingMission = await Mission.findOne();

      // Process new uploaded photos
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
          const newPhotoPaths = req.files['photo'].map(file => file.filename);
          updateFields.photo = existingMission 
              ? [...existingMission.photo, ...newPhotoPaths]
              : newPhotoPaths;
      } else {
          updateFields.photo = existingMission ? existingMission.photo : [];
      }

      // Update or create the Mission record
      const updatedMission = await Mission.findOneAndUpdate(
          {}, // Filter condition (empty means it will target the first document found)
          updateFields,
          { 
              new: true, 
              runValidators: true, 
              upsert: true // Create a new document if no document matches the filter
          }
      );

      res.status(200).json(updatedMission);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

  exports.deletePhotoAndAltText = async (req, res) => {
  
    const { imageFilename, index } = req.params;
  
    try {
      // Find the service by ID
      const mission = await Mission.findOne();
  
      if (!mission) {
        return res.status(404).json({ message: 'mission not found' });
      }
  
      // Remove the photo and its alt text
      mission.photo = mission.photo.filter(photo => photo !== imageFilename);
      mission.alt.splice(index, 1);
  
      const filePath = path.join(__dirname, '..', 'images', imageFilename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await mission.save();
  
      res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo and alt text:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
