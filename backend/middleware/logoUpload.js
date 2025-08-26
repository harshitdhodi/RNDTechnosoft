const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directory for logos
const uploadDir = path.join(__dirname, '../logos');

// Create logos directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store directly in logos directory
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.fieldname}_${Date.now()}.webp`; // Always use .webp extension
    cb(null, fileName);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Process the image in place to ensure WebP format
const processLogoImage = async (filePath) => {
  try {
    // If the file is already a .webp, skip processing
    if (path.extname(filePath).toLowerCase() === '.webp') {
      return;
    }
    // Otherwise, convert to WebP
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(filePath + '.temp');
    await fs.promises.rename(filePath + '.temp', filePath);
  } catch (err) {
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Middleware to handle the logo file upload and process the image
const uploadLogo = async (req, res, next) => {
  try {
    await upload.single('photo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message || 'Error uploading file'
        });
      }

      // If no file is uploaded, proceed without photo processing
      if (!req.file) {
        return next();
      }

      try {
        const filePath = req.file.path;
        console.log('File saved to:', filePath);

        // Process the image to ensure it's in WebP format
        await processLogoImage(filePath);

        next();
      } catch (processError) {
        console.error('Processing error:', processError);
        return res.status(500).json({
          error: 'Error processing the image',
          details: processError.message
        });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: 'Server error during upload'
    });
  }
};

module.exports = { uploadLogo };