
const Corevalue = require('../model/corevalue');
const path=require('path')
const fs=require('fs')

exports.getAllCorevalue = async (req, res) => {
    try {
        const corevalue = await Corevalue.find();
        res.status(200).json({ data:corevalue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCoreValue = async (req, res) => {
  const { title, description,alt,imgtitle,status } = req.body;
  const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
  try {
    const newCorevalue = new Corevalue({
      title,
      description,
      photo,
      alt,
      imgtitle,
      status
    });

    const savedCorevalue = await newCorevalue.save();
    res.status(201).json(savedCorevalue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCorevalue = async (req, res) => {
    const {id}=req.query
    const updateFields = req.body;
 
    try {
      // Fetch the existing service to get its current photos and alt texts
      const existingCorevalue = await Corevalue.findById(id);
  
      if (!existingCorevalue) {
        return res.status(404).json({ message: 'Corevalue not found' });
      }
  
      // Process new uploaded photos and their alt texts
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
        updateFields.photo = [...existingCorevalue.photo, ...newPhotoPaths];
    
      } else {
        updateFields.photo = existingCorevalue.photo; 
      }
  
      const updatedCorevalue = await Corevalue.findByIdAndUpdate(id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedCorevalue);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.deletePhotoAndAltText = async (req, res) => {

    const { imageFilename, index } = req.params;
  
    try {
      // Find the service by ID
      const corevalue = await Corevalue.findOne();
  
      if (!corevalue) {
        return res.status(404).json({ message: 'corevalue not found' });
      }
  
      // Remove the photo and its alt text
      corevalue.photo = corevalue.photo.filter(photo => photo !== imageFilename);
      corevalue.alt.splice(index, 1);
      corevalue.imgtitle.splice(index,1);
  
      const filePath = path.join(__dirname, '..', 'images', imageFilename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await corevalue.save();
  
      res.json({ message: 'Photo and alt text deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo and alt text:', error);
      res.status(500).json({ message: error.message });
    }
  };

  exports.deleteCoreValue = async (req, res) => {
    const { id } = req.query;
  
    try {
      const corevalue = await Corevalue.findById(id);

      corevalue.photo.forEach(filename => {
        const filePath = path.join(__dirname, '../images', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); 
        } else {
          console.warn(`File not found: ${filename}`);
        }
      });
      const deletedCorevalue = await Corevalue.findByIdAndDelete(id);
  
      if (!deletedCorevalue) {
        return res.status(404).json({ message: 'Corevalue not found' });
      }
  
      res.status(200).json({ message: 'Corevalue deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.getCorevalueById = async (req, res) => {
    const { id } = req.query;
  
    try {
      const corevalue = await Corevalue.findById(id);
  
      if (!corevalue) {
        return res.status(404).json({ message: 'Corevalue not found' });
      }
  
      res.status(200).json(corevalue);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
