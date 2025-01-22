const express = require('express');
const router = express.Router();
const subMenuListingController = require('../controller/submenu');
const { uploadLogo } = require('../middleware/logoUpload');
const { requireAuth } = require('../middleware/authmiddleware');

// Create a new submenu listing
router.post('/createSubMenuListing', requireAuth, uploadLogo, subMenuListingController.createSubMenuListing);

// Get all submenu listings for a specific parent menu and count
router.get('/getSubMenuListings', requireAuth, subMenuListingController.getAllSubMenuListings);

// Get a single submenu listing by ID
router.get('/getSubMenuListingById', requireAuth, subMenuListingController.getSubMenuListingById);

// Update a submenu listing by ID
router.put('/updateSubMenuListing', requireAuth, uploadLogo, subMenuListingController.updateSubMenuListing);

// Delete a submenu listing by ID
router.delete('/deleteSubMenuListing', requireAuth, subMenuListingController.deleteSubMenuListing);

module.exports = router;
