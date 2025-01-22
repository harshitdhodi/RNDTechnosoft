const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the directories for catalogue, photo, and resume uploads
const catalogueDir = path.join(__dirname, '../catalogues');
const photoDir = path.join(__dirname, '../images');
const resumeDir = path.join(__dirname, '../resumes'); // New directory for resumes

// Ensure the directories exist
if (!fs.existsSync(catalogueDir)) {
    fs.mkdirSync(catalogueDir);
}

if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir);
}

if (!fs.existsSync(resumeDir)) { // Ensure the resumes directory exists
    fs.mkdirSync(resumeDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Determine the directory based on the field name
        let uploadDir;
        if (file.fieldname === 'catalogue') {
            uploadDir = catalogueDir;
        } else if (file.fieldname === 'photo') {
            uploadDir = photoDir;
        } else if (file.fieldname === 'resume') { // Handle resume uploads
            uploadDir = resumeDir;
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.fieldname === 'catalogue') {
            fileName = file.originalname;
            req.fileName = fileName; // Store the original file name in the request object
        } else if (file.fieldname === 'photo') {
            fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        } else if (file.fieldname === 'resume') { // Generate a unique name for resume
            fileName = `resume_${Date.now()}${path.extname(file.originalname)}`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Optional: Check file types here if needed
        cb(null, true);
    }
});

// Middleware function to handle single catalogue uploads, multiple photo uploads, and a single resume upload
const uploadPhoto = (req, res, next) => {
    upload.fields([
        { name: 'catalogue', maxCount: 1 },
        { name: 'photo', maxCount: 5 },
        { name: 'resume', maxCount: 1 } // Add resume field with maxCount of 1
    ])(req, res, function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        next();
    });
};

module.exports = { uploadPhoto };
