const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Define directories for different types of uploads
const photoDir = path.join(__dirname, '../images');
const videoDir = path.join(__dirname, '../videos');
const authPhotoDir = path.join(__dirname, '../images');
const iconPhotoDir = path.join(__dirname, '../images');
const tempDir = path.join(__dirname, '../temp');

// Ensure the directories exist
[photoDir, videoDir, authPhotoDir, iconPhotoDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir;
    const fieldName = file.fieldname.split('[')[0]; // Handle array fields like iconPhoto[0]
    
    // Store images in temp directory initially for processing
    if (fieldName === 'video') {
      uploadDir = videoDir;
    } else {
      uploadDir = tempDir;
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fieldName = file.fieldname.split('[')[0];
    const uniqueSuffix = Date.now();
    
    if (fieldName === 'video') {
      cb(null, file.originalname);
      req.fileName = file.originalname;
    } else {
      cb(null, `${fieldName}-${uniqueSuffix}.webp`);
    }
  }
});

// Create Multer instance with storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const fieldName = file.fieldname.split('[')[0];
    const allowedTypes = {
      photo: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      video: ['video/mp4'],
      authPhoto: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      iconPhoto: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    };

    if (allowedTypes[fieldName] && allowedTypes[fieldName].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Function to process and optimize image
const processImage = async (tempPath, finalPath) => {
  try {
    // Process the image with initial high quality
    const processedImage = sharp(tempPath)
      .resize({ width: 1024, withoutEnlargement: true })
      .webp({ quality: 100 });

    // Check file size and reduce quality if needed
    const buffer = await processedImage.toBuffer();
    if (buffer.length > 100 * 1024) { // If size > 100KB
      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(finalPath);
    } else {
      await processedImage.toFile(finalPath);
    }

    // Clean up temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    throw new Error(`Error processing image: ${err.message}`);
  }
};

// Middleware function to handle file uploads and processing
const uploadImg = (req, res, next) => {
  upload.any()(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    try {
      if (req.files) {
        const processPromises = req.files.map(async (file) => {
          const fieldName = file.fieldname.split('[')[0];
          
          // Skip processing for videos
          if (fieldName === 'video') return;

          // Determine final directory based on field name
          let finalDir;
          switch (fieldName) {
            case 'photo':
              finalDir = photoDir;
              break;
            case 'authPhoto':
              finalDir = authPhotoDir;
              break;
            case 'iconPhoto':
              finalDir = iconPhotoDir;
              break;
            default:
              finalDir = photoDir;
          }

          const finalPath = path.join(finalDir, file.filename);
          await processImage(file.path, finalPath);
        });

        await Promise.all(processPromises);
      }
      next();
    } catch (err) {
      console.error('Error processing files:', err);
      res.status(500).send({ error: `Error processing files: ${err.message}` });
    }
  });
};

module.exports = { uploadImg };