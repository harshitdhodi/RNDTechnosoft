const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const AppError = require('../utils/appError');

<<<<<<< HEAD
// Define the upload directory
=======
// Define the upload directory (keeping the existing path)
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
const uploadDir = path.join(__dirname, '../logos');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(uploadDir, { recursive: true });
    } else {
      throw error;
    }
  }
}

// Configure storage for uploaded images
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `img-${uniqueSuffix}${ext}`;
    
    // Store the filename in the request object for later use
    if (!req.uploadedFiles) req.uploadedFiles = {};
    if (!req.uploadedFiles.images) req.uploadedFiles.images = [];
    req.uploadedFiles.images.push(filename);
    
    cb(null, filename);
  }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, PNG, WebP, GIF) are allowed', 400), false);
  }
};

// Configure Multer with storage, file filter, and size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files
  }
});

// Middleware to handle dynamic field names for card photos
<<<<<<< HEAD
const handleCardImages = (req, res, next) => {
  // Log incoming request body and files for debugging
  console.log('Incoming request body:', req.body);
  console.log('Incoming request files:', req.files);
  console.log('Incoming field names:', Object.keys(req.files || {}));

=======
// In TechSecImage.js, update the handleCardImages function:
const handleCardImages = (req, res, next) => {
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  // Create a dynamic fields array based on the expected card fields
  const fields = [];
  for (let i = 0; i < 10; i++) { // Support up to 10 cards
    fields.push({ name: `card[${i}].photo`, maxCount: 1 });
<<<<<<< HEAD
    // Also support bracket notation for compatibility
    fields.push({ name: `card[${i}][photo]`, maxCount: 1 });
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
  }
  
  // Use fields() to handle multiple files
  upload.fields(fields)(req, res, function(err) {
    if (err) {
<<<<<<< HEAD
      console.error('Multer error:', err);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File too large. Maximum size is 10MB per file', 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new AppError('Too many files uploaded. Maximum is 10 files', 400));
      }
      if (err.message.includes('Unexpected field')) {
<<<<<<< HEAD
        return next(new AppError(`Invalid field name in file upload. Expected card[N].photo or card[N][photo]`, 400));
      }
      return next(err);
    }
    // Normalize file field names in req.files to use dot notation
    if (req.files) {
      const normalizedFiles = {};
      for (const fieldName in req.files) {
        const normalizedFieldName = fieldName.replace(/\[([^\]]*)\]/g, '.$1');
        normalizedFiles[normalizedFieldName] = req.files[fieldName];
      }
      req.files = normalizedFiles;
      console.log('Normalized req.files:', req.files);
    }
=======
        return next(new AppError('Invalid field name in file upload', 400));
      }
      return next(err);
    }
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
    next();
  });
};

// Middleware to process uploaded images (resize, optimize, etc.)
const processImages = async (req, res, next) => {
  if (!req.files) return next();
  
  try {
    const processedFiles = [];
    
    // Process each uploaded file
    for (const fieldName in req.files) {
      const fileArray = req.files[fieldName];
      for (const file of fileArray) {
        const filePath = path.join(uploadDir, file.filename);
        
        try {
          // Process image with sharp (resize, convert to webp, etc.)
          await sharp(filePath)
            .resize(800, 600, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toFormat('webp', { quality: 80 })
            .toFile(`${filePath}.webp`);
          
          // Remove original file after processing
          await fs.unlink(filePath);
          
          // Update filename to use webp version
          file.filename = `${file.filename}.webp`;
          processedFiles.push(file.filename);
        } catch (error) {
          console.error(`Error processing file ${file.filename}:`, error);
          // If processing fails, keep the original file
          processedFiles.push(file.filename);
        }
      }
    }
    
    // Store processed file info in request object
    req.processedFiles = processedFiles;
    next();
  } catch (error) {
    console.error('Error in processImages middleware:', error);
    next(new AppError('Error processing uploaded images', 500));
  }
};

// Cleanup middleware to remove uploaded files if there's an error
const cleanupUploads = async (req, res, next) => {
  if (res.statusCode >= 400 && req.uploadedFiles && req.uploadedFiles.images) {
    for (const filename of req.uploadedFiles.images) {
      try {
        const filePath = path.join(uploadDir, filename);
        await fs.unlink(filePath).catch(() => {});
        // Clean up webp version if it exists
        const webpPath = filename.endsWith('.webp') ? filePath : `${filePath}.webp`;
        await fs.unlink(webpPath).catch(() => {});
      } catch (error) {
        console.error(`Error cleaning up file ${filename}:`, error);
      }
    }
  }
  next();
};

module.exports = {
  handleCardImages,
  processImages,
  cleanupUploads,
<<<<<<< HEAD
  upload
=======
  upload // Exporting upload for single file uploads if needed
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
};