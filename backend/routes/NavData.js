const express = require('express');
const router = express.Router();
const menuListingController = require('../controller/NavData');
const {uploadLogo}=require("../middleware/logoUpload")
const {requireAuth}=require("../middleware/authmiddleware")
// Create a new menu listing
router.post('/createMenulisting',requireAuth,uploadLogo, menuListingController.createMenuListing);

// Get all menu listings and count
router.get('/getMenulisting', menuListingController.getAllMenuListings);

// Get a single menu listing by ID
router.get('/getMenulistingById',requireAuth, menuListingController.getMenuListingById);

// Update a menu listing by ID
router.put('/updateMenulisting',requireAuth,uploadLogo, menuListingController.updateMenuListing);

// Delete a menu listing by ID
router.delete('/deleteMenulisting',requireAuth, menuListingController.deleteMenuListing);

module.exports = router;
