const Footer = require('../model/footer');

// Get the footer data
exports.getFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).json({ message: 'Footer not found' });
    }
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the footer data
exports.updateFooter = async (req, res) => {
  const { newsletter, instagramLink, behanceLink, linkedinLink, googleLink, location, phoneNo, phoneNo_2, email, email_2 } = req.body;
  
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      // If no footer document exists, create a new one
      footer = new Footer({
        newsletter,
        instagramLink,
        linkedinLink,
        googleLink,
        location,
        behanceLink,
        phoneNo,
        phoneNo_2,
        email,
        email_2
      });

      const newFooter = await footer.save();
      return res.status(201).json(newFooter);
    }

    // Update existing footer document
    footer.newsletter = newsletter;
    footer.instagramLink = instagramLink;
    footer.linkedinLink = linkedinLink;
    footer.googleLink = googleLink;
    footer.location = location;
    footer.phoneNo = phoneNo;
    footer.behanceLink= behanceLink,
    footer.phoneNo_2 = phoneNo_2;
    footer.email = email;
    footer.email_2 = email_2;

    const updatedFooter = await footer.save();
    res.json(updatedFooter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


