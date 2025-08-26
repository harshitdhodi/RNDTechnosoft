const Header = require('../model/header');
const path=require('path')

// Get the header data
exports.getHeader = async (req, res) => {
  try {
    const header = await Header.findOne();
    if (!header) {
      return res.status(404).json({ message: 'Header not found' });
    }
    res.json(header);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the header data
exports.updateHeader = async (req, res) => {
  try {
    const { phoneNo, email, alt } = req.body;
    let photo = req.body.photo;
    
    if (req.file) {
      photo = req.file.filename;
    }

    // Try to find an existing header document
    let header = await Header.findOne();

    // If header document doesn't exist, create a new one
    if (!header) {
      header = new Header({
        phoneNo,
        email,
        photo,
        alt
      });

      // Save the new header document
      const newHeader = await header.save();
      return res.status(201).json(newHeader);
    }

    // Update the existing header document
    header.phoneNo = phoneNo;
    header.email = email;
    header.photo = photo;
    header.alt = alt;

    const updatedHeader = await header.save();
    res.json(updatedHeader);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.downloadFile = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../logos', filename);
  
    res.download(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'File download failed' });
      }
    });
  };


