const ServiceImage = require('../model/serviceImages'); // Assuming this is your model path
const ServiceCategory = require('../model/serviceCategory'); // Ensure you have the ServiceCategory model imported
const path = require('path');
const fs = require('fs');

// Get all images with category names, filter by categoryId, photoType, and headingType if provided
exports.getAllImages = async (req, res) => {
    try {
        const { categoryId, photoType } = req.query; // Get categoryId and photoType from query params
        const filter = { headingType: 'main' }; // Add headingType filter by default

        if (photoType) {
            filter.photoType = photoType;
        }

        if (categoryId) {
            filter.categoryId = { $in: categoryId.split(',') }; // Handle multiple category IDs if they are comma-separated
        }

        // Fetch the images based on the filter and populate the categoryId field
        const images = await ServiceImage.find(filter).populate('categoryId', 'category');

        // Map over images to include the categoryName in the response
        const galleryWithCategoryNames = images.map(image => ({
            ...image.toJSON(),
            categoryName: image.categoryId.length ? image.categoryId.map(cat => cat.category).join(', ') : "Uncategorized"
        }));

        res.status(200).json(galleryWithCategoryNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get all images filtered by subcategoryId and include subcategory names
exports.getAllSubImages = async (req, res) => {
    try {
        const { subcategoryId, photoType } = req.query; // Get query params
        const filter = { headingType: 'sub' }; // Default filter for headingType

        if (photoType) {
            filter.photoType = photoType;
        }

        if (subcategoryId) {
            filter.subcategory = { $in: subcategoryId.split(',') }; // Handle multiple subcategory IDs
        }

        // Fetch the images based on the filter and populate the subcategory field
        const images = await ServiceImage.find(filter)
            .populate({
                path: 'subcategory', // Populate subcategory field
                select: 'category subCategories', // Include subCategories if needed
                populate: {
                    path: 'subCategories.subSubCategory', // Populate nested subSubCategory field if needed
                    select: 'category'
                }
            });

        // Map over images to include the subcategoryName in the response
        const galleryWithNames = images.map(image => ({
            ...image.toJSON(),
            subcategoryName: image.subcategory ? image.subcategory.category : "Uncategorized"
        }));

        res.status(200).json(galleryWithNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all images filtered by subsubcategoryId, and include details for subcategory and subsubcategory
exports.getAllSubSubImages = async (req, res) => {
    try {
        const { subsubcategoryId, photoType } = req.query; // Get query params
        const filter = { headingType: 'subsub' }; // Default filter for headingType

        if (photoType) {
            filter.photoType = photoType;
        }

        if (subsubcategoryId) {
            filter.subsubcategory = { $in: subsubcategoryId.split(',') }; // Handle multiple subsubcategory IDs
        }

        // Fetch the images based on the filter and populate the fields
        const images = await ServiceImage.find(filter)
            .populate({
                path: 'subcategory', // Populate subcategory field
                select: 'category subCategories', // Include subCategories
                populate: {
                    path: 'subCategories.subSubCategory', // Populate nested subSubCategory field
                    select: 'category' // Select fields to include
                }
            })
            .populate({
                path: 'subsubcategory', // Populate subsubcategory field
                select: 'category' // Select fields to include
            });

        // Map over images to include the subcategoryName and subsubcategoryName in the response
        const galleryWithNames = images.map(image => ({
            ...image.toJSON(),
            subcategoryName: image.subcategory ? image.subcategory.category : "Uncategorized",
            subsubcategoryName: image.subsubcategory ? image.subsubcategory.category : "Uncategorized"
        }));

        res.status(200).json(galleryWithNames);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




exports.getAllImagesSlug = async (req, res) => {
    try {
        const { slug, photoType } = req.params; // Extract from URL params
        console.log("Received parameters:", { slug, photoType });

        // Create filter object based on provided parameters
        const filter = {};
        if (photoType) {
            filter.photoType = photoType;
        }
        if (slug) {
            filter.slug = slug;
        }

        // Fetch images based on the filter
        const images = await ServiceImage.find(filter).populate('categoryId', 'category');

        // Format the images to include category names
        const galleryWithCategoryNames = images.map(image => ({
            ...image.toJSON(),
            categoryName: image.categoryId.length ? image.categoryId.map(cat => cat.category).join(', ') : "Uncategorized"
        }));

        // Respond with the formatted image data
        res.status(200).json(galleryWithCategoryNames);
    } catch (err) {
        console.error("Error retrieving images:", err);
        res.status(500).json({ message: err.message });
    }
};




exports.addNewImage = async (req, res) => {
    try {
        console.log(req.body.categoryId);
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const image = req.file.filename;
        const alt = req.body.alt;
        const imgtitle = req.body.imgtitle;
        const categoryId = req.body.categoryId; // Expecting an array of category IDs
        const photoType = req.body.photoType; // Expecting the photo type

        // Validate photoType and categoryId
        if (!['project', 'company'].includes(photoType)) {
            return res.status(400).json({ message: 'Invalid photoType' });
        }

        // Fetch the category and get the slug
        const category = await ServiceCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Extract the slug from the category
        const slug = category.slug;
       const  headingType = 'main'; // Mark this as a sub-sub-service

        // Create a new ServiceImage with the slug field
        const newImage = new ServiceImage({ images: image, alt,imgtitle, categoryId, photoType, slug ,headingType});
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', image, alt,imgtitle, categoryId, photoType, slug });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addNewSubImage = async (req, res) => {
    try {
        console.log(req.body.subcategoryId);
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const image = req.file.filename;
        const alt = req.body.alt;
        const imgtitle = req.body.imgtitle;
        const subcategoryId = req.body.subcategoryId; // Expecting the subcategory ID
        const photoType = req.body.photoType; // Expecting the photo type
        const categoryId = req.body.categoryId; // Expecting the category ID

        // Validate photoType
        if (!['project', 'company'].includes(photoType)) {
            return res.status(400).json({ message: 'Invalid photoType' });
        }

        // Fetch the category by ID
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
        const slug = subcategory.slug;
        const  headingType = 'sub'; // Mark this as a sub-sub-service

        // Create a new ServiceImage with the categoryId and subcategoryId fields
        const newImage = new ServiceImage({
            images: image,
            alt,
            imgtitle,
            categoryId,        // Store category ID
            subcategory,      // Store subcategory ID
            photoType,
            headingType,
            slug
        });
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', image, alt, imgtitle, categoryId, subcategoryId, photoType, slug });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.addNewSubSubImage = async (req, res) => {
    try {
        console.log(req.body.subsubcategoryId);
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const image = req.file.filename;
        const alt = req.body.alt;
        const imgtitle = req.body.imgtitle;
        const subsubcategoryId = req.body.subsubcategoryId; // Expecting the sub-subcategory ID
        const subcategoryId = req.body.subcategoryId; // Expecting the subcategory ID
        const categoryId = req.body.categoryId; // Expecting the category ID
        const photoType = req.body.photoType; // Expecting the photo type

        // Validate photoType
        if (!['project', 'company'].includes(photoType)) {
            return res.status(400).json({ message: 'Invalid photoType' });
        }

        // Fetch the category by ID
        const category = await ServiceCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Find the subcategory within the category's subCategories array
        const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found in the specified category' });
        }

           // Find the sub-subcategory within the subcategory's subSubCategories array
    const subsubcategory = subcategory.subSubCategory.find(subSub => subSub._id.toString() === subsubcategoryId);

    if (!subsubcategory) {
      return res.status(404).json({ message: 'Sub-subcategory not found in the specified subcategory' });
    }


        // Extract the slug from the sub-subcategory
        const slug = subsubcategory.slug;
        const  headingType = 'subsub'; // Mark this as a sub-sub-service

        // Create a new ServiceImage with the categoryId, subcategoryId, and subsubcategoryId fields
        const newImage = new ServiceImage({
            images: image,
            alt,
            imgtitle,
            categoryId,        // Store category ID
            subcategory,      // Store subcategory ID
            subsubcategory,   // Store sub-subcategory ID
            photoType,
            headingType,
            slug
        });
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', image, alt, imgtitle, categoryId, subcategoryId, subsubcategoryId, photoType, slug });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Delete an image
exports.deleteImage = async (req, res) => {
    try {
        const { id, categoryId, photoType } = req.query; // Get categoryId and photoType from query params
        const image = await ServiceImage.findById(id);

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Optionally check if image belongs to the specified categoryId and photoType before deletion
        if (categoryId && !image.categoryId.includes(categoryId)) {
            return res.status(403).json({ message: 'Forbidden: Image does not belong to the specified category' });
        }

        if (photoType && image.photoType !== photoType) {
            return res.status(403).json({ message: 'Forbidden: Image does not match the specified photo type' });
        }

        const filePath = path.join(__dirname, '../uploads', image.images);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.warn(`File not found: ${image.images}`);
        }

        await ServiceImage.findByIdAndDelete(id);
        res.status(200).json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single image by ID
exports.getSingleImage = async (req, res) => {
    const { id, categoryId, photoType } = req.query; // Get categoryId and photoType from query params

    try {
        const image = await ServiceImage.findById(id).populate('categoryId', 'category'); // Populate to get category names

        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

     

        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.getAllPackagesFront = async (req, res) => {
    try {
      // Fetch all categories
      const categories = await ServiceCategory.find();
  
      if (!categories.length) {
        return res.status(404).json({ message: 'No categories found' });
      }
  
      // Initialize an object to hold the final structure
      const result = {};
  
      // Process each category
      for (const category of categories) {
        const categoryName = category.category;
        result[categoryName] = { images: [] };
  
        // Find images related to the category
        const images = await ServiceImage.find({
          categoryId: category._id, // Ensure you have this field in ServiceImage
          photoType: 'project'
        });
  
        if (images.length > 0) {
          result[categoryName].images = images.map(image => image); // Assuming the image has a 'url' field
        }
      }
  
      // Calculate the total number of images
      const totalImages = Object.values(result).reduce((total, cat) => total + cat.images.length, 0);
  
      res.status(200).json({
        data: result,
        total: totalImages,
      });
  
    } catch (error) {
      console.error("Error retrieving packages:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

  exports.getAllCompanyImages = async (req, res) => {
    try {
      // Fetch all images where the photoType is 'company'
      const companyImages = await ServiceImage.find({
        photoType: 'company'
      });
  
    //   if (!companyImages.length) {
    //     return res.status(404).json({ message: 'No company images found' });
    //   }
  
      // Calculate the total number of company images
      const totalImages = companyImages.length;
  
      res.status(200).json({
        data: companyImages,
        total: totalImages,
      });
  
    } catch (error) {
      console.error("Error retrieving company images:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// Download an image
exports.downloadImage = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if the file exists before attempting to download
    fs.stat(filePath, (err, stats) => {
        if (err) {
            console.error('File not found:', err);
            return res.status(404).json({ message: 'File not found' });
        }

        // Send the file for download
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).json({ message: 'File download failed' });
            }
        });
    });
};



// Update an image
exports.updateImage = async (req, res) => {
    try {
        const { id } = req.query;
        const { alt, imgtitle, photoType } = req.body;
        let images;

        // Validate photoType
        if (photoType && !['project', 'company'].includes(photoType)) {
            return res.status(400).json({ message: 'Invalid photoType' });
        }

        // Check if a new image is uploaded
        if (req.file) {
            images = req.file.filename; // Use the new image file name
        }

        const updateData = {
            alt,
            imgtitle,
            photoType,
        };

        // Include images only if a new file is uploaded
        if (images) {
            updateData.images = images;
        }

        const updatedImage = await ServiceImage.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.json({ message: 'Image updated successfully', updatedImage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Get gallery by ID
exports.getGalleryById = async (req, res) => {
    const { id, categoryId, photoType } = req.query; // Get categoryId and photoType from query params
    try {
        // Find the gallery by id, categoryId, and photoType
        const gallery = await ServiceImage.findOne({
            _id: id,
            categoryId: categoryId,
            photoType: photoType
        }).populate('categoryId', 'category'); // Populate to get category names

        // If no gallery is found, return a 404 error
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }

        // Send the gallery document in the response
        res.json(gallery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

