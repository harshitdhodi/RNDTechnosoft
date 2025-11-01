const express = require('express');
const router = express.Router();
const homepage = require('../controller/homepage');

// Create a new HomeHero
// router.post('/', homeHeroController.createHomeHero); // Uncommented the create route

// Get all HomeHeroes
router.get('/marquee', homepage.getAll);
router.get("/ourwork",homepage.getwork)

router.get("/getImage/:slug",homepage.getImage)


module.exports = router;
