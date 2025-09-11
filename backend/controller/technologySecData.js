const TechnologySecData = require('../model/technologySecData'); // Adjust path to your model file
const Technology = require('../model/technology'); // Adjust path to your model file
const createTechnologySecData = async (req, res) => {
  try {
    const { type, heading, technologyId } = req.body;

    // Check if a section of this type already exists for the selected technology
    const existingSection = await TechnologySecData.findOne({ 
      technologyId: technologyId,
      type: type
    });

    if (existingSection) {
      return res.status(400).json({ 
        error: `A '${type}' section already exists for the selected technology.`
      });
    }

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
    const { type, heading, technologyId } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    // Find the existing document
    const techSecData = await TechnologySecData.findById(id);
    if (!techSecData) {
      return res.status(404).json({ error: 'Technology section data not found' });
    }

    // Update top-level fields if provided
    if (type) techSecData.type = type;
    if (heading) techSecData.heading = heading;
    if (technologyId) techSecData.technologyId = technologyId;

    // Handle card updates
    const updatedCard = [];
    const maxCards = 10; // Consistent with create controller

    for (let i = 0; i < maxCards; i++) {
      const headingKey = `card[${i}][heading]`; // Standard format
      const altHeadingKey = `card[${i}]heading`; // Alternative format from create controller
      const subHeadingKey = `card[${i}][subHeading]`;
      const altSubHeadingKey = `card[${i}]subHeading`;
      const altNameKey = `card[${i}][altName]`;
      const imgTitleKey = `card[${i}][imgTitle]`;
      const photoKey = `card[${i}][photo]`;

      // Extract heading, supporting both formats
      const cardHeading = req.body[headingKey] || req.body[altHeadingKey] || techSecData.card[i]?.heading || '';
      const cardSubHeading = req.body[subHeadingKey] || req.body[altSubHeadingKey] || techSecData.card[i]?.subHeading || '';
      const cardAltName = req.body[altNameKey] || techSecData.card[i]?.altName || '';
      const cardImgTitle = req.body[imgTitleKey] || techSecData.card[i]?.imgTitle || '';
      const photo = req.files && req.files[photoKey] ? req.files[photoKey][0].filename : techSecData.card[i]?.photo || '';

      // Only include cards with a heading (consistent with create logic)
      if (cardHeading) {
        updatedCard.push({
          heading: cardHeading,
          subHeading: cardSubHeading,
          altName: cardAltName,
          imgTitle: cardImgTitle,
          photo
        });
      }
    }

    // Update card array only if there are valid updates
    if (updatedCard.length > 0) {
      techSecData.card = updatedCard;
    }

    // Set updatedAt timestamp
    techSecData.updatedAt = Date.now();

    // Save the updated document
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
    const data = await TechnologySecData.find();

    // collect unique technologyIds from your entries
    const technologyIds = [...new Set(data.map(item => item.technologyId))];

    // fetch all matching technologies
    const technologies = await Technology.find({ _id: { $in: technologyIds } })
      .select('imgTitle');

    // map for quick lookup
    const techMap = {};
    technologies.forEach(t => {
      techMap[t._id.toString()] = t;
    });

    // attach technology object to each entry
    const enrichedData = data.map(item => ({
      ...item.toObject(),
      technology: techMap[item.technologyId] || null,
    }));

    res.status(200).json(enrichedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

// Get a single TechnologySecData entry by ID
const getTechnologySecDataById = async (req, res) => {
  try {
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
    const { slug } = req.params; // Extract slug from request parameters
    const { type } = req.query; // Extract type from query parameters (e.g., ?type=developer)
    console.log("slug", slug);
    console.log("type", type);

    // Validate type if required
    if (!type) {
      return res.status(400).json({ message: 'Type parameter is required' });
    }

    // Step 1: Find the Technology document with the matching slug
    const technology = await Technology.findOne({ slug });
    console.log("technology", technology);

    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    console.log("technology._id", technology._id.toString());

    // Step 2: Find TechnologySecData documents where technologyId (string) and type match
    const data = await TechnologySecData.find({
      technologyId: technology._id.toString(),
      type: type // Match the type field
    });

    // Step 3: Manually populate technologyId with the Technology document
    const populatedData = data.map(item => ({
      ...item.toObject(), // Convert Mongoose document to plain object
      technologyId: technology // Replace technologyId string with full Technology document
    }));

    console.log("populatedData", populatedData); // Log for debugging
    res.status(200).json(populatedData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

const getDataExistsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const technology = await Technology.findOne({ slug });
    if (!technology) {
      return res.status(200).json({ exists: false });
    }

    // check existence for each type
    const hireDeveloperExists = await TechnologySecData.exists({
      technologyId: technology._id.toString(),
      type: "hire developer"
    });

    const whyChooseExists = await TechnologySecData.exists({
      technologyId: technology._id.toString(),
      type: "Why Choose"
    });

    const technologyAppExists = await TechnologySecData.exists({
      technologyId: technology._id.toString(),
      type: "Technology Application"
    });

    res.status(200).json({
      exists: hireDeveloperExists || whyChooseExists || technologyAppExists ? true : false,
      sections: {
        hireDeveloper: !!hireDeveloperExists,
        whyChoose: !!whyChooseExists,
        technologyApplication: !!technologyAppExists
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error checking data existence",
      error: error.message
    });
  }
};


module.exports = {
  createTechnologySecData,
  getAllTechnologySecData,
  getTechnologySecDataById,
  updateTechnologySecData,
  deleteTechnologySecData,
  getDataByTechnologySlug,
  getDataExistsBySlug
};