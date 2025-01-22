const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directories for logos and temporary files
const uploadDir = path.join(__dirname, '../logos');
const tempDir = path.join(__dirname, '../temp');

// Create directories if they don't exist
[uploadDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store initially in temp directory
    cb(null, tempDir);
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

// Function to process the uploaded logo image
const processLogoImage = async (tempPath, finalPath) => {
  try {
    // Initial processing with high quality
    await sharp(tempPath)
      .webp({ quality: 100 })
      .resize({ width: 1024, withoutEnlargement: true })
      .toFile(finalPath);

    // Check if the processed file size exceeds 100KB
    let fileSize = fs.statSync(finalPath).size;
    let quality = 100;

    // If file is too large, gradually reduce quality until size is acceptable
    while (fileSize > 100 * 1024 && quality > 10) {
      await sharp(tempPath)
        .webp({ quality })
        .resize({ width: 1024, withoutEnlargement: true })
        .toFile(finalPath);

      fileSize = fs.statSync(finalPath).size;
      quality -= 10;
    }

    // Clean up temporary file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return finalPath;
  } catch (err) {
    // Clean up any files if processing fails
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    if (fs.existsSync(finalPath)) {
      fs.unlinkSync(finalPath);
    }
    console.error('Error processing logo image:', err);
    throw new Error('Error processing logo image');
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
        return next(); // No file uploaded, just move to next middleware
      }

      try {
        const tempPath = req.file.path;
        const finalPath = path.join(uploadDir, req.file.filename);

        // Process the image if file is present
        await processLogoImage(tempPath, finalPath);

        // Update req.file with the new path
        req.file.path = finalPath;
        next();
      } catch (processError) {
        console.error('Processing error:', processError);
        return res.status(500).json({
          error: 'Error processing the image'
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
