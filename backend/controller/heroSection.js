const HeroSection = require('../model/heroSection'); // Adjust the path as necessary
const ServiceCategory = require('../model/serviceCategory'); // Import the ServiceCategory model

// Get HeroSection by category ID
const mongoose = require('mongoose'); // Make sure this is imported

const getHeroSectionByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    // Query the database
    const heroSection = await HeroSection.findOne({
      'category.$oid': categoryId // Try to query with the nested $oid structure first
    }).populate('category');

    // If not found, try the standard ObjectId query
    if (!heroSection) {
      const heroSectionAlt = await HeroSection.findOne({
        category: mongoose.Types.ObjectId(categoryId)
      }).populate('category');
      
      if (!heroSectionAlt) {
        return res.status(404).json({ message: 'Hero section not found' });
      }
      
      return res.status(200).json({
        _id: heroSectionAlt._id,
        heading: heroSectionAlt.heading,
        subheading: heroSectionAlt.subheading,
        title: heroSectionAlt.title,
        category: heroSectionAlt.category,
        headingType: heroSectionAlt.headingType,
        slug: heroSectionAlt.slug,
        isVisible: heroSectionAlt.isVisible,
        createdAt: heroSectionAlt.createdAt
      });
    }

    return res.status(200).json({
      _id: heroSection._id,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      title: heroSection.title,
      category: heroSection.category,
      headingType: heroSection.headingType,
      slug: heroSection.slug,
      isVisible: heroSection.isVisible,
      createdAt: heroSection.createdAt
    });
  } catch (err) {
    console.error('Error retrieving hero section:', err);
    return res.status(500).json({ 
      message: 'Error retrieving hero section',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get HeroSection by category ID
const getHeroSectionByCategorySub = async (req, res) => {
  const { categoryId, subcategoryId } = req.params;
  console.log(categoryId, subcategoryId);

  try {
    // Validate both IDs
    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // First try with the $oid structure
    let heroSection = await HeroSection.findOne({
      'category.$oid': categoryId,
      'subcategory.$oid': subcategoryId
    }).populate('category subcategory');

    // If not found, try standard ObjectId query
    if (!heroSection) {
      heroSection = await HeroSection.findOne({
        category: mongoose.Types.ObjectId(categoryId),
        subcategory: mongoose.Types.ObjectId(subcategoryId)
      }).populate('category subcategory');
    }

    if (!heroSection) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    return res.status(200).json({
      _id: heroSection._id,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      title: heroSection.title,
      category: heroSection.category,
      subcategory: heroSection.subcategory,
      headingType: heroSection.headingType,
      slug: heroSection.slug,
      isVisible: heroSection.isVisible,
      createdAt: heroSection.createdAt
    });
  } catch (err) {
    console.error('Error retrieving hero section:', err);
    return res.status(500).json({ 
      message: 'Error retrieving hero section',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
// Get HeroSection by category ID, subcategory ID, and subsubcategory ID
const getHeroSectionByCategorySubSub = async (req, res) => {
  const { categoryId, subcategoryId, subsubcategoryId } = req.params;
  console.log(categoryId, subcategoryId, subsubcategoryId);

  try {
    // Validate all IDs
    if (!mongoose.Types.ObjectId.isValid(categoryId) || 
        !mongoose.Types.ObjectId.isValid(subcategoryId) ||
        !mongoose.Types.ObjectId.isValid(subsubcategoryId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // First try with the $oid structure
    let heroSection = await HeroSection.findOne({
      'category.$oid': categoryId,
      'subcategory.$oid': subcategoryId,
      'subsubcategory.$oid': subsubcategoryId
    }).populate('category subcategory subsubcategory');

    // If not found, try standard ObjectId query
    if (!heroSection) {
      heroSection = await HeroSection.findOne({
        category: mongoose.Types.ObjectId(categoryId),
        subcategory: mongoose.Types.ObjectId(subcategoryId),
        subsubcategory: mongoose.Types.ObjectId(subsubcategoryId)
      }).populate('category subcategory subsubcategory');
    }

    if (!heroSection) {
      return res.status(404).json({ message: 'Hero section not found' });
    }

    return res.status(200).json({
      _id: heroSection._id,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      title: heroSection.title,
      category: heroSection.category,
      subcategory: heroSection.subcategory,
      subsubcategory: heroSection.subsubcategory,
      headingType: heroSection.headingType,
      slug: heroSection.slug,
      isVisible: heroSection.isVisible,
      createdAt: heroSection.createdAt
    });
  } catch (err) {
    console.error('Error retrieving hero section:', err);
    return res.status(500).json({ 
      message: 'Error retrieving hero section',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
        title:heroSection.title,
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
  const { heading, subheading, title} = req.body;

  try {
    // Find the category in the ServiceCategory schema using the categoryId
    const category = await ServiceCategory.findById(categoryId);

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
        heading: heading,
        subheading: subheading,
        title:title,
        category: categoryId,
        slug: slug, // Store the slug from the category
        headingType:  'main', // Default to 'main' if not provided
      });
      await heroSection.save();
      return res.status(201).json({
        message: `Hero section created for category ${categoryId}`,
        heading: heroSection.heading,
        subheading: heroSection.subheading,
        title:heroSection.title,
        slug: heroSection.slug,
        headingType: heroSection.headingType,
      });
    }

    // Update existing HeroSection
    if (heading) heroSection.heading = heading;
    if (subheading) heroSection.subheading = subheading;
    if (title) heroSection.title = title;
    heroSection.headingType =  'main'; // Default to 'main' if not provided
    heroSection.slug = slug; // Update the slug from the category
console.log(heroSection)
    await heroSection.save();
    res.status(200).json({
      message: `Hero section updated for category ${categoryId}`,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
      title: heroSection.title,
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
  const { heading, subheading, title } = req.body;

  try {
    // Find the category in the ServiceCategory schema using the categoryId
    const category = await ServiceCategory.findById(categoryId);
    
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
      if (title) existingHeroSection.title = title;
      existingHeroSection.headingType = 'sub'; // Default to 'sub' if not provided
      existingHeroSection.slug = slug; // Update the slug based on subcategory

      await existingHeroSection.save();
      return res.status(200).json({
        message: `Hero section updated for category ${categoryId} and subcategory ${subcategoryId || 'N/A'}`,
        heading: existingHeroSection.heading,
        title: existingHeroSection.title,
        subheading: existingHeroSection.subheading,
        slug: existingHeroSection.slug,
        headingType: existingHeroSection.headingType,
      });
    } else {
      // Create a new HeroSection if it doesn't exist
      const newHeroSection = new HeroSection({
        heading: heading,
        subheading: subheading ,
        category: categoryId,
        subcategory: subcategoryId,
        slug: slug, 
        headingType: 'sub', 
      });

      await newHeroSection.save();
      return res.status(201).json({
        message: `Hero section created for category ${categoryId} and subcategory ${subcategoryId || 'N/A'}`,
        heading: newHeroSection.heading,
        subheading: newHeroSection.subheading,
        title: newHeroSection.title,
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
  const { heading, subheading, title } = req.body;

  try {
    // Find the category in the ServiceCategory schema using the categoryId
    const category = await ServiceCategory.findById(categoryId);

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
          heading: heading ,
          subheading: subheading ,
          title: title ,
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
      title: heroSection.title,
      slug: heroSection.slug,
      headingType: heroSection.headingType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error upserting hero section' });
  }
};

const normalizeHeroSectionIds = async (req, res) => {
  try {
    const heroSections = await HeroSection.find().lean(); // return plain JS objects

    const formatted = heroSections.map(doc => ({
      _id: doc._id,
      heading: doc.heading,
      subheading: doc.subheading,
      title: doc.title,
      category: doc.category?.toString(), // Flatten ObjectId
      subcategory: doc.subcategory?.toString(),
      subsubcategory: doc.subsubcategory?.toString(),
      slug: doc.slug,
      isVisible: doc.isVisible,
      headingType: doc.headingType,
      createdAt: doc.createdAt,
      __v: doc.__v,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching HeroSections:', error);
    res.status(500).json({ message: 'Failed to fetch data', error });
  }
}; 


module.exports = { upsertHeroSectionSubSub,normalizeHeroSectionIds,getHeroSectionByCategory,getHeroSectionByCategorySub,getHeroSectionByCategorySubSub,upsertHeroSectionSub, upsertHeroSection ,getHeroSectionBySlug};
