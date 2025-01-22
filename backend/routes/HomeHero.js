const express = require('express');
const router = express.Router();
const homeHeroController = require('../controller/homeHero');

// Create a new HomeHero
// router.post('/', homeHeroController.createHomeHero); // Uncommented the create route

// Get all HomeHeroes
router.get('/', homeHeroController.getAllHomeHeros);

// Update a HomeHero by ID
router.put('/:id', homeHeroController.updateHomeHero); // Updated to match the new controller


// Delete a label from a HomeHero
router.delete('/label/:id', homeHeroController.deleteLabel); // Changed to match the new controller



// Delete a small circle from a HomeHero
router.delete('/smallCircle/:id', homeHeroController.deleteSmallCircle); // Changed to match the new controller

// Delete highlighted text from a HomeHero
router.delete('/highlightedText/:id', homeHeroController.deleteHighlightedText); // New route for deleting highlighted text
router.get('/leftphoto', homeHeroController.getLeftStaff);
router.get('/rightphoto', homeHeroController.getRightStaff);



module.exports = router;
