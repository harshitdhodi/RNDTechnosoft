const express = require('express');
const router = express.Router();
const path = require('path');
const { requireAuth } = require('../middleware/authmiddleware');

// Route for downloading video files
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const videoPath = path.join(__dirname, '../videos', filename);

    res.download(videoPath, (err) => {
        if (err) {
            console.error(err);

            // Check if the headers have already been sent
            if (!res.headersSent) {
                res.status(500).json({ message: 'Video download failed' });
            } else {
                // If headers are already sent, just end the response
                res.end();
            }
        }
    });
});

module.exports = router;
