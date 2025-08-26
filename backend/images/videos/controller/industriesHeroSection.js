const HeroSection = require('../model/industriesHeroSection'); // Adjust the path as necessary
const IndustriesCategory = require('../model/industriescategory'); // Import the IndustriesCategory model

// Get HeroSection by category ID
const getHeroSectionByCategory = async (req, res) => {
  const { categoryId } = req.params; // Get categoryId from request parameters
   console.log(categoryId)
  try {
    const heroSection = await HeroSection.findOne({ category: categoryId }).populate('category');

    if (heroSection) {
      return res.status(200).json({
        heading: heroSection.heading,
        subheading: heroSection.subheading,
        category: heroSection.category,
      });
    } else {
      return res.status(404).json({ message: 'Hero section not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving hero section' });
  }
};

// Get HeroSection by category ID
const getHeroSectionByCategorySub = async (req, res) => {
  const { categoryId, subcategoryId} = req.params; // Get categoryId from request parameters
   console.log(categoryId, subcategoryId)
  try {
    const heroSection = await HeroSection.findOne({ category: categoryId,subcategory:subcategoryId }).populate('category');
    if (heroSection) {
      return res.status(200).json({
        heading: heroSection.heading,
        subheading: heroSection.subheading,
        category: heroSection.category,
      });
    } else {
      return res.status(404).json({ message: 'Hero section not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving hero section' });
  }
};
// Get HeroSection by category ID, subcategory ID, and subsubcategory ID
const getHeroSectionByCategorySubSub = async (req, res) => {
  const { categoryId, subcategoryId, subsubcategoryId } = req.params; // Get categoryId, subcategoryId, subsubcategoryId from request parameters
  console.log(categoryId, subcategoryId, subsubcategoryId);

  try {
    // Find the hero section that matches the category, subcategory, and subsubcategory
    const heroSection = await HeroSection.findOne({
      category: categoryId,
      subcategory: subcategoryId,
      subsubcategory: subsubcategoryId, // Add subsubcategory to the query
    }).populate('category').populate('subcategory').populate('subsubcategory');

    if (heroSection) {
      return res.status(200).json({
        heading: heroSection.heading,
        subheading: heroSection.subheading,
        category: heroSection.category,
        subcategory: heroSection.subcategory,
        subsubcategory: heroSection.subsubcategory,
      });
    } else {
      return res.status(404).json({ message: 'Hero section not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving hero section' });
  }
};


const getHeroSectionBySlug = async (req, res) => {
  const { slug } = req.params; // Get slug from request parameters
 console.log(slug)
  try {
    // Find the HeroSection directly by the slug
    const heroSection = await HeroSection.findOne({slug: slug });

    if (heroSection) {
      return res.status(200).json({
        heading: heroSection.heading,
        subheading: heroSection.subheading,
      });
    } else {
      return res.status(404).json({ message: 'Hero section not found' });
    }
  } catch (err) {
    console.error("Error retrieving hero section:", err);
    res.status(500).json({ message: 'Error retrieving hero section' });
  }
};

const upsertHeroSection = async (req, res) => {
  const { categoryId } = req.params; // Extract categoryId from request parameters
  const { heading, subheading} = req.body;
  console.log(categoryId)
  try {
    // Find the category in the IndustriesCategory schema using the categoryId
    const category = await IndustriesCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Extract the slug from the category
    const slug = category.slug;

    // Search for an existing HeroSection based on the categoryId only
    let heroSection = await HeroSection.findOne({ category: categoryId });

    if (!heroSection) {
      // Create a new HeroSection if it doesn't exist
      heroSection = new HeroSection({
        heading: heading || 'Default Heading',
        subheading: subheading || 'Default Subheading',
        category: categoryId,
        slug: slug, // Store the slug from the category
        headingType:  'main', // Default to 'main' if not provided
      });
      await heroSection.save();
      return res.status(201).json({
        message: `Hero section created for category ${categoryId}`,
        heading: heroSection.heading,
        subheading: heroSection.subheading,
        slug: heroSection.slug,
        headingType: heroSection.headingType,
      });
    }

    // Update existing HeroSection
    if (heading) heroSection.heading = heading;
    if (subheading) heroSection.subheading = subheading;
    heroSection.headingType =  'main'; // Default to 'main' if not provided
    heroSection.slug = slug; // Update the slug from the category

    await heroSection.save();
    res.status(200).json({
      message: `Hero section updated for category ${categoryId}`,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      slug: heroSection.slug,
      headingType: heroSection.headingType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating hero section' });
  }
};


const upsertHeroSectionSub = async (req, res) => {
  const { categoryId, subcategoryId } = req.params; // Extract categoryId and subcategoryId from request parameters
  const { heading, subheading } = req.body;

  try {
    // Find the category in the IndustriesCategory schema using the categoryId
    const category = await IndustriesCategory.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory within the category's subCategories array
    const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found in the specified category' });
    }

    // Extract the slug from the subcategory
    const subcategorySlug = subcategory.slug;

    // Use the subcategory slug as the unique slug
    const slug = `${subcategorySlug}`;

    // Search for an existing HeroSection with the same categoryId but different subcategoryId
    const existingHeroSection = await HeroSection.findOne({
      category: categoryId,
      subcategory: subcategoryId,
    });
  console.log(existingHeroSection)
    if (existingHeroSection) {
      // Update existing HeroSection
      if (heading) existingHeroSection.heading = heading;
      if (subheading) existingHeroSection.subheading = subheading;
      existingHeroSection.headingType = 'sub'; // Default to 'sub' if not provided
      existingHeroSection.slug = slug; // Update the slug based on subcategory

      await existingHeroSection.save();
      return res.status(200).json({
        message: `Hero section updated for category ${categoryId} and subcategory ${subcategoryId || 'N/A'}`,
        heading: existingHeroSection.heading,
        subheading: existingHeroSection.subheading,
        slug: existingHeroSection.slug,
        headingType: existingHeroSection.headingType,
      });
    } else {
      // Create a new HeroSection if it doesn't exist
      const newHeroSection = new HeroSection({
        heading: heading || 'Default Heading',
        subheading: subheading || 'Default Subheading',
        category: categoryId,
        subcategory: subcategoryId,
        slug: slug, // Store the combined slug from subcategory
        headingType: 'sub', // Default to 'sub' if not provided
      });

      await newHeroSection.save();
      return res.status(201).json({
        message: `Hero section created for category ${categoryId} and subcategory ${subcategoryId || 'N/A'}`,
        heading: newHeroSection.heading,
        subheading: newHeroSection.subheading,
        slug: newHeroSection.slug,
        headingType: newHeroSection.headingType,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating or creating hero section' });
  }
};


const upsertHeroSectionSubSub = async (req, res) => {
  const { categoryId, subcategoryId, subsubcategoryId } = req.params;
  const { heading, subheading } = req.body;

  try {
    // Find the category in the IndustriesCategory schema using the categoryId
    const category = await IndustriesCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory within the category's subCategories array
    const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found in the specified category' });
    }

    // Find the subsubcategory within the subcategory's subSubCategories array
    const subsubcategory = subcategory.subSubCategory.find(subSub => subSub._id.toString() === subsubcategoryId);

    if (!subsubcategory) {
      return res.status(404).json({ message: 'Subsubcategory not found in the specified subcategory' });
    }

    const slug = subsubcategory.slug;

    // Use findOneAndUpdate with the upsert option
    const heroSection = await HeroSection.findOneAndUpdate(
      {
        category: categoryId,
        subcategory: subcategoryId,
        subsubcategory: subsubcategoryId,
      },
      {
        $set: {
          heading: heading || 'Default Heading',
          subheading: subheading || 'Default Subheading',
          headingType: 'subsub',
          slug: slug,
        },
      },
      { upsert: true, new: true } // Create a new document if it doesn't exist, and return the new document
    );

    res.status(200).json({
      message: `Hero section upserted for category ${categoryId}, subcategory ${subcategoryId}, and subsubcategory ${subsubcategoryId}`,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      slug: heroSection.slug,
      headingType: heroSection.headingType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error upserting hero section' });
  }
};




module.exports = { upsertHeroSectionSubSub,getHeroSectionByCategory,getHeroSectionByCategorySub,getHeroSectionByCategorySubSub,upsertHeroSectionSub, upsertHeroSection ,getHeroSectionBySlug};
