const PageContent = require('../model/pageContent');
const path=require('path')
const fs=require('fs')

// Create a new page content
exports.createPageContent = async (req, res) => {
  try {
    const { title, heading, detail, alt, status } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];


    // Check if the title already exists
    const existingPageContent = await PageContent.findOne({ title });
    if (existingPageContent) {
      return res.status(400).json({ message: 'Title is already available, please choose another title' });
    }

    if (!title || !heading || !detail || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const pageContent = new PageContent({
      title,
      alt,
      heading,
      detail,
      photo,
      status
    });

    await pageContent.save();
    res.status(201).json({ pageContent, message: "Page content created successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(400).json({ message: error.message });
  }
};

// Get all page contents
exports.getAllPageContents = async (req, res) => {
  try {
    const pageContents = await PageContent.find();
    res.status(200).json(pageContents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific page content by ID
exports.getPageContentById = async (req, res) => {
  try {
    const { id } = req.query;
    const pageContent = await PageContent.findById(id);
    if (!pageContent) {
      return res.status(404).json({ message: 'Page content not found' });
    }
    res.status(200).json(pageContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific page content by ID
exports.updatePageContent = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing page content to get its current photos
    const existingPageContent = await PageContent.findById(id);

    if (!existingPageContent) {
      return res.status(404).json({ message: 'Page content not found' });
    }

    // Check if the new title is already taken by another page content
    if (updateFields.title) {
      const titleExists = await PageContent.findOne({ title: updateFields.title, _id: { $ne: id } });
      if (titleExists) {
        return res.status(400).json({ message: 'Title is already available, please choose another title' });
      }
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingPageContent.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingPageContent.photo; // Keep existing photos if no new photos are uploaded
    }

    const updatedPageContent = await PageContent.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPageContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a specific page content by ID
exports.deletePageContentById = async (req, res) => {
  try {
    const { id } = req.query;
    
    const pageContent = await PageContent.findById(id); 
    
    pageContent.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); 
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });
   
    const deletedPageContent = await PageContent.findByIdAndDelete(id);
    if (!deletedPageContent) {
      return res.status(404).json({ message: 'Page content not found' });
    }
    res.status(200).json({ message: 'Page content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePhotoAndAltText = async (req, res) => {
  
  const { id, imageFilename, index } = req.params;
 

  try {
    // Find the service by ID
    const pageContent = await PageContent.findById(id);

    if (!pageContent) {
      return res.status(404).json({ message: 'pageContent not found' });
    }

    // Remove the photo and its alt text
    pageContent.photo = pageContent.photo.filter(photo => photo !== imageFilename);
    pageContent.alt.splice(index, 1);

    await pageContent.save();

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
};;

