const HireTalent = require('../model/hireTelent');

exports.createHireTalent = async (req, res) => {
  try {
    const { heading, subHeading, pageSection } = req.body;
    let { card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Parse card if it's a JSON string
    if (typeof card === 'string') {
      try {
        card = JSON.parse(card);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid card JSON format' });
      }
    }

    // Basic required field validation
    if (!heading || !pageSection) {
      return res.status(400).json({ error: 'Heading and pageSection are required' });
    }

    // Process cards if provided and is a valid array
    let updatedCards = [];
    if (Array.isArray(card)) {
      updatedCards = card.map((cardItem, index) => {
        const fileField = `card[${index}][photo]`;
        const file = req.files?.[fileField]?.[0];
        const photo = file ? file.filename : cardItem.photo || '';

        return {
          cardInfo: cardItem.cardInfo,
          photo,
          altImg: cardItem.altImg,
          imgTitle: cardItem.imgTitle,
        };
      });
    }

    // Create document
    const newHireTalentData = new HireTalent({
      heading,
      subHeading,
      pageSection,
      ...(updatedCards.length > 0 && { card: updatedCards }), // Only include `card` if present
    });

    await newHireTalentData.save();

    res.status(201).json({ message: 'Hire talent data created', data: newHireTalentData });
  } catch (error) {
    console.error('Error in createHireTalentData:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAllHireTalents = async (req, res) => {
  try {
    const hireTalents = await HireTalent.find()
      .sort({ createdAt: -1 });

    res.status(200).json({ data: hireTalents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHireTalentById = async (req, res) => {
  try {
    const hireTalent = await HireTalent.findById(req.params.id);
    if (!hireTalent) return res.status(404).json({ message: 'Hire Talent not found' });
    res.status(200).json({ data: hireTalent });
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};

exports.updateHireTalent = async (req, res) => {
  try {
    const { heading, subHeading, pageSection } = req.body;
    let { card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Parse card if it's a string
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Build updates object
    const updates = {};
    if (heading !== undefined) updates.heading = heading;
    if (subHeading !== undefined) updates.subHeading = subHeading;
    if (pageSection !== undefined) updates.pageSection = pageSection;

    // Handle card updates if provided
    if (card && Array.isArray(card)) {
      // Map file uploads to corresponding card items (same logic as create)
      const updatedCards = card.map((cardItem, index) => {
        const fileField = `card[${index}][photo]`;
        const file = req.files && req.files[fileField] && req.files[fileField][0];
        const photo = file ? file.filename : cardItem.photo || '';

        return {
          cardInfo: cardItem.cardInfo,
          photo,
          altImg: cardItem.altImg,
          imgTitle: cardItem.imgTitle,
        };
      });

      updates.card = updatedCards;
    }

    // Find and update the document
    const updated = await HireTalent.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Hire Talent not found' });
    }

    res.status(200).json({ message: 'Hire Talent updated', data: updated });
  } catch (error) {
    console.error('Error in updateHireTalent:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHireTalent = async (req, res) => {
  try {
    const deleted = await HireTalent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Hire Talent not found' });

    res.status(200).json({ message: 'Hire Talent deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHireTalentsByPageSection = async (req, res) => {
  try {
    const { pageSection } = req.query;

    // Validate pageSection if provided
    const validSections = ['TeamService', 'Applications', 'WhyChoose', 'Technologies'];
    if (pageSection && !validSections.includes(pageSection)) {
      return res.status(400).json({ error: 'Invalid pageSection value. Must be one of: ' + validSections.join(', ') });
    }

    // Build query object with case-insensitive search
    const query = pageSection ? { pageSection: { $regex: new RegExp(pageSection, 'i') } } : {};

    // Fetch HireTalent records
    const hireTalents = await HireTalent.find(query)
      .sort({ createdAt: -1 });

    // Check if records exist
    if (hireTalents.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }

    res.status(200).json({ data: hireTalents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};