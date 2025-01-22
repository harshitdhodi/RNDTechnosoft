const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the directories for video and photo uploads
const videoDir = path.join(__dirname, '../videos');
const photoDir = path.join(__dirname, '../images');

// Ensure the directories exist
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir);
}

if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the directory based on the field name
        let uploadDir;
        if (file.fieldname === 'video') {
            uploadDir = videoDir;
        } else if (file.fieldname === 'photo') {
            uploadDir = photoDir;
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.fieldname === 'video') {
            fileName = file.originalname;
            req.fileName = fileName; // Store the original file name in the request object
        } else if (file.fieldname === 'photo') {
            fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB for videos
    fileFilter: function (req, file, cb) {
        // Optional: Check file types here if needed
        cb(null, true);
    }
});

// Middleware function to handle single video uploads and multiple photo uploads
const uploadMedia = (req, res, next) => {
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'photo', maxCount: 5 },
    ])(req, res, function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        next();
    });
};

module.exports = { uploadMedia };
