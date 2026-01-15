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

// Track files that need cleanup
const filesToCleanup = new Set();

// Schedule cleanup every 5 minutes
setInterval(() => {
  if (filesToCleanup.size === 0) return;
  
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  filesToCleanup.forEach(({ path, timestamp }) => {
    if (now - timestamp > maxAge) {
      fs.unlink(path, (err) => {
        if (!err || err.code === 'ENOENT') {
          filesToCleanup.delete(path);
        }
      });
    }
  });
}, 5 * 60 * 1000); // Run every 5 minutes

const processLogoImage = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.webp') {
    return filePath;
  }

  const webpPath = filePath.replace(/\.[^/.]+$/, '.webp');
  
  try {
    await sharp(filePath)
      .resize(5000, 5000, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: 80,
        effort: 6
      })
      .toFile(webpPath);

    // Schedule file for cleanup instead of deleting immediately
    filesToCleanup.add({
      path: filePath,
      timestamp: Date.now()
    });

    return webpPath;
  } catch (error) {
    console.error(`Error processing image at ${filePath}:`, error);
    return filePath;
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

    if (!req.files || !req.files['photo']) {
      return next();
    }

    try {
      await Promise.all(req.files['photo'].map(async (photo) => {
        const tempPath = path.join(tempDir, photo.filename);
        if (!fs.existsSync(tempPath)) {
          throw new Error(`Temporary file not found: ${photo.filename}`);
        }

        try {
          const newPath = await processLogoImage(tempPath);
          const finalPath = path.join(
            photoDir,
            path.basename(photo.filename, path.extname(photo.filename)) + '.webp'
          );

          // Ensure the target directory exists
          await fs.promises.mkdir(path.dirname(finalPath), { recursive: true });
          
          // Use copy instead of rename
          await fs.promises.copyFile(newPath, finalPath);
          photo.filename = path.basename(finalPath);
          
          // Schedule the processed file for cleanup
          if (newPath !== tempPath) {
            filesToCleanup.add({
              path: newPath,
              timestamp: Date.now()
            });
          }
        } catch (processError) {
          console.error('Error processing file:', processError);
          throw processError;
        }
      }));
      next();
    } catch (error) {
      console.error('Error in upload middleware:', error);
      res.status(500).send({ 
        error: 'Error processing uploaded files',
        details: error.message 
      });
    }
  });
};

module.exports = { uploadPhoto };