const IndustrySecData = require('../model/caseStudy'); // Adjust path to your model file

// Create a new IndustrySecData entry
const createIndustrySecData = async (req, res) => {
  try {
    const { type, heading, subHeading, category } = req.body;
    let { card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Parse card if it's a string
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Validate input
    if (!type || !heading || !subHeading || !category || !Array.isArray(card)) {
      return res.status(400).json({ error: 'Type, heading, subHeading, category, and card array are required' });
    }

    // Map file uploads to corresponding card items
    const updatedCard = card.map((cardItem, index) => {
      const fileField = `card[${index}][photo]`;
      const file = req.files && req.files[fileField] && req.files[fileField][0];
      const photo = file ? file.filename : cardItem.photo || '';

      return {
        photo,
        title: cardItem.title,
        details: cardItem.details,
        altName: cardItem.altName,
        imgTitle: cardItem.imgTitle,
      };
    });

    const newIndustrySecData = new IndustrySecData({
      type,
      heading,
      subHeading,
      category,
      card: updatedCard,
    });

    await newIndustrySecData.save();

    res.status(201).json({ message: 'Industry section data created', data: newIndustrySecData });
  } catch (error) {
    console.error('Error in createIndustrySecData:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an IndustrySecData entry by ID
const updateIndustrySecData = async (req, res) => {
  try {
    const { id } = req.params;
    let { type, heading, category, subHeading, card } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files); 

    // Parse card if sent as a string (from form-data)
    if (typeof card === 'string') {
      card = JSON.parse(card);
    }

    // Find the existing document
    const industrySecData = await IndustrySecData.findById(id);
    if (!industrySecData) {
      return res.status(404).json({ error: 'Industry section data not found' });
    }

    // Update fields if provided
    if (type) industrySecData.type = type;
    if (heading) industrySecData.heading = heading;
    if (category) industrySecData.category = category;
    if (subHeading) industrySecData.subHeading = subHeading;

    // Handle card updates
    if (card && Array.isArray(card)) {
      const files = req.files || {};

      const updatedCard = card.map((cardItem, index) => {
        const fileField = `card[${index}][photo]`;
        const file = files[fileField]?.[0];
        const photo = file ? file.filename : cardItem.photo || '';

        return {
          photo,
          title: cardItem.title || cardItem.cardInfo || '', // Use cardInfo as title if title not provided
          details: cardItem.details || '', // Keep details separate, or use cardInfo if needed
          altName: cardItem.altName || cardItem.altImg || '',
          imgTitle: cardItem.imgTitle || '',
        };
      });
      industrySecData.card = updatedCard;
    }

    industrySecData.updatedAt = Date.now();

    await industrySecData.save();

    res.status(200).json({ message: 'Industry section data updated', data: industrySecData });
  } catch (error) {
    console.error('Error in updateIndustrySecData:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all IndustrySecData entries
const getAllIndustrySecData = async (req, res) => {
  try {
    const data = await IndustrySecData.find().populate('category');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Get a single IndustrySecData entry by ID
const getIndustrySecDataById = async (req, res) => {
  try {
    const data = await IndustrySecData.findById(req.params.id).populate('category');
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Delete an IndustrySecData entry by ID
const deleteIndustrySecData = async (req, res) => {
  try {
    const deletedData = await IndustrySecData.findByIdAndDelete(req.params.id);
    if (!deletedData) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error: error.message });
  }
};

// Get IndustrySecData entries by category slug
const getDataByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params; // or req.query.slug if passed as query parameter

    const data = await IndustrySecData.find()
      .populate({
        path: 'category',
        match: { slug: slug }
      });

    // Filter out documents where category is null (no match found)
    const filteredData = data.filter(item => item.category !== null);

    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

module.exports = {
  createIndustrySecData,
  getAllIndustrySecData,
  getIndustrySecDataById,
  updateIndustrySecData,
  deleteIndustrySecData,
  getDataByCategorySlug
};