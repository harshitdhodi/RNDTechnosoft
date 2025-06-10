const TechnologySecData = require('../model/technologySecData'); // Adjust path to your model file

const createTechnologySecData = async (req, res) => {
  try {
    const { type, heading,technologyId } = req.body;
    let { card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Parse card if it's a string
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Validate input
    if (!type || !heading || !Array.isArray(card)) {
      return res.status(400).json({ error: 'Type, heading, and card array are required' });
    }

    // Map file uploads to corresponding card items
    const updatedCard = card.map((cardItem, index) => {
      const fileField = `card[${index}][photo]`;
      const file = req.files && req.files[fileField] && req.files[fileField][0];
      const photo = file ? file.filename : cardItem.photo || '';

      return {
        photo,
        heading: cardItem.heading,
        subHeading: cardItem.subHeading,
        altName: cardItem.altName,
        imgTitle: cardItem.imgTitle,
        
      };
    });

    const newTechSecData = new TechnologySecData({
      type,
      heading,
        technologyId,
      card: updatedCard,
    });

    await newTechSecData.save();

    res.status(201).json({ message: 'Technology section data created', data: newTechSecData });
  } catch (error) {
    console.error('Error in createTechnologySecData:', error);
    res.status(500).json({ error: error.message });
  }
};



// Update a TechnologySecData entry by ID
const updateTechnologySecData = async (req, res) => {
  try {
    const { id } = req.params;
    let { type, heading, card,technologyId } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files); 

    // Parse card if sent as a string (from form-data)
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Find the existing document
    const techSecData = await TechnologySecData.findById(id);
    if (!techSecData) {
      return res.status(404).json({ error: 'Technology section data not found' });
    }

    // Update type and heading if provided
    if (type) techSecData.type = type;
    if (heading) techSecData.heading = heading;
    if (technologyId) techSecData.technologyId = technologyId;
    // Handle card updates
    if (card && Array.isArray(card)) {
      const files = req.files || {};

      const updatedCard = card.map((cardItem, index) => {
        const fileField = `card[${index}][photo]`;
        const file = files[fileField]?.[0];
        const photo = file ? file.filename : cardItem.photo || '';

        return {
          photo,
          heading: cardItem.heading,
          subHeading: cardItem.subHeading,
          altName: cardItem.altName,
          imgTitle: cardItem.imgTitle,
    
        };
      });
      techSecData.card = updatedCard;
    }

    techSecData.updatedAt = Date.now();

    await techSecData.save();

    res.status(200).json({ message: 'Technology section data updated', data: techSecData });
  } catch (error) {
    console.error('Error in updateTechnologySecData:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all TechnologySecData entries
const getAllTechnologySecData = async (req, res) => {
  try {
    const data = await TechnologySecData.find().populate('technologyId');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Get a single TechnologySecData entry by ID
const getTechnologySecDataById = async (req, res) => {
  try {
    console.log("hello")
    const data = await TechnologySecData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};



// Delete a TechnologySecData entry by ID
const deleteTechnologySecData = async (req, res) => {
  try {
    const deletedData = await TechnologySecData.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error: error.message });
  }
};

const getDataByTechnologySlug = async (req, res) => {
  try {
    const { slug } = req.params; // or req.query.slug if passed as query parameter
    
    const data = await TechnologySecData.find()
      .populate({
        path: 'technologyId',
        match: { slug: slug }
      });
    
    // Filter out documents where technologyId is null (no match found)
    const filteredData = data.filter(item => item.technologyId !== null);
    
    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

module.exports = {
  createTechnologySecData,
  getAllTechnologySecData,
  getTechnologySecDataById,
  updateTechnologySecData,
  deleteTechnologySecData,
  getDataByTechnologySlug
};