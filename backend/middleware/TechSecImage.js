const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directory for logos
const uploadDir = path.join(__dirname, '../logos');

// Create logos directory if it doesn't exist
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir); // Check if directory exists
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    } else {
      throw error; // Rethrow other errors
    }
  }
}

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../logos')); // adjust this to your preferred directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}.webp`);
  },
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    console.log(req.file)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Process the image to ensure WebP format
const processLogoImage = async (filePath) => {
  try {
    // If the file is already a .webp, skip processing
    if (path.extname(filePath).toLowerCase() === '.webp') {
      return;
    }
    // Convert to WebP
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(filePath + '.temp');
    await fs.rename(filePath + '.temp', filePath);
  } catch (err) {
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Middleware to handle multiple logo file uploads under card[${index}][photo]
const uploadLogo = async (req, res, next) => {
  try {
    // Ensure upload directory exists before processing
    await ensureUploadDir();

    // Define dynamic fields for card[${index}][photo]
    const fields = [];
    // Check both req.body and req.files for potential field names
    const potentialKeys = [
      ...(req.body ? Object.keys(req.body) : []),
      ...(req.files ? Object.keys(req.files) : [])
    ];
    potentialKeys.forEach((key) => {
      if (key.match(/^card\[\d+\]\[photo\]$/)) {
        fields.push({ name: key, maxCount: 1 });
      }
    });

    // If no matching fields are found, allow at least card[0][photo]
    if (fields.length === 0) {
      fields.push({ name: 'card[0][photo]', maxCount: 1 });
    }

    await upload.fields(fields)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          error: err.message || 'Error uploading files'
        });
      }

      // If no files are uploaded, proceed without photo processing
      if (!req.files || Object.keys(req.files).length === 0) {
        return next();
      }

      try {
        // Process each uploaded file to ensure WebP format
        for (const field in req.files) {
          const file = req.files[field][0];
          const filePath = file.path;
          console.log('File saved to:', filePath);
          await processLogoImage(filePath);
          // Update req.body to store the filename instead of the file object
          req.body[field] = file.filename;
        }

        next();
      } catch (processError) {
        console.error('Processing error:', processError);
        return res.status(500).json({
          error: 'Error processing the images',
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

module.exports = { TechSecImage: uploadLogo, uploadDir };