const express = require('express');
const router = express.Router();
const aboutUsPointsController = require('../controller/aboutuspoints');
const { requireAuth } = require('../middleware/authmiddleware');


// Create a new AboutUsPoint
router.post('/insertPoints',requireAuth, aboutUsPointsController.createAboutUsPoint);

// Get all AboutUsPoints
router.get('/getPoints',requireAuth, aboutUsPointsController.getAllAboutUsPoints);

// Get a single AboutUsPoint by ID
router.get('/getPointsbyId', requireAuth,aboutUsPointsController.getAboutUsPointById);

// Update an AboutUsPoint by ID
router.put('/updatePoints',requireAuth, aboutUsPointsController.updateAboutUsPoint);

// Delete an AboutUsPoint by ID
router.delete('/deletePoints',requireAuth, aboutUsPointsController.deleteAboutUsPoint);

module.exports = router;
