const MenuListing = require('../model/NavData');
const path = require('path');
const fs = require('fs');


exports.createMenuListing = async (req, res) => {
  try {
    const { pagename, priority } = req.body;
    await MenuListing.updateMany({ priority: { $gte: parseInt(priority) } }, { $inc: { priority: 1 } });

    const newMenuListing = new MenuListing({ pagename,priority: parseInt(priority) });
    await newMenuListing.save();

    res.status(201).json(newMenuListing);
  } catch (error) {
    
    res.status(500).send('Failed to create menu listing.');
  }
};

// Get all menu listings and count
exports.getAllMenuListings = async (req, res) => {
  try {
    const menuListings = await MenuListing.find().sort('priority');
    const count = await MenuListing.countDocuments();
    res.json({ count, menuListings });
  } catch (error) {
    res.status(500).send('Failed to fetch menu listings.');
  }
};

// Get a single menu listing by ID
exports.getMenuListingById = async (req, res) => {
  try {
    const { id } = req.query;
    const count = await MenuListing.countDocuments();
    const menuListing = await MenuListing.findById(id);
    if (!menuListing) {
      return res.status(404).send('Menu listing not found.');
    }
    res.json({ count, menuListing });
  } catch (error) {
    res.status(500).send('Failed to fetch menu listing.');
  }
};

// Update a menu listing by ID
exports.updateMenuListing = async (req, res) => {
  try {
    const { id } = req.query;
    const { pagename,priority } = req.body;
  
    const menuListing = await MenuListing.findById(id);
    if (!menuListing) {
      return res.status(404).send('Menu listing not found.');
    }

    const oldPriority = menuListing.priority;
    const validatedData = {
      pagename,
      priority: parseInt(priority),
      updatedAt: Date.now()
    };

    // Set the new data
    menuListing.set(validatedData);

    // Reorder priorities if necessary
    if (oldPriority !== validatedData.priority) {
      if (oldPriority < validatedData.priority) {
        await MenuListing.updateMany(
          { _id: { $ne: menuListing._id }, priority: { $gte: oldPriority + 1, $lte: validatedData.priority } },
          { $inc: { priority: -1 } }
        );
      } else {
        await MenuListing.updateMany(
          { _id: { $ne: menuListing._id }, priority: { $gte: validatedData.priority, $lte: oldPriority - 1 } },
          { $inc: { priority: 1 } }
        );
      }
    }

    // Save the updated document
    await menuListing.save();

    res.json({ message: 'Menu listing updated successfully.', menuListing });
  } catch (error) {
    res.status(500).send('Failed to update menu listing.');
  }
};

// Delete a menu listing by ID
exports.deleteMenuListing = async (req, res) => {
  try {
    const { id } = req.query;

    const menuListing = await MenuListing.findById(id);
    if (!menuListing) {
      return res.status(404).send('Menu listing not found.');
    }

    const deletedMenuListing = await MenuListing.findByIdAndDelete(id);
    if (!deletedMenuListing) {
      return res.status(404).send('Menu listing not found.');
    }

    await MenuListing.updateMany({ priority: { $gt: menuListing.priority } }, { $inc: { priority: -1 } });


    res.send('Menu listing deleted successfully.');
  } catch (error) {
    res.status(500).send('Failed to delete menu listing.');
  }
};
