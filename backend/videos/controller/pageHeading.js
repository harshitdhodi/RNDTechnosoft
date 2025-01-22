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

const updatePageHeading = async (req, res) => {
  const pageType = req.query.pageType;
  const { heading, subheading,alt,imgTitle } = req.body;
  let photo;

  // Check if a new file was uploaded
  if (req.file) {
    photo = req.file.filename; // multer sets the uploaded file to req.file
  }

  try {
    // Find the page heading by pageType
    let pageHeading = await PageHeadings.findOne({ pageType });

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
    console.error(err);
    res.status(500).json({ message: 'Error updating page heading' });
  }
};




module.exports = { getpageHeading, updatePageHeading };