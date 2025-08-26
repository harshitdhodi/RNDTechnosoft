const MenuListing = require('../model/menulisting');
const path = require('path');
const fs = require('fs');
const SubMenuListing = require('../model/submenu'); // Update with the correct path to your model


exports.createMenuListing = async (req, res) => {
  try {
    const { pagename, alt,imgtitle, priority } = req.body;
    const photo = req.file.filename;
    await MenuListing.updateMany({ priority: { $gte: parseInt(priority) } }, { $inc: { priority: 1 } });

    const newMenuListing = new MenuListing({ pagename, photo, alt,imgtitle, priority: parseInt(priority) });
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
    const { pagename, alt,imgtitle, priority } = req.body;
    console.log(imgtitle)
    let photo = req.body.photo;

    if (req.file) {
      photo = req.file.filename;
    }

    const menuListing = await MenuListing.findById(id);
    if (!menuListing) {
      return res.status(404).send('Menu listing not found.');
    }

    const oldPriority = menuListing.priority;
    const validatedData = {
      pagename,
      photo,
      alt,
      imgtitle,
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

    const filePath = path.join(__dirname, '../logos', menuListing.photo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn(`File not found: ${menuListing.photo}`);
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


exports.fetchMenuWithSubmenus = async (req,res) => {
  try {
    // Fetch all menu listings
    const menuListings = await MenuListing.find().exec();

    // Fetch all submenus and group them by parent menu ID
    const submenus = await SubMenuListing.find().exec();
    const submenusByParent = submenus.reduce((acc, submenu) => {
      if (!acc[submenu.parent]) {
        acc[submenu.parent] = [];
      }
      acc[submenu.parent].push(submenu);
      return acc;
    }, {});

    // Attach submenus to their respective parent menus
    const result = menuListings.map(menu => {
      return {
        ...menu.toObject(), // Convert to plain JavaScript object
        submenus: submenusByParent[menu._id] || [] // Add submenus if they exist
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('Error fetching menu listings with submenus:', error);
    throw new Error('Unable to fetch menu listings with submenus');
  }
};
