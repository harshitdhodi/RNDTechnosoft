const Banner = require('../model/banner');
const path=require('path')
const fs=require('fs')


const insertBanner = async (req, res) => {
  try {
    const { section, title, details, alt,imgtitle, status, priority } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];

    // Increment priorities for existing banners in the same section with higher or equal priority
    await Banner.updateMany({ section, priority: { $gte: parseInt(priority) } }, { $inc: { priority: 1 } });

    const newBanner = new Banner({
      section,
      title,
      photo,
      alt,
      imgtitle,
      details,
      status,
      priority: parseInt(priority) // Ensure priority is parsed as an integer
    });

    await newBanner.save();

    res.status(200).json({
      data: newBanner,
      message: "Your data inserted successfully",
    });
  } catch (err) {
    console.error("Error inserting banner:", err);
    res.status(400).send(err);
  }
};

const getCountBySection = async (req, res) => {
  try {
    const { section } = req.query;
    const count = await Banner.countDocuments({ section });
    res.json(count);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBanner = async (req, res) => {
    try {

        const {page = 1} = req.query;
        const limit = 5;
        const count = await Banner.countDocuments(); 
        const banners = await Banner.find()
        .skip((page - 1) * limit) // Skip records for previous pages
        .limit(limit);
        res.status(200).json({
            data: banners,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
            message: "Banners fetched successfully",
        });
    } catch (err) {
        console.error("Error fetching banners:", err);
        res.status(400).send(err);
    }
};
const getBannerfront = async (req, res) => {
  try {
      const { section } = req.query; // Get the section from query parameters

      // If section is provided, filter by section, otherwise get all banners
      const query = section ? { section: section } : {};

      const banners = await Banner.find(query);
      const count = banners.length;

      res.status(200).json({
          data: banners,
          total: count,
          message: "Banners fetched successfully",
      });
  } catch (err) {
      console.error("Error fetching banners:", err);
      res.status(400).json({ error: err.message });
  }
};

// Handle PUT request to update a banner
const updateBanner = async (req, res) => {
  const { id } = req.query;
  const { section, title, details, status, priority,alt,imgtitle } = req.body;


  try {
    let banner = await Banner.findOne({ _id: id, section });

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const oldPriority = banner.priority;

    banner.section = section;
    banner.title = title;
    banner.details = details;
    banner.status = status;
    banner.priority = parseInt(priority);
  

    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename);
      banner.photo = [...banner.photo, ...newPhotoPaths];
    }

    // Process new alt texts
    if (req.body.alt && req.body.alt.length > 0) {
      const newAltTexts = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];
      banner.alt = [...banner.alt, ...newAltTexts];
    }
       // Process new imgtitle texts
       if (req.body.imgtitle && req.body.imgtitle.length > 0) {
        const newimgtitleTexts = Array.isArray(req.body.imgtitle) ? req.body.imgtitle : [req.body.imgtitle];
        banner.imgtitle = [...banner.imgtitle, ...newimgtitleTexts];
      }

    // Adjust priorities if priority has changed
    if (oldPriority !== parseInt(priority)) {
      if (oldPriority < parseInt(priority)) {
        await Banner.updateMany(
          { section, _id: { $ne: banner._id }, priority: { $gte: oldPriority + 1, $lte: parseInt(priority) } },
          { $inc: { priority: -1 } }
        );
      } else {
        await Banner.updateMany(
          { section, _id: { $ne: banner._id }, priority: { $gte: parseInt(priority), $lte: oldPriority - 1 } },
          { $inc: { priority: 1 } }
        );
      }
    }

    banner = await banner.save();

    res.status(200).json({ message: 'Banner updated successfully', data: banner });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const countBanner = async (req, res) => {
  try {
    const count = await Banner.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};




const deleteBanner = async (req, res) => {
  try {
    const { id } = req.query;

    // Find the banner by ID
    const bannerToDelete = await Banner.findById(id);

    if (!bannerToDelete) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Retrieve section and priority for later use
    const { section, priority } = bannerToDelete;

    // Delete associated photos from disk
    await Promise.all(
      bannerToDelete.photo.map(async (filename) => {
        const filePath = path.join(__dirname, '../images', filename); // Adjust the path as per your file structure
        try {
          await fs.unlink(filePath); // Delete the file asynchronously
        } catch (error) {
          console.warn(`Failed to delete file: ${filename}`, error);
        }
      })
    );

    // Delete the banner from database
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // Adjust priorities for banners in the same section
    await Banner.updateMany(
      { section, priority: { $gt: priority } },
      { $inc: { priority: -1 } }
    );

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner' });
  }
};


  const getBannerById = async (req, res) => {
    try {
      const { id } = req.query;
  
      const banner = await Banner.findById(id);
     
      if (!banner) {
        return res.status(404).json({ message: 'Banner not found' });
      }
      res.status(200).json({ data: banner });
    } catch (error) {
   
      res.status(500).json({ message: "Server error" });
    }
  }

 
  
  const deletePhotoAndAltText = async (req, res) => {

    const { id, imageFilename, index } = req.params;
  
  
    try {
     
      const banner = await Banner.findById(id);
  
      if (!banner) {
        return res.status(404).json({ message: 'Service not found' });
      }

      banner.photo = banner.photo.filter(photo => photo !== imageFilename);
      banner.alt.splice(index, 1);
      banner.imgtitle.splice(index, 1);
      await banner.save();

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

  

module.exports = { getBannerfront,insertBanner, getBanner ,getCountBySection,updateBanner , deleteBanner , getBannerById,deletePhotoAndAltText,countBanner };
