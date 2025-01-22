const Testimonial = require('../model/testimonial');
const path=require('path')
const fs=require('fs')
const ServiceCategory = require('../model/serviceCategory')
const Package = require('../model/packages');  // Assuming you have the Package model in this path



const mongoose = require('mongoose');

const getTestimonialsPackage = async (req, res) => {
  try {
    const { slug } = req.params;

    // Step 1: Check if the slug is provided
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    // Step 2: Find the package based on slug
    const packageData = await Package.findOne({ slug });

    // Step 3: If no package is found, return 404
    if (!packageData) {
      return res.status(404).json({ message: "No package found with the provided slug" });
    }

    // Extract the category, subcategory, and sub-subcategory IDs from the package
    const { servicecategories, servicesubcategories, servicesubSubcategories } = packageData;

    // Log the IDs to check their values
    console.log("servicecategories:", servicecategories);
    console.log("servicesubcategories:", servicesubcategories);
    console.log("servicesubSubcategories:", servicesubSubcategories);

    // Step 4: Prepare query conditions based on available IDs, ignoring empty or invalid IDs
    let query = {};

    // Check and filter out any empty or falsy values
    if (Array.isArray(servicecategories) && servicecategories.filter(Boolean).length > 0) {
      query.category = { $in: servicecategories.filter(Boolean) }; // Only use valid IDs
    }

    if (Array.isArray(servicesubcategories) && servicesubcategories.filter(Boolean).length > 0) {
      query.subcategory = { $in: servicesubcategories.filter(Boolean) }; // Only use valid IDs
    }

    if (Array.isArray(servicesubSubcategories) && servicesubSubcategories.filter(Boolean).length > 0) {
      query.subsubcategory = { $in: servicesubSubcategories.filter(Boolean) }; // Only use valid IDs
    }

    // Step 5: Fetch testimonials based on the available IDs
    const testimonials = await Testimonial.find(query);

    // Step 6: If no testimonials are found, return 404
    if (testimonials.length === 0) {
      return res.status(404).json({ message: "No testimonials found for the package" });
    }

    // Step 7: Return the testimonials
    res.status(200).json({
      message: "Testimonials retrieved successfully",
      data: testimonials,
      total: testimonials.length,
    });

  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};





const insertTestimonial = async (req, res) => {
  try {
    const {
      name,
      designation,
      testimony,
      alt,
      imgtitle,
      videotitle,
      altVideo,
     categoryId,
      status,
      rating,
      description,
      priority
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : ''; // Assuming only one video file

       // Fetch the category and get the slug
       const category = await ServiceCategory.findById(categoryId);
       if (!category) {
         return res.status(404).json({ message: 'Category not found' });
       }

    // Extract the slug from the category
    const slug = category.slug;
    const testimonial = new Testimonial({
      name,
      designation,
      testimony,
      alt,
      altVideo,
      imgtitle,
      videotitle,
      photo,
      video,
      rating,
      description,
      priority,
      status,
      category: categoryId, // Assign categoryId to category field
      slug, // Store the slug in the DesignProcess model
      headingType: 'main', // Mark this as a sub-service
    });

    await testimonial.save();
    return res.status(201).send({ message: 'Data sent successfully', testimonial: testimonial });

  } catch (error) {
    console.error("Error inserting testimonial:", error);
    res.status(400).send(error);
  }
}

const insertTestimonialForSubCategory = async (req, res) => {
  try {
    const {
      name,
      designation,
      testimony,
      alt,
      imgtitle,
      videotitle,
      altVideo,
      categoryId,
      subcategoryId, // Capture subcategoryId
      status,
      rating,
      description,
      priority
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : ''; // Assuming only one video file

    // Fetch the category by ID
    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory within the category's subCategories array
    const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Extract slug from the subcategory
    const subcategorySlug = subcategory.slug;

    // Create a new Testimonial
    const testimonial = new Testimonial({
      name,
      designation,
      testimony,
      alt,
      imgtitle,
      videotitle,
      altVideo,
      photo,
      video,
      rating,
      description,
      priority,
      status,
      category: categoryId,
      subcategory: subcategoryId, // Subcategory
      slug: subcategorySlug, // Subcategory slug
      headingType: 'sub', // Sub-service type
    });

    await testimonial.save();
    return res.status(201).send({
      message: 'Testimonial created successfully for subcategory',
      testimonial,
    });
  } catch (error) {
    console.error('Error inserting testimonial for subcategory:', error);
    res.status(400).send({ message: 'Error inserting testimonial for subcategory', error });
  }
};


const insertTestimonialForSubSubCategory = async (req, res) => {
  try {
    const {
      name,
      designation,
      testimony,
      alt,
      imgtitle,
      videotitle,
      altVideo,
      categoryId,
      subcategoryId, // Capture subcategoryId
      subsubcategoryId, // Capture subsubcategoryId
      status,
      rating,
      description,
      priority
    } = req.body;

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : ''; // Assuming only one video file

    // Fetch the category by ID
    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory within the category's subCategories array
    const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Find the subsubcategory within the subcategory's subSubCategories array
    const subsubcategory = subcategory.subSubCategory.find(subsub => subsub._id.toString() === subsubcategoryId);
    if (!subsubcategory) {
      return res.status(404).json({ message: 'Subsubcategory not found' });
    }

    // Extract slug from the subsubcategory
    const subsubcategorySlug = subsubcategory.slug;

    // Create a new Testimonial
    const testimonial = new Testimonial({
      name,
      designation,
      testimony,
      alt,
      imgtitle,
      videotitle,
      altVideo,
      photo,
      video,
      rating,
      description,
      priority,
      status,
      category: categoryId,
      subcategory: subcategoryId, // Subcategory
      subsubcategory: subsubcategoryId, // Subsubcategory
      slug: subsubcategorySlug, // Subsubcategory slug
      headingType: 'subsub', // Sub-sub-service type
    });

    await testimonial.save();
    return res.status(201).send({
      message: 'Testimonial created successfully for subsubcategory',
      testimonial,
    });
  } catch (error) {
    console.error('Error inserting testimonial for subsubcategory:', error);
    res.status(400).send({ message: 'Error inserting testimonial for subsubcategory', error });
  }
};


const getTestimonials = async (req, res) => {
  try {
    const { page = 1,categoryId } = req.query;
    const limit = 5; // Number of records per page
    let query = { headingType: 'main' };

    if (categoryId) {
      query.category = categoryId;
    }

    const count = await Testimonial.countDocuments(query); // Get total count first
    const testimonials = await Testimonial.find(query)
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    res.status(200).json({
      data: testimonials,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const getTestimonialsSub = async (req, res) => {
  try {
    const { page = 1, categoryId, subcategoryId} = req.query;
    const limit = 5; // Number of records per page
    let query = { headingType: 'sub' };

    if (categoryId) {
      query.category = categoryId;
    }
    if (subcategoryId) {
      query.subcategory = subcategoryId;
    }
    const count = await Testimonial.countDocuments(query); // Get total count first
    const testimonials = await Testimonial.find(query)
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    res.status(200).json({
      data: testimonials,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const getTestimonialsSubSub = async (req, res) => {
  try {
    const { page = 1, categoryId, subcategoryId, subsubcategoryId } = req.query;
    const limit = 5; // Number of records per page

    // Build query object
    let query = { headingType: 'subsub' };

    if (categoryId) {
      query.category = categoryId;
    }

    if (subcategoryId) {
      query.subcategory = subcategoryId;
    }

    if (subsubcategoryId) {
      query.subsubcategory = subsubcategoryId;
    }

    const count = await Testimonial.countDocuments(query); // Count documents matching the query
    const testimonials = await Testimonial.find(query)
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    res.status(200).json({
      data: testimonials,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const getTestimonialRating = async (req, res) => {
  try {
    // Fetch all testimonials
    const testimonials = await Testimonial.find();

    // Calculate average rating using MongoDB's aggregation pipeline
    const result = await Testimonial.aggregate([
      {
        $group: {
          _id: null, // Group all documents together
          averageRating: { $avg: "$rating" }, // Calculate average of the "rating" field
        },
      },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;

    res.status(200).json({
      averageRating: averageRating.toFixed(1), // Return the average rating out of 5
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

const getTestimonialsFront = async (req, res) => {
  try {
    const testimonials = await Testimonial.find(); // Fetch all testimonials

    res.status(200).json({
      data: testimonials,
      total: testimonials.length, // Total number of testimonials
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

const getTestimonialsHigh = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if the slug is provided
    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    // Find all testimonials with the provided slug
    const testimonials = await Testimonial.find({ slug });

    if (testimonials.length === 0) {
      return res.status(404).json({ message: "No testimonials found with the provided slug" });
    }

    // Return the array of testimonials
    res.status(200).json({
      data: testimonials
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    let errorMessage = 'Error fetching testimonials';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};



const updateTestimonial = async (req, res) => {
  const { id } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing testimonial to get its current photos and video
    const existingTestimonial = await Testimonial.findById(id);

    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingTestimonial.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingTestimonial.photo; // Keep existing photos if no new photos are uploaded
    }

    // Process new uploaded video
    if (req.files && req.files['video'] && req.files['video'].length > 0) {
      const newVideoPath = req.files['video'][0].filename; // Assuming one video is uploaded at a time
      updateFields.video = newVideoPath;
    } else {
      updateFields.video = existingTestimonial.video; // Keep existing video if no new video is uploaded
    }

    // Handle alt text for video
    if (updateFields.altVideo === undefined) {
      updateFields.altVideo = existingTestimonial.altVideo;
    }

    // Handle video title
    if (updateFields.videotitle === undefined) {
      updateFields.videotitle = existingTestimonial.videotitle;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.query;

    const testimonial = await Testimonial.findById(id); 
    
    testimonial.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete file synchronously if it exists
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });
    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).send({ message: 'testimonials not found' });
    }
    res.send({ message: "testmonial deleted successfully" }).status(200);
  } catch (error) {
    console.error(err);
    res.status(400).send(err);
  }
}

const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.query;

    const testimonial = await Testimonial.findById(id);
  
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.status(200).json({ data: testimonial });
  } catch (error) {
   
    res.status(500).json({ message: "Server error" });
  }
}

const countTestimonial = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { id, imageFilename, index } = req.params;
  

  try {
 
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'testimonial not found' });
    }

    // Remove the photo and its alt text
    testimonial.photo = testimonial.photo.filter(photo => photo !== imageFilename);
    testimonial.alt.splice(index, 1);
    testimonial.imgtitle.splice(index, 1);
    await testimonial.save();

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


const deleteVideoAndAltText = async (req, res) => {
  const { id, videoFilename } = req.params;

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Check if the testimonial has a video and if it matches the filename
    if (testimonial.video === videoFilename) {
      testimonial.video = null; // Remove the video reference
    }

    if (testimonial.videoAlt) {
      testimonial.videoAlt = ''; // Clear the string
    }
    
    if (testimonial.videotitle) {
      testimonial.videotitle = ''; // Clear the string
    }
    await testimonial.save();

    const filePath = path.join(__dirname, '..', 'videos', videoFilename); // Adjust path to your video directory

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Video and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting video and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {getTestimonialsPackage, insertTestimonial, getTestimonialRating,getTestimonials,getTestimonialsSubSub,getTestimonialsSub, updateTestimonial, deleteTestimonial,getTestimonialsFront, getTestimonialById, countTestimonial, deletePhotoAndAltText,deleteVideoAndAltText ,getTestimonialsHigh,insertTestimonialForSubCategory,insertTestimonialForSubSubCategory};