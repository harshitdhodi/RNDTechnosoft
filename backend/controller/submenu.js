const SubMenuListing = require('../model/submenu');
const MenuListing = require('../model/menulisting');
const path = require('path');
const fs = require('fs');

// Create a new submenu listing
exports.createSubMenuListing = async (req, res) => {
  try {
    const { pagename, alt,imgtitle, priority, details, parent } = req.body;
    const photo = req.file.filename;
    console.log(pagename, alt,imgtitle, priority, details, parent )
    // Increment priorities for existing submenu items with equal or greater priority
    await SubMenuListing.updateMany({ priority: { $gte: parseInt(priority) }, parent }, { $inc: { priority: 1 } });

    const newSubMenuListing = new SubMenuListing({
      pagename,
      photo,
      alt,
      imgtitle,
      priority: parseInt(priority),
      details,
      parent,
    });
    await newSubMenuListing.save();

    res.status(201).json(newSubMenuListing);
  } catch (error) {
    res.status(500).send('Failed to create submenu listing.');
  }
};

// Get all submenu listings and count
exports.getAllSubMenuListings = async (req, res) => {
  try {
    
    const submenuListings = await SubMenuListing.find().sort('priority');
    const count = await SubMenuListing.countDocuments();

    res.json({ count, submenuListings });
  } catch (error) {
    res.status(500).send('Failed to fetch submenu listings.');
  }
};

// Get a single submenu listing by ID
exports.getSubMenuListingById = async (req, res) => {
  try {
    const { id } = req.query;
    const count = await SubMenuListing.countDocuments();

    const submenuListing = await SubMenuListing.findById(id);
    if (!submenuListing) {
      return res.status(404).send('Submenu listing not found.');
    }

    res.json({count,submenuListing});
  } catch (error) {
    res.status(500).send('Failed to fetch submenu listing.');
  }
};

// Update a submenu listing by ID
exports.updateSubMenuListing = async (req, res) => {
  try {
    const { id } = req.query;
    const { pagename, alt, imgtitle, priority, details, parent } = req.body;
    let photo = req.body.photo;

    if (req.file) {
      photo = req.file.filename; // Use the uploaded file's filename for the photo
    }

    const submenuListing = await SubMenuListing.findById(id);
    if (!submenuListing) {
      return res.status(404).send('Submenu listing not found.');
    }

    const oldPriority = submenuListing.priority;

    // Only update the fields if new data is provided, otherwise keep the old values
    const validatedData = {
      pagename: pagename !== undefined ? pagename : submenuListing.pagename,
      photo: photo !== undefined ? photo : submenuListing.photo,
      alt: alt !== undefined ? alt : submenuListing.alt,
      imgtitle: imgtitle !== undefined ? imgtitle : submenuListing.imgtitle,
      priority: priority !== undefined ? parseInt(priority) : submenuListing.priority,
      details: details !== undefined ? details : submenuListing.details,
      parent: parent !== undefined ? parent : submenuListing.parent,
      updatedAt: Date.now(),
    };

    // Set the new data
    submenuListing.set(validatedData);

    // Reorder priorities if necessary
    if (oldPriority !== validatedData.priority) {
      if (oldPriority < validatedData.priority) {
        await SubMenuListing.updateMany(
          { _id: { $ne: submenuListing._id }, priority: { $gte: oldPriority + 1, $lte: validatedData.priority }, parent },
          { $inc: { priority: -1 } }
        );
      } else {
        await SubMenuListing.updateMany(
          { _id: { $ne: submenuListing._id }, priority: { $gte: validatedData.priority, $lte: oldPriority - 1 }, parent },
          { $inc: { priority: 1 } }
        );
      }
    }

    // Save the updated document
    await submenuListing.save();

    res.json({ message: 'Submenu listing updated successfully.', submenuListing });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to update submenu listing.');
  }
};


// Delete a submenu listing by ID
exports.deleteSubMenuListing = async (req, res) => {
  try {
    const { id } = req.query;

    const submenuListing = await SubMenuListing.findById(id);
    if (!submenuListing) {
      return res.status(404).send('Submenu listing not found.');
    }

    const filePath = path.join(__dirname, '../logos', submenuListing.photo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found: ${submenuListing.photo}`);
    }

    const deletedSubMenuListing = await SubMenuListing.findByIdAndDelete(id);
    if (!deletedSubMenuListing) {
      return res.status(404).send('Submenu listing not found.');
    }

    // Reorder the remaining submenu items
    await SubMenuListing.updateMany({ priority: { $gt: submenuListing.priority }, parent: submenuListing.parent }, { $inc: { priority: -1 } });

    res.send('Submenu listing deleted successfully.');
  } catch (error) {
    res.status(500).send('Failed to delete submenu listing.');
  }
};
