const express = require('express');
const router = express.Router();
const MinItemCount = require('../models/MinItemCount');

// Get all minimum item counts
router.get('/', async (req, res) => {
  try {
    // Default values if no record exists
    const defaultCounts = {
      highlightedTexts: 1,
      labels: 1,
      smallCircles: 3
    };

    // Try to find existing counts
    let counts = await MinItemCount.findOne();
    
    if (!counts) {
      // Create default counts if none exist
      counts = await MinItemCount.create(defaultCounts);
    }

    res.status(200).json({
      status: 'success',
      data: counts
    });
  } catch (error) {
    console.error('Error fetching min item counts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch minimum item counts'
    });
  }
});

// Update minimum item counts
router.put('/', async (req, res) => {
  try {
    const { highlightedTexts, labels, smallCircles } = req.body;
    
    // Validate input
    const counts = {
      highlightedTexts: Math.max(0, parseInt(highlightedTexts) || 0),
      labels: Math.max(0, parseInt(labels) || 0),
      smallCircles: Math.max(0, parseInt(smallCircles) || 0)
    };

    // Update or create the counts
    const updatedCounts = await MinItemCount.findOneAndUpdate(
      {},
      counts,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      status: 'success',
      data: updatedCounts
    });
  } catch (error) {
    console.error('Error updating min item counts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update minimum item counts'
    });
  }
});

module.exports = router;
