const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define directories for different types of uploads
const photoDir = path.join(__dirname, '../images');
const videoDir = path.join(__dirname, '../images');
const authPhotoDir = path.join(__dirname, '../images');
const iconPhotoDir = path.join(__dirname, '../images');

// Ensure the directories exist
[photoDir, videoDir, authPhotoDir, iconPhotoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;
    switch (file.fieldname.split('[')[0]) { // Handle iconPhoto[0], iconPhoto[1], etc.
      case 'photo':
        uploadDir = photoDir;
        break;
      case 'video':
        uploadDir = videoDir;
        break;
      case 'authPhoto':
        uploadDir = authPhotoDir;
        break;
      case 'iconPhoto':
        uploadDir = iconPhotoDir;
        break;
      default:
        uploadDir = photoDir; // Default fallback
        break;
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname.split('[')[0] + '-' + uniqueSuffix); // Handle iconPhoto[0], iconPhoto[1], etc.
  }
});

// Create Multer instance with storage configuration and file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = {
      photo: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4'],
      authPhoto: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      iconPhoto: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    };

    if (allowedTypes[file.fieldname.split('[')[0]] && allowedTypes[file.fieldname.split('[')[0]].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Middleware function to handle file uploads
const uploadImg = (req, res, next) => {
  upload.any()(req, res, function (err) {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    next();
  });
};

module.exports = { uploadImg };