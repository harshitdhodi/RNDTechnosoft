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
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }i
      return acc;
    }, {});
    
    console.log('Parsed cardFields:', cardFields);

    // Convert cardFields object to proper array and 1filter out empty cards
    const cards = [];
    Object.entries(cardFields).forEach(([index, fields]) => {
      const cardIndex = parseInt(index, 10);
      // Only include cards that have cardInfo (required field)
      if (fields.cardInfo && fields.cardInfo.trim()) {
        cards.push({
          cardInfo: fields.cardInfo.trim(),
          photo: '', // Will be set from files
          altImg: fields.altImg ? fields.altImg.trim() : '',
          imgTitle: fields.imgTitle ? fields.imgTitle.trim() : '',
          _originalIndex: cardIndex // Keep track of original index for file processing
        });
      }
    });

    console.log('Parsed cards before files:', cards);

    // Validate that we have at least one card
    if (cards.length === 0) {
      return next(new AppError('At least one card with card info is required', 400));
    }

    // Process file uploads
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const originalIndex = parseInt(match[1], 10);
          console.log(`Processing file for card ${originalIndex}:`, fileArray[0].filename);
          
          // Find the card with the matching original index
          const cardToUpdate = cards.find(card => card._originalIndex === originalIndex);
          if (cardToUpdate) {
            cardToUpdate.photo = fileArray[0].filename;
          }
        }
      });
    }

    // Remove the temporary _originalIndex property
    cards.forEach(card => {
      delete card._originalIndex;
    });

    console.log('Cards after processing files:', cards);

    // Validate cards - ensure each card has both photo and cardInfo
    const invalidCards = cards.filter((card) => !card.photo || !card.cardInfo.trim());
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

exports.updateHireTalent = async (req, res, next) => {
  try {
    console.log('Update request received:');
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    const { heading, subHeading, pageSection, ...rest } = req.body;
    
    // Get existing entry first to preserve existing photos if no new files uploaded
    const existingEntry = await HireTalent.findById(req.params.id);
    if (!existingEntry) {
      return next(new AppError('No entry found with the provided ID', 404));
    }

    // Parse card fields dynamically
    const cardFields = Object.keys(req.body).reduce((acc, key) => {
      const match = key.match(/card\[(\d+)\]\.(.+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        if (!acc[index]) acc[index] = {};
        acc[index][field] = req.body[key];
      }
      return acc;
    }, {});

    // Convert cardFields object to proper array
    const cards = [];
    Object.entries(cardFields).forEach(([index, fields]) => {
      const cardIndex = parseInt(index, 10);
      // Only include cards that have cardInfo
      if (fields.cardInfo && fields.cardInfo.trim()) {
        // Initialize with existing photo if available
        const existingCard = existingEntry.card[cardIndex];
        cards.push({
          cardInfo: fields.cardInfo.trim(),
          photo: existingCard ? existingCard.photo : '', // Start with existing photo
          altImg: fields.altImg ? fields.altImg.trim() : '',
          imgTitle: fields.imgTitle ? fields.imgTitle.trim() : '',
          _originalIndex: cardIndex
        });
      }
    });

    console.log('Cards before file processing:', cards);

    // Process file uploads (new files will override existing photos)
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, fileArray]) => {
        const match = fieldName.match(/card\[(\d+)\]\.photo/);
        if (match && fileArray && fileArray[0]) {
          const originalIndex = parseInt(match[1], 10);
          const cardToUpdate = cards.find(card => card._originalIndex === originalIndex);
          if (cardToUpdate) {
            cardToUpdate.photo = fileArray[0].filename;
          }
        }
      });
    }

    // Remove the temporary _originalIndex property
    cards.forEach(card => {
      delete card._originalIndex;
    });

    console.log('Cards after file processing:', cards);

    // Validate cards
    const invalidCards = cards.filter((card) => !card.photo || !card.cardInfo.trim());
    if (invalidCards.length > 0) {
      return next(new AppError('Each card must have both photo and card info', 400));
    }

    const updatedEntry = await HireTalent.findByIdAndUpdate(
      req.params.id,
      {
        heading: heading.trim(),
        subHeading: subHeading ? subHeading.trim() : '',
        pageSection,
        card: cards,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return next(new AppError('No entry found with the provided ID', 404));
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

// Keep all other existing methods unchanged
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