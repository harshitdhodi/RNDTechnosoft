const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

router.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../images', filename);

    try {
        // Check if file exists before attempting to download
        await fs.access(filePath);
        
        res.download(filePath, (err) => {
            if (err && !res.headersSent) {
                console.error('Download error:', err);
                res.status(500).json({ message: 'File download failed' });
            }
        });
    } catch (error) {
        if (!res.headersSent) {
            console.error('File access error:', error);
            res.status(404).json({ message: 'File not found' });
        }
    }
});

module.exports = router;