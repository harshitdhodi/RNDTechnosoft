const PorfolioCategory = require("../model/portfoliocategory") 

exports.getAll = async (req, res) => {
    try {
      const categories = await PorfolioCategory.find().select('category -_id');
      
      // Map to get an array of category names
      const categoryNames = categories.map(cat => cat.category);
  
      res.status(200).json(categoryNames);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  exports.getwork = async (req, res) => {
    try {
      // Find and limit the result to 5 categories, selecting category and photo fields
      const categories = await PorfolioCategory.find()
        .select('category photo _id alt imgtitle slug')
      
      // Map to get an array of objects with category names and photos
      const categoryDetails = categories.map(cat => ({
        name: cat.category,
        photo: cat.photo,
        alt: cat.alt,
        imgtitle: cat.imgtitle,
        slug: cat.slug,
      }));
  
      res.status(200).json(categoryDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

  exports.getImage = async (req, res) => {
    try {
      // Extract the slug from the request query
      const { slug } = req.params;
  
      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });
      }
  
      // Find the category that matches the provided slug
      const category = await PorfolioCategory.findOne({ slug })
        .select('category photo -_id alt imgtitle');
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Map to get an object with category name and photo
      const categoryDetails = {
        name: category.category,
        photo: category.photo,
        alt: category.alt,
        imgtitle: category.imgtitle,
      };
  
      res.status(200).json(categoryDetails);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  