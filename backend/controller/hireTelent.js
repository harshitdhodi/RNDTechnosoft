const HireTalent = require('../model/hireTelent');
const AppError = require('../utils/appError.js');

exports.createHireTalent = async (req, res, next) => {
  try {
    console.log('Request received:');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { heading, subHeading, pageSection, ...rest } = req.body;

    // Parse card fields dynamically
    const cards = [];
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\[(.+)\]|card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1] || match[3], 10);
        const field = match[2] || match[4];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }
      return acc;
    }, {});
    
    Object.entries(cardFields).forEach(([index, fields]) => {
      cards[index] = {
        cardInfo: fields.cardInfo || '',
        photo: '',
        altImg: fields.altImg || '',
        imgTitle: fields.imgTitle || '',
      };
    });

    console.log('Parsed cards before files:', cards);

    // Process file uploads
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const index = parseInt(match[1], 10);
          console.log(`Processing file for card ${index}:`, fileArray[0].filename);
          if (!isNaN(index) && cards[index]) {
            cards[index].photo = fileArray[0].filename;
          }
        }
      });
    }

    console.log('Cards after processing files:', cards);

    // Validate cards
    const invalidCards = cards.filter((card) => !card.photo || !card.cardInfo);
    if (invalidCards.length > 0) {
      return next(new AppError('Each card must have both photo and card info', 400));
    }

    // Check for existing entry
    const existingEntry = await HireTalent.findOne({
      heading: heading.trim(),
      pageSection,
    });

    if (existingEntry) {
      return next(
        new AppError(
          `An entry with heading "${heading.trim()}" and page section "${pageSection}" already exists. Consider updating the existing entry or using a different heading.`,
          400
        )
      );
    }

    // Create new hire talent entry
    const hireTalent = await HireTalent.create({
      heading: heading.trim(),
      subHeading: subHeading ? subHeading.trim() : '',
      pageSection,
      card: cards,
    });

    res.status(201).json({
      status: 'success',
      message: 'Hire talent entry created successfully',
      data: { hireTalent },
    });
  } catch (error) {
    console.error('Error creating hire talent entry:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return next(new AppError(`Validation error: ${messages.join('. ')}`, 400));
    }

    if (error.code === 11000) {
      return next(new AppError('Duplicate entry detected', 400));
    }

    if (error.name === 'CastError') {
      return next(new AppError('Invalid data format', 400));
    }

    return next(new AppError(`Server error: ${error.message}`, 500));
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

exports.updateHireTalent = async (req, res, next) => {
  try {
    const { heading, subHeading, pageSection, ...rest } = req.body;
    const cards = [];
    // Reuse the same card parsing logic as createHireTalent
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\[(.+)\]|card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1] || match[3], 10);
        const field = match[2] || match[4];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }
      return acc;
    }, {});

    Object.entries(cardFields).forEach(([index, fields]) => {
      cards[index] = {
        cardInfo: fields.cardInfo || '',
        photo: '',
        altImg: fields.altImg || '',
        imgTitle: fields.imgTitle || '',
      };
    });

    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const index = parseInt(match[1], 10);
          if (!isNaN(index) && cards[index]) {
            cards[index].photo = fileArray[0].filename;
          }
        }
      });
    }

    const invalidCards = cards.filter((card) => !card.photo || !card.cardInfo);
    if (invalidCards.length > 0) {
      return next(new AppError('Each card must have both photo and card info', 400));
    }

    const updatedEntry = await HireTalent.findOneAndUpdate(
      { heading: heading.trim(), pageSection },
      {
        subHeading: subHeading ? subHeading.trim() : '',
        card: cards,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return next(new AppError('No entry found with the provided heading and page section', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Hire talent entry updated successfully',
      data: { hireTalent: updatedEntry },
    });
  } catch (error) {
    console.error('Error updating hire talent entry:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return next(new AppError(`Validation error: ${messages.join('. ')}`, 400));
    }
    return next(new AppError(`Server error: ${error.message}`, 500));
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
    const validSections = ['TeamService', 'Applications', 'WhyChoose'];
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