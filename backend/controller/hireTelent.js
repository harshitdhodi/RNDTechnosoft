const HireTalent = require('../model/hireTelent');

exports.createHireTalent = async (req, res) => {
  try {
    const { heading, subHeading, pageSection } = req.body;
    let { card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Parse card if it's a string
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Validate input
    if (!heading || !pageSection || !Array.isArray(card)) {
      return res.status(400).json({ error: 'Heading, pageSection, and card array are required' });
    }

    // Map file uploads to corresponding card items
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

    const newHireTalentData = new HireTalent({
      heading,
      subHeading,
      pageSection,
      card: updatedCards,
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
    const { heading, subHeading, pageSection, card } = req.body;

    const updates = {};
    if (heading) updates.heading = heading;
    if (subHeading) updates.subHeading = subHeading;
    if (pageSection) updates.pageSection = pageSection;

    if (card) {
      const parsedCards = JSON.parse(card);
      updates.card = parsedCards.map((card, index) => ({
        cardInfo: card.cardInfo || [],
        photo: req.files && req.files[index] ? req.files[index].map(file => file.filename) : card.photo,
        altImg: card.altImg || Array((req.files && req.files[index] ? req.files[index].length : card.photo.length)).fill(''),
        imgTitle: card.imgTitle || Array((req.files && req.files[index] ? req.files[index].length : card.photo.length)).fill('')
      }));
    }

    const updated = await HireTalent.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Hire Talent not found' });

    res.status(200).json({ message: 'Hire Talent updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
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