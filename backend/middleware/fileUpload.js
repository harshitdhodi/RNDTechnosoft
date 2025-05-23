const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Define the directories
const catalogueDir = path.join(__dirname, '../catalogues');
const photoDir = path.join(__dirname, '../images');
const resumeDir = path.join(__dirname, '../resumes');
const tempDir = path.join(__dirname, '../temp');

// Ensure the directories exist
[photoDir, catalogueDir, resumeDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'catalogue') {
      cb(null, catalogueDir);
    } else if (file.fieldname === 'photo') {
      cb(null, tempDir); // Save temporarily
    } else if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    }
  },
  filename: function (req, file, cb) {
    let fileName;
    if (file.fieldname === 'catalogue') {
      fileName = file.originalname;
      req.fileName = fileName;
    } else if (file.fieldname === 'photo') {
      fileName = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
    } else if (file.fieldname === 'resume') {
      fileName = `resume_${Date.now()}${path.extname(file.originalname)}`;
    }
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max 50MB
  fileFilter: function (req, file, cb) {
    cb(null, true); // Accept all file types
  }
});

const processLogoImage = async (filePath) => {
  try {
    if (path.extname(filePath).toLowerCase() === '.webp') {
      return filePath;
    }
    const webpPath = path.join(
      path.dirname(filePath),
      path.basename(filePath, path.extname(filePath)) + '.webp'
    );
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    await fs.promises.unlink(filePath);
    return webpPath;
  } catch (err) {
    console.error(`Failed to process image at ${filePath}:`, err);
    throw new Error(`Failed to process image: ${err.message}`);
  }
};

// Middleware to move photo files from temp to final directory
const uploadPhoto = (req, res, next) => {
  upload.fields([
    { name: 'catalogue', maxCount: 1 },
    { name: 'photo', maxCount: 5 },
    { name: 'resume', maxCount: 1 }
  ])(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    try {
      if (req.files && req.files['photo']) {
        for (const photo of req.files['photo']) {
          const tempPath = path.join(tempDir, photo.filename);
          const finalPath = path.join(
            photoDir,
            path.basename(photo.filename, path.extname(photo.filename)) + '.webp'
          );

          if (fs.existsSync(tempPath)) {
            const newPath = await processLogoImage(tempPath);
            await fs.promises.rename(newPath, finalPath); // Move file to final location
            photo.filename = path.basename(finalPath); // Update filename in req.files
          } else {
            throw new Error(`Temporary file not found: ${photo.filename}`);
          }
        }
      }
      next();
    } catch (moveErr) {
      console.error('Error moving photo:', moveErr);
      return res.status(500).send({ error: `Error moving photo: ${moveErr.message}` });
    }
  });
};

module.exports = { uploadPhoto };