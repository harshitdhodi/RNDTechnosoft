const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

// Route to download portfolio
router.get('/portfolio', portfolioController.downloadPortfolio);

module.exports = router;
