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
            const allowedTypes = /jpeg|jpg|png|webp|gif|webm/;
            const mimeType = allowedTypes.test(file.mimetype);
            const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            
            if (mimeType && extName) {
                return cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, and WEBM files are allowed.'));
            }
        } else {
            cb(new Error('Unexpected field name'));
        }
    }
});

const retryUnlink = (filePath, retries = 5, delay = 100) => {
    return new Promise((resolve, reject) => {
        const attempt = () => {
            fs.unlink(filePath, (err) => {
                if (err && err.code === 'EBUSY' && retries > 0) {
                    setTimeout(() => {
                        attempt(--retries);
                    }, delay);
                } else if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        };
        attempt();
    });
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

                try {
                    if (!fs.existsSync(tempPath)) {
                        throw new Error(`Temporary file does not exist: ${tempPath}`);
                    }

                    // Check if the file is a WebM (video) file
                    const isWebM = photo.mimetype === 'video/webm' || path.extname(photo.filename).toLowerCase() === '.webm';
                    
                    if (isWebM) {
                        // For WebM files, just move them to the final location
                        fs.copyFileSync(tempPath, finalPath);
                        await retryUnlink(tempPath);
                    } else {
                        // For image files, process with Sharp
                        const processedImage = sharp(tempPath)
                            .resize({ width: 1024, withoutEnlargement: true })
                            .webp({ quality: 100 });

                        const buffer = await processedImage.toBuffer();
                        if (buffer.length > 100 * 1024) {
                            await sharp(buffer)
                                .webp({ quality: 80 })
                                .toFile(finalPath);
                        } else {
                            await processedImage.toFile(finalPath);
                        }

                        await retryUnlink(tempPath);
                    }

                } catch (err) {
                    if (fs.existsSync(tempPath)) {
                        await retryUnlink(tempPath);
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