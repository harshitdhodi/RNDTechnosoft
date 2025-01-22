const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Define the directories for video and photo uploads
const videoDir = path.join(__dirname, '../videos');
const photoDir = path.join(__dirname, '../images');
const tempDir = path.join(__dirname, '../temp');

// Ensure the directories exist
[videoDir, photoDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir;
        if (file.fieldname === 'video') {
            uploadDir = videoDir;
        } else if (file.fieldname === 'photo') {
            uploadDir = tempDir; // Store photos in temp directory initially
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.fieldname === 'video') {
            fileName = file.originalname;
            req.fileName = fileName;
        } else if (file.fieldname === 'photo') {
            fileName = `${file.fieldname}_${Date.now()}.webp`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
    fileFilter: function (req, file, cb) {
      // No file type validation, allow all types
      cb(null, true);
    }
  });

const uploadMedia = (req, res, next) => {
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'photo', maxCount: 5 }
    ])(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }

        if (req.files && req.files['photo']) {
            const photos = req.files['photo'];
            const processPromises = photos.map(async (photo) => {
                const tempPath = path.join(tempDir, photo.filename);
                const finalPath = path.join(photoDir, photo.filename);

                try {
                    // Check if the temp file exists
                    if (!fs.existsSync(tempPath)) {
                        throw new Error(`Temporary file does not exist: ${tempPath}`);
                    }

                    // Process the image with reduced quality if needed
                    const processedImage = sharp(tempPath)
                        .resize({ width: 1024, withoutEnlargement: true })
                        .webp({ quality: 100 });

                    // Check file size before saving
                    const buffer = await processedImage.toBuffer();
                    if (buffer.length > 100 * 1024) { // If size > 100KB
                        await sharp(buffer)
                            .webp({ quality: 80 })
                            .toFile(finalPath);
                    } else {
                        await processedImage.toFile(finalPath);
                    }

                    // Clean up temporary file
                    fs.unlinkSync(tempPath);

                } catch (err) {
                    // Clean up temp file if it exists
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }
                    console.error(`Error processing photo ${photo.filename}:`, err);
                    throw new Error(`Error processing photo ${photo.filename}: ${err.message}`);
                }
            });

            try {
                await Promise.all(processPromises);
                next();
            } catch (err) {
                console.error('Error processing images:', err);
                res.status(500).send({ error: `Error processing images: ${err.message}` });
            }
        } else {
            next();
        }
    });
};

module.exports = { uploadMedia };