const multer = require('multer');
const path = require('path');
const fs=require('fs')

const uploadDir = path.join(__dirname, '../files');

// Check if the directory exists, create it if it doesn't
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Change to your desired directory
  },
  filename: function (req, file, cb) {
    const fileName = `Imports_${Date.now()}${path.extname(file.originalname)}`;
    req.fileName=fileName
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

const uploadfiles = upload.single('file');

module.exports = {uploadfiles};