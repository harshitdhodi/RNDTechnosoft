const path = require('path');
const fs = require('fs').promises;
const AppError = require('../utils/appError');

exports.downloadPortfolio = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../public/portfolio.pdf');
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return next(new AppError('Portfolio file not found', 404));
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="RND_Technosoft_Portfolio.pdf"');
    
    // Stream the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return next(new AppError('Error downloading file', 500));
      }
    });
  } catch (err) {
    next(err);
  }
};
