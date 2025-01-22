const Cards = require("../model/cards")

const addCards = async (req, res) => {
  // Check if the file is provided
  if (!req.file) {
    return res.status(400).send({ error: 'Icon is required' });
  }

  const { title, altName, iconName, questionsAndAnswers } = req.body;

  // Create a new Card instance
  const card = new Cards({
    icon: req.file.filename, // Use filename for storage
    title,
    altName, // New field for alternative name
    iconName, // New field for icon name
    questionsAndAnswers: JSON.parse(questionsAndAnswers), // Ensure this is parsed correctly
  });

  try {
    await card.save(); // Save the new card
    res.status(200).send({ message: 'Card created successfully', card });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

  

const getAllCards = async (req, res) => {
    try {
      const Card = await Cards.find();
      res.status(200).send(Card);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

const getCardsById = async (req, res) => {
    try {
        const {id} = req.query;
      const Card = await Cards.findById(id);
      if (!Card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send(Card);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }


  const updateCards = async (req, res) => {
    try {
      const { id } = req.query; // Get ID from query parameters
      
      // Create updateData object with only provided fields
      const updateData = {};
  
      // Update icon if a new file is uploaded
      if (req.file) {
        updateData.icon = req.file.filename;
      }
  
      // Update title if provided
      if (req.body.title) {
        updateData.title = req.body.title;
      }
  
      // Update altName if provided
      if (req.body.altName) {
        updateData.altName = req.body.altName;
      }
  
      // Update iconName if provided
      if (req.body.iconName) {
        updateData.iconName = req.body.iconName;
      }
  
      // Update questionsAndAnswers if provided
      if (req.body.questionsAndAnswers) {
        updateData.questionsAndAnswers = JSON.parse(req.body.questionsAndAnswers); // Convert string to JSON
      }
  
      // Find and update the card
      const card = await Cards.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!card) {
        return res.status(404).json({ message: 'Card not found' });
      }
  
      res.status(200).json({ message: 'Card updated successfully', card });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: error.message });
    }
  };
  
  

const deleteCard = async (req, res) => {
    try {
        const {id} = req.query;
      const Card = await Cards.findByIdAndDelete(id);
  
      if (!Card) {
        return res.status(404).send({ message: 'Cards not found' });
      }
  
      res.status(200).send({ message: 'Cards deleted successfully' });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  const fs = require("fs")
  const path = require("path")
  const uploadDir = path.join(__dirname, '../../uploads');
  console.log('Upload Directory:', uploadDir);
  
  const deleteCardFieldsById = async (req, res) => {
    const { id } = req.query;

    try {
        // Find the document by ID
        const card = await Cards.findById(id);

        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const iconFileName = card.icon;

        if (iconFileName) {
            const filePath = path.join(uploadDir, iconFileName);
            console.log('File Path:', filePath);

            // Check if the file exists before deleting
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.warn('File does not exist:', filePath);
                } else {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted successfully:', filePath);
                        }
                    });
                }
            });

            // Clear the icon fields only if necessary, but don't set them to empty if not allowed
            card.icon = null; // Set to null instead of undefined
            card.iconName = null; // Set to null if needed
            card.altName = null; // Set to null if needed
            await card.save();
        } else {
            console.warn('No icon to delete for card with id:', id);
        }

        res.status(200).json({ message: 'Icon and fields deleted successfully' });
    } catch (error) {
        console.error('Error deleting icon and fields:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};


  module.exports = {addCards,deleteCard ,updateCards, getAllCards, deleteCardFieldsById , getCardsById}