const Portfolio = require("../model/portfolio");
const PortfolioCategory = require("../model/portfoliocategory")
const ServiceCategory = require("../model/serviceCategory")
const path = require('path')
const fs = require('fs')


const insertPortfolio = async (req, res) => {
  try {

    const { title, details, status, alt, imgtitle, slug, categories, subcategories, subSubcategories, servicecategories, servicesubcategories, servicesubSubcategories} = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];

    const Portfolios = new Portfolio({
      title,
      details,
      photo,
      imgtitle,
      status,
      slug,
      status,
      alt,
      categories,
      subcategories,
      subSubcategories,
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    });

    await Portfolios.save();
    res.send(Portfolios);
  } catch (err) {
    console.error("Error inserting Portfolio:", err);
    res.status(400).send(err);
  }
}

const getPortfolio = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await Portfolio.countDocuments();
    
    // Fetching the portfolio items with pagination
    const portfolio = await Portfolio.find()
      .skip((page - 1) * limit)
      .limit(limit);

    // Using Promise.all to map over portfolio and fetch category names
    const PortfolioWithCategoryName = await Promise.all(portfolio.map(async (portfolioItem) => {
      const category = await PortfolioCategory.findOne({ '_id': portfolioItem.categories });
      const categoryName = category ? category.category : 'Uncategorized';

      return {
        ...portfolioItem.toJSON(),  // Correctly reference the individual portfolioItem
        categoryName
      };
    }));

    res.status(200).json({
      data: PortfolioWithCategoryName,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving portfolio:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};



const getPortfolioFront = async (req, res) => {
  try {
    // Fetch all Portfolio and sort by date in descending order to get the latest Portfolio first
    const portfolio = await Portfolio.find().sort({ date: -1 });

    // Map over the Portfolio and fetch the associated category and service category names
    const PortfolioWithCategoryAndService = await Promise.all(portfolio.map(async (PortfolioItem) => {
      // Fetch Portfolio category name
      const category = await PortfolioCategory.findOne({ '_id': PortfolioItem.categories });
      const categoryName = category ? category.category : 'Uncategorized';

      // Fetch service category name
      const serviceCategory = await ServiceCategory.findOne({ 'slug': PortfolioItem.servicecategories });
      const serviceCategoryName = serviceCategory ? serviceCategory.category : 'No Service Category';

      return {
        ...PortfolioItem.toJSON(),
        categoryName,
        serviceCategoryName
      };
    }));

    // Return the sorted Portfolio with category and service category names
    res.status(200).json({
      data: PortfolioWithCategoryAndService,
      total: portfolio.length
    });
  } catch (error) {
    console.error("Error retrieving Portfolio:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};

// get single details of the blog 
const getPortfolioBySlug = async (req, res) => {
  try {
    // Extract the slug from the request parameters
    const { slug } = req.params;
    // Fetch the Portfolio item by slug
    const PortfolioItem = await Portfolio.findOne({ slug: slug });

    // Check if the Portfolio item exists
    if (!PortfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Fetch the associated category name
    const category = await PortfolioCategory.findOne({ '_id': PortfolioItem.categories });
    const categoryName = category ? category.category : 'Uncategorized';

    // Fetch the associated service category name
    const serviceCategory = await ServiceCategory.findOne({ '_id': PortfolioItem.servicecategories });
    const serviceCategoryName = serviceCategory ? serviceCategory.category : 'No Service Category';

    // Return the Portfolio item with category and service category names
    res.status(200).json({
      ...PortfolioItem.toJSON(),
      categoryName,
      serviceCategoryName
    });
  } catch (error) {
    console.error("Error retrieving Portfolio:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};




const updatePortfolio = async (req, res) => {
  const { slugs } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing Portfolio item to get its current photos
    const existingPortfolio = await Portfolio.findOne({ slug: slugs });

    if (!existingPortfolio) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingPortfolio.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingPortfolio.photo; // Keep existing photos if no new photos are uploaded
    }

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug: slugs },
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPortfolio);
  } catch (error) {
    console.error("Error updating Portfolio:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const deletePortfolio = async (req, res) => {
  try {
    const { slugs } = req.query;

    const portfolio = await Portfolio.findOne({ slug: slugs });

    portfolio.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    const deletedPortfolio = await Portfolio.findOneAndDelete({ slug: slugs });

    if (!deletedPortfolio) {
      return res.status(404).send({ message: 'Portfolio not found' });
    }

    res.send({ message: "Portfolio deleted successfully" }).status(200);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}


const getPortfolioById = async (req, res) => {
  try {
    const { slugs } = req.query;

    const portfolio = await Portfolio.findOne({ slug: slugs });
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.status(200).json({ data: portfolio });
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
}

const countPortfolio = async (req, res) => {
  try {
    const count = await Portfolio.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { slugs, imageFilename, index } = req.params;


  try {

    const portfolio = await Portfolio.findOne({ slug: slugs });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Remove the photo and its alt text
    portfolio.photo = portfolio.photo.filter(photo => photo !== imageFilename);
    portfolio.alt.splice(index, 1);
    portfolio.imgtitle.splice(index, 1);

    await portfolio.save();

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCategoryPortfolio = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const portfolio = await Portfolio.find({ categories: categoryId });

    if (portfolio.length === 0) {
      return res.status(404).json({ message: 'No Portfolio found for this category' });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryPortfolio = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const portfolio = await Portfolio.find({ subcategories: subcategoryId });

    if (portfolio.length === 0) {
      return res.status(404).json({ message: 'No Portfolio found for this subcategory' });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryPortfolio = async (req, res) => {
  const { subSubcategoryId } = req.query;

  try {
    const portfolio = await Portfolio.find({ subSubcategories: subSubcategoryId });

    if (portfolio.length === 0) {
      return res.status(404).json({ message: 'No Portfolio found for this sub-subcategory' });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};





module.exports = { getPortfolioFront, getPortfolioBySlug, insertPortfolio, getPortfolio, updatePortfolio, deletePortfolio, getPortfolioById, countPortfolio, deletePhotoAndAltText, getCategoryPortfolio, getSubcategoryPortfolio, getSubSubcategoryPortfolio };
