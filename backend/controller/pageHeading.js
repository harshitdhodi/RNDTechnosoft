const PageHeadings = require('../model/pageHeading');

const getpageHeading = async (req, res) => {
  const pageType = req.query.pageType;

  try {
    const pageHeading = await PageHeadings.findOne({ pageType: pageType });
    if (pageHeading) {
      res.status(200).json({ heading: pageHeading.heading, subheading: pageHeading.subheading,photo:pageHeading.photo,alt:pageHeading.alt,imgTitle:pageHeading.imgTitle });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving page heading' });
  }
}

const deletePageHeading = async (req, res) => {
  const { id } = req.query;

  try {
    const deletedPage = await PageHeadings.findByIdAndDelete(id);

    if (!deletedPage) {
      return res.status(404).json({ message: 'Page heading not found' });
    }

    res.status(200).json({ message: 'Page heading deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting page heading' });
  }
};


const getAllPageHeadings = async (req, res) => {
  try {


    const total = await PageHeadings.countDocuments();
    const pageHeadings = await PageHeadings.find();

    res.status(200).json({
      message: "Page headings fetched successfully",
      data: pageHeadings,
      
    });
  } catch (err) {
    console.error("Error retrieving all page headings:", err);
    res.status(500).json({ message: "Error retrieving page headings" });
  }
};



const updatePageHeading = async (req, res) => {
  const pageType = req.query.pageType;
  const { heading, subheading, alt, imgTitle } = req.body;
  let photo;

  // Check if a new file was uploaded
  if (req.file) {
    photo = req.file.filename; // multer sets the uploaded file to req.file
  }

  try {
    // Find the page heading by pageType
    console.log("trying to find page heading");
    let pageHeading = await PageHeadings.findOne({ pageType });
    console.log("found");
    if (!pageHeading) {
      // If no page heading exists for the given pageType, create a new one
      pageHeading = new PageHeadings({
        pageType,
        heading,
        subheading,
        alt,
        imgTitle,
        photo: photo || '', // Set photo only if it's uploaded
      });
      console.log("creating new page heading");
      await pageHeading.save();

      return res.status(201).json({
        message: `Page heading created for ${pageType}`,
        heading: pageHeading.heading,
        subheading: pageHeading.subheading,
        photo: pageHeading.photo,
        alt: pageHeading.alt,
        imgTitle: pageHeading.imgTitle,
      });
    }

    // Update existing page heading
    if (heading) pageHeading.heading = heading;
    if (subheading) pageHeading.subheading = subheading;
    if (alt) pageHeading.alt = alt;
    if (imgTitle) pageHeading.imgTitle = imgTitle; 

    // If a new photo was uploaded, update the photo field
    if (photo) {
      pageHeading.photo = photo;
    }

    await pageHeading.save();

    res.status(200).json({
      message: `Page heading updated for ${pageType}`,
      heading: pageHeading.heading,
      subheading: pageHeading.subheading,
      alt: pageHeading.alt,
      imgTitle: pageHeading.imgTitle,
      photo: pageHeading.photo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating page heading' });
  }
};

const addPageHeading = async (req, res) => {
  const { pageType, heading, subheading, alt, imgTitle } = req.body;
  let photo;

  // Handle image upload via multer
  if (req.file) {
    photo = req.file.filename;
  }

  try {
    // Check if a page heading with the same pageType already exists
    const existing = await PageHeadings.findOne({ pageType });
    if (existing) {
      return res.status(400).json({
        message: `Page heading for '${pageType}' already exists. Use update endpoint instead.`,
      });
    }

    const newPageHeading = new PageHeadings({
      pageType,
      heading,
      subheading,
      alt,
      imgTitle,
      photo: photo || '',
    });

    await newPageHeading.save();

    res.status(201).json({
      message: `Page heading created successfully for ${pageType}`,
      data: newPageHeading,
    });
  } catch (err) {
    console.error("Error creating page heading:", err);
    res.status(500).json({ message: "Error creating page heading" });
  }
};

const getPageHeadingById = async (req, res) => {
  try {
    const { id } = req.params;

    const pageHeading = await PageHeadings.findById(id);

    if (!pageHeading) {
      return res.status(404).json({ message: "Page heading not found" });
    }

    res.status(200).json({
      message: "Page heading fetched successfully",
      data: pageHeading,
    });
  } catch (err) {
    console.error("Error retrieving page heading by ID:", err);
    res.status(500).json({ message: "Error retrieving page heading" });
  }
};

const updatePageHeadingById = async (req, res) => {
  const { id } = req.params;
  const { heading, subheading, alt, imgTitle } = req.body;
  let photo;

  // Check if a new image was uploaded
  if (req.file) {
    photo = req.file.filename; // Multer saves uploaded file to req.file
  }

  try {
    const pageHeading = await PageHeadings.findById(id);

    if (!pageHeading) {
      return res.status(404).json({ message: "Page heading not found" });
    }

    // Update fields only if they are provided
    if (heading) pageHeading.heading = heading;
    if (subheading) pageHeading.subheading = subheading;
    if (alt) pageHeading.alt = alt;
    if (imgTitle) pageHeading.imgTitle = imgTitle;
    if (photo) pageHeading.photo = photo;

    await pageHeading.save();

    res.status(200).json({
      message: `Page heading updated successfully for ID: ${id}`,
      data: pageHeading,
    });
  } catch (err) {
    console.error("Error updating page heading by ID:", err);
    res.status(500).json({ message: "Error updating page heading" });
  } 
};
module.exports = { getpageHeading,addPageHeading,updatePageHeadingById,deletePageHeading, updatePageHeading ,getPageHeadingById ,getAllPageHeadings };