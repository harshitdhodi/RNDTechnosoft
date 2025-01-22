

const fs = require('fs');
const path = require('path');

// Specify the directory path
const uploadDir = path.join(__dirname, '../images');

// Check if the directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const multer = require('multer');


// Define storage for uploaded photos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save uploaded photos in the 'images' directory
    },
    filename: function (req, file, cb) {
        const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});


// Initialize multer with defined storage options and explicit boundary
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Check file types here if needed
        cb(null, true);
    },
    // Set the explicit boundary string
});

// Middleware function to handle file uploads for shop photos
const uploadSub = upload.single('photo'); // Accepts up to 5 photos, change as needed


module.exports = { uploadSub };
