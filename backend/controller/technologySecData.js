const TechnologySecData = require('../model/technologySecData'); // Adjust path to your model file

const createTechnologySecData = async (req, res) => {
  try {
    const { type, heading, technologyId } = req.body;

    const updatedCard = [];
    const maxCards = 10;

    console.log('Received body:', req.body);

    for (let i = 0; i < maxCards; i++) {
      const heading = req.body[`card[${i}][heading]`] || req.body[`card[${i}]heading`];
      const subHeading = req.body[`card[${i}][subHeading]`] || req.body[`card[${i}]subHeading`] || ''; // Fallback to empty string
      const altName = req.body[`card[${i}][altName]`] || '';
      const imgTitle = req.body[`card[${i}][imgTitle]`] || '';
      const photoFile = req.body[`card[${i}][photo]`] ? req.body[`card[${i}][photo]`][0] : ''; // Handle photo as array

      if (heading) { // Only require heading, since subHeading is not provided
        updatedCard.push({
          heading,
          subHeading,
          altName,
          imgTitle,
          photo: photoFile || ''
        });
      }
    }

    if (!type || !heading || !technologyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTechSecData = new TechnologySecData({
      type,
      heading,
      technologyId,
      card: updatedCard
    });

    await newTechSecData.save();

    res.status(201).json({ message: "Technology section data created", data: newTechSecData });
  } catch (error) {
    console.error("Error in createTechnologySecData:", error);
    res.status(500).json({ error: error.message });
  }
};


// Update a TechnologySecData entry by ID
const updateTechnologySecData = async (req, res) => {
  try {
    const { id } = req.params;
    let { type, heading, technologyId } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Log specific card fields to debug
    console.log('card[0][heading]:', req.body['card[0][heading]']);
    console.log('card[1][heading]:', req.body['card[1][heading]']);

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
    const files = req.files || {};
    const cardCount = Object.keys(req.body).filter(key => key.match(/card\[\d+\]\[heading\]/)).length;

    if (cardCount > 0) {
      const updatedCard = Array.from({ length: cardCount }, (_, index) => {
        const fileField = `card[${index}][photo]`;
        const file = files[fileField]?.[0];

        // Extract fields from req.body in the same format as photo
        const cardHeading = Array.isArray(req.body[`card[${index}][heading]`])
          ? req.body[`card[${index}][heading]`][0] || techSecData.card[index]?.heading || ''
          : req.body[`card[${index}][heading]`] || techSecData.card[index]?.heading || '';
        const cardSubHeading = Array.isArray(req.body[`card[${index}][subHeading]`])
          ? req.body[`card[${index}][subHeading]`][0] || techSecData.card[index]?.subHeading || ''
          : req.body[`card[${index}][subHeading]`] || techSecData.card[index]?.subHeading || '';
        const cardAltName = Array.isArray(req.body[`card[${index}][altName]`])
          ? req.body[`card[${index}][altName]`][0] || techSecData.card[index]?.altName || ''
          : req.body[`card[${index}][altName]`] || techSecData.card[index]?.altName || '';
        const cardImgTitle = Array.isArray(req.body[`card[${index}][imgTitle]`])
          ? req.body[`card[${index}][imgTitle]`][0] || techSecData.card[index]?.imgTitle || ''
          : req.body[`card[${index}][imgTitle]`] || techSecData.card[index]?.imgTitle || '';

        // Extract photo: prefer uploaded file, else existing photo
        const photo = file ? file.filename : techSecData.card[index]?.photo || '';

        // Optional validation: uncomment if fields are required
        /*
        if (!cardHeading || !cardSubHeading || !cardAltName || !cardImgTitle) {
          throw new Error(`Missing required fields in card[${index}]`);
        }
        */

        return {
          photo,
          heading: cardHeading,
          subHeading: cardSubHeading,
          altName: cardAltName,
          imgTitle: cardImgTitle,
        };
      });

      console.log('Updated card array:', updatedCard);
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