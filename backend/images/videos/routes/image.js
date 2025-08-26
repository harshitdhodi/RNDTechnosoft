const express = require('express');
const router = express.Router();
const path = require('path')
const { requireAuth } = require('../middleware/authmiddleware');


router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../images', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
});




module.exports = router;