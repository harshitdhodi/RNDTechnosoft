// Add this new route for cache management
const express = require('express');
const router = express.Router();

// Route to clear all cache
router.get('/clear-cache', (req, res) => {
    cache.flushAll(); // Clears all cached keys
    res.json({ success: true, message: 'Cache cleared successfully.' });
  });
  
// Route to clear specific cache by key pattern
router.delete('/clear/:pattern', (req, res) => {
    try {
        const pattern = req.params.pattern;
        const keys = apiCache.keys();
        const matchingKeys = keys.filter(key => key.includes(pattern));
        
        if (matchingKeys.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No cache entries found matching pattern: ${pattern}`
            });
        }
        
        matchingKeys.forEach(key => apiCache.del(key));
        
        res.status(200).json({
            success: true,
            message: `Cache cleared successfully. ${matchingKeys.length} cache entries removed.`,
            removedKeys: matchingKeys
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear cache',
            error: error.message
        });
    }
});

// Get cache stats
router.get('/stats', (req, res) => {
    try {
        const stats = apiCache.getStats();
        const keys = apiCache.keys();
        
        res.status(200).json({
            success: true,
            stats: {
                ...stats,
                totalKeys: keys.length,
                keysList: keys
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get cache stats',
            error: error.message
        });
    }
});

module.exports = router;