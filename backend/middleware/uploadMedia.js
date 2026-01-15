const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const multer = require('multer');

const videoDir = path.join(__dirname, '../videos');
const photoDir = path.join(__dirname, '../images');
const tempDir = path.join(__dirname, '../temp');

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
            uploadDir = tempDir;
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.fieldname === 'video') {
            fileName = file.originalname;
            req.fileName = fileName;
        } else if (file.fieldname === 'photo') {
            // Use original extension for WebM files, convert others to webp
            const isWebM = file.mimetype === 'video/webm';
            const ext = isWebM ? '.webm' : '.webp';
            fileName = `${file.fieldname}_${Date.now()}${ext}`;
        }
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'video') {
            // Handle video uploads
            const allowedVideoTypes = /webm/;
            const mimeType = allowedVideoTypes.test(file.mimetype);
            const extName = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
            
            if (mimeType && extName) {
                return cb(null, true);
            } else {
                cb(new Error('Invalid video file type. Only WEBM files are allowed.'));
            }
        } else if (file.fieldname === 'photo') {
            // Handle photo uploads, including WebM as "photo"
            const allowedTypes = /jpeg|jpg|png|webp|gif|svg|webm/;
            const mimeType = allowedTypes.test(file.mimetype);
            const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            
            if (mimeType && extName) {
                return cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, SVG and WEBM files are allowed.'));
            }
        } else {
            cb(new Error('Unexpected field name'));
        }
    }
});

// Improved retry unlink function with better error handling
const retryUnlink = (filePath, retries = 10, delay = 200) => {
    return new Promise((resolve, reject) => {
        const attempt = (remainingRetries) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    // Handle different error codes that might benefit from retry
                    if ((err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'ENOTEMPTY') && remainingRetries > 0) {
                        console.log(`Retrying file deletion for ${filePath}, attempts left: ${remainingRetries}`);
                        setTimeout(() => {
                            attempt(remainingRetries - 1);
                        }, delay * (11 - remainingRetries)); // Exponential backoff
                    } else if (err.code === 'ENOENT') {
                        // File doesn't exist, consider it successful
                        console.log(`File ${filePath} doesn't exist, considering deletion successful`);
                        resolve();
                    } else {
                        console.error(`Failed to delete file ${filePath} after retries:`, err);
                        // Don't reject, just log the error and continue
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        };
        attempt(retries);
    });
};

// Alternative cleanup function that's more forgiving
const safeCleanup = async (filePath) => {
    try {
        // Add a small delay before attempting deletion
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if file exists before attempting deletion
        if (fs.existsSync(filePath)) {
            await retryUnlink(filePath);
        }
    } catch (error) {
        console.warn(`Warning: Could not clean up temporary file ${filePath}:`, error.message);
        // Don't throw error, just log warning
    }
};

// Schedule cleanup for later if immediate cleanup fails
const scheduleCleanup = (filePath) => {
    setTimeout(async () => {
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                console.log(`Delayed cleanup successful for ${filePath}`);
            }
        } catch (error) {
            console.warn(`Delayed cleanup failed for ${filePath}:`, error.message);
        }
    }, 5000); // Try again after 5 seconds
};

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
                let sharpInstance = null;

                try {
                    if (!fs.existsSync(tempPath)) {
                        throw new Error(`Temporary file does not exist: ${tempPath}`);
                    }

                    // Check if the file is a WebM (video) file
                    const isWebM = photo.mimetype === 'video/webm' || path.extname(photo.filename).toLowerCase() === '.webm';
                    
                    if (isWebM) {
                        // For WebM files, just move them to the final location
                        fs.copyFileSync(tempPath, finalPath);
                        await safeCleanup(tempPath);
                    } else {
                        // For image files, process with Sharp
                        sharpInstance = sharp(tempPath);
                        
                        const processedImage = sharpInstance
                            .resize({ width: 1024, withoutEnlargement: true })
                            .webp({ quality: 100 });

                        const buffer = await processedImage.toBuffer();
                        
                        // Create a new Sharp instance for the final output
                        if (buffer.length > 100 * 1024) {
                            await sharp(buffer)
                                .webp({ quality: 80 })
                                .toFile(finalPath);
                        } else {
                            await sharp(buffer)
                                .toFile(finalPath);
                        }

                        // Ensure Sharp instance is properly cleaned up
                        if (sharpInstance) {
                            sharpInstance.destroy();
                        }

                        // Force garbage collection if available
                        if (global.gc) {
                            global.gc();
                        }

                        // Clean up temp file with improved error handling
                        await safeCleanup(tempPath);
                    }

                } catch (err) {
                    // Ensure Sharp instance is cleaned up on error
                    if (sharpInstance) {
                        try {
                            sharpInstance.destroy();
                        } catch (destroyErr) {
                            console.warn('Error destroying Sharp instance:', destroyErr);
                        }
                    }

                    // Attempt cleanup and schedule retry if needed
                    if (fs.existsSync(tempPath)) {
                        await safeCleanup(tempPath);
                        // If file still exists, schedule for later cleanup
                        if (fs.existsSync(tempPath)) {
                            scheduleCleanup(tempPath);
                        }
                    }
                    
                    console.error(`Error processing photo ${photo.filename}:`, err);
                    throw new Error(`Error processing photo ${photo.filename}: ${err.message}`);
                }
            });

            try {
                await Promise.all(processPromises);
                
                // Additional cleanup attempt after all processing is complete
                setTimeout(async () => {
                    const tempFiles = photos.map(photo => path.join(tempDir, photo.filename));
                    for (const tempFile of tempFiles) {
                        if (fs.existsSync(tempFile)) {
                            await safeCleanup(tempFile);
                        }
                    }
                }, 1000);
                
                next();
            } catch (err) {
                console.log('Error processing images:', err);
                res.status(500).send({ error: `Error processing images: ${err.message}` });
            }
        } else {
            next();
        }
    });
};

module.exports = { uploadMedia };