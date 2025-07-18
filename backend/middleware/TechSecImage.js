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
    cb(null, uploadDir);
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
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
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
    // Ensure upload directory exists
    await ensureUploadDir();

    // Log incoming data for debugging
    console.log('Incoming body:', req.body);
    console.log('Incoming files:', req.files);

    // Define a reasonable number of fields to handle multiple card uploads
    const maxCards = 10; // Adjust based on your requirements
    const fields = Array.from({ length: maxCards }, (_, index) => ({
      name: `card[${index}][photo]`,
      maxCount: 10, // Allow multiple files per card if needed
    }));

    console.log('Expected fields:', fields);

    // Use upload.fields to process the file fields
    await upload.fields(fields)(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          error: err.message || 'Error uploading files',
        });
      }

      // If no files are uploaded, proceed
      if (!req.files || Object.keys(req.files).length === 0) {
        return next();
      }

      try {
        // Process each uploaded file
        for (const field in req.files) {
          const files = req.files[field];
          req.body[field] = req.body[field] || [];
          for (const file of files) {
            const filePath = file.path;
            console.log('File saved to:', filePath);
            await processLogoImage(filePath);
            req.body[field].push(file.filename);
          }
        }

        // Reconstruct card array from req.body non-file fields and files
        const cardArray = [];
        let index = 0;
        while (req.body[`card[${index}][cardInfo]`] || req.body[`card[${index}][photo]`]) {
          cardArray.push({
            cardInfo: req.body[`card[${index}][cardInfo]`] || '',
            photo: req.body[`card[${index}][photo]`] || [],
            altImg: req.body[`card[${index}][altImg]`] || '',
            imgTitle: req.body[`card[${index}][imgTitle]`] || '',
          });
          index++;
        }
        req.body.card = cardArray;

        next();
      } catch (processError) {
        console.error('Processing error:', processError);
        return res.status(500).json({
          error: 'Error processing the images',
          details: processError.message,
        });
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      error: 'Server error during upload',
    });
  }
};

module.exports = { TechSecImage: uploadLogo, uploadDir };