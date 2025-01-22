const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directories for image uploads and temporary files
const uploadDir = path.join(__dirname, '../images');
const tempDir = path.join(__dirname, '../temp');

// Create necessary directories if they don't exist
[uploadDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Initially save to temp directory
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Always use .webp extension since we'll be converting
    const fileName = `${file.fieldname}_${Date.now()}.webp`;
    cb(null, fileName);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    // Optional: Add file type checking
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Function to process and convert the photo into .webp format
const processImage = async (tempPath, finalPath) => {
  try {
    // Initial conversion with high quality
    await sharp(tempPath)
      .webp({ quality: 100 })
      .resize({ width: 1024, withoutEnlargement: true })
      .toFile(finalPath);

    // Check file size and reduce quality if needed
    let fileSize = fs.statSync(finalPath).size;
    let quality = 80;

    // Gradually reduce quality if file is too large
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
    console.error('Error processing image:', err);
    throw new Error('Error processing image');
  }
};

// Middleware to handle the file upload and process the image
const uploadSub = async (req, res, next) => {
  try {
    await upload.single('photo')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message || 'Error uploading file'
        });
      }

      if (!req.file) {
        // No file uploaded, continue to next middleware
        return next();
      }

      try {
        const tempPath = req.file.path;
        const finalPath = path.join(uploadDir, req.file.filename);

        // Process the image and move it to final location
        await processImage(tempPath, finalPath);

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

// Export the middleware
module.exports = { uploadSub };