const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

// Specify the directory for uploads
const uploadDir = path.join(__dirname, '../logos');

// Create uploads directory if it doesn't exist
const ensureUploadDir = async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    throw new Error(`Failed to create upload directory: ${err.message}`);
  }
};

// Define storage for uploaded photos
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// Initialize multer with defined storage options and file size limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Process the image to WebP format
const processImageToWebP = async (filePath) => {
  try {
    const webpPath = filePath.replace(/\.[^/.]+$/, '.webp');
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    await fs.unlink(filePath); // Remove original file
    return path.basename(webpPath);
  } catch (err) {
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Middleware to handle multiple photo uploads and process images
const uploadPhotos = async (req, res, next) => {
  try {
    // Use multer to handle multiple file uploads
    await upload.array('photos[]')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message || 'Error uploading files' });
      }

      if (!req.files || req.files.length === 0) {
        return next(); // Proceed if no files uploaded (for updates)
      }

      try {
        // Process each uploaded file to WebP
        const processedFiles = await Promise.all(
          req.files.map(async (file) => {
            const newFilename = await processImageToWebP(file.path);
            return { ...file, filename: newFilename, path: path.join(uploadDir, newFilename) };
          })
        );

        // Group files by card (assuming files are uploaded in order matching cards)
        const cards = JSON.parse(req.body.cards || '[]');
        let fileIndex = 0;
        req.files = cards.map((_, cardIndex) => {
          // Estimate number of files per card (even distribution or based on form logic)
          const filesForCard = processedFiles.slice(fileIndex, fileIndex + cards[cardIndex].photo.length);
          fileIndex += cards[cardIndex].photo.length;
          return filesForCard;
        });

        next();
      } catch (processError) {
        console.error('Processing error:', processError);
        return res.status(500).json({
          error: 'Error processing images',
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

module.exports = { uploadPhotos };