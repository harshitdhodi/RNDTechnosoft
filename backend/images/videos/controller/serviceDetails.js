const ServiceDetails = require('../model/servicedetails');
const path = require('path');
const fs = require('fs');

// Update service detail by ID and ensure categoryId is considered
const ServiceCategory = require('../model/serviceCategory'); // Import the ServiceCategory model

const getServiceDetailsByslug = async (req, res) => {
  const { slug } = req.params; // Get slug from query parameters

  try {
    // Find all service details by slug
    const serviceDetails = await ServiceDetails.find({ slug: slug })
      // Populate category field if needed

    // Return data in array form with total count
    res.status(200).json({
      data: serviceDetails,
      total: serviceDetails.length, // Total count of service details
    });
  } catch (error) {
    console.error("Error retrieving service details:", error);
    let errorMessage = 'Error fetching service details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const insertServiceDetail = async (req, res) => {
  try {
    const {
      heading,
      description,
      priority,
      questions, // Should now be an array of strings
      status,
      alt,
      altVideo,
      imgtitle, 
      videotitle, 
      categoryId,
    } = req.body;

    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    // Parse questions from string to object
    const parsedQuestions = questions.map(question => JSON.parse(question));

    // Find the category and get the slug
    const category = await ServiceCategory.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Extract the slug from the category
    const slug = category.slug;

    // Create serviceDetail with parsed questions and slug
    const serviceDetail = new ServiceDetails({
      heading,
      description,
      priority,
      questions: parsedQuestions, // Use parsed questions array
      category: categoryId,
      slug, // Store the slug from the category
      status,
      headingType :'main', // Default to 'main' if not provided

      alt,
      altVideo,
      imgtitle, 
      videotitle, 
      photo,
      video,
    });

    await serviceDetail.save();
    return res.status(201).send({ message: 'Data sent successfully', serviceDetail });
  } catch (error) {
    console.error("Error inserting service detail:", error);
    res.status(400).send(error);
  }
};

const insertSubServiceDetail = async (req, res) => {
  try {
    const {
      heading,
      description,
      priority,
      questions, // Should now be an array of strings
      status,
      alt,
      altVideo,
      imgtitle, 
      videotitle, 
      categoryId, // Main category ID
      subcategoryId, // Subcategory ID as string
    } = req.body;

    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    // Parse questions from string to object
    const parsedQuestions = questions.map(question => JSON.parse(question));

    // Find the category by ID
    const category = await ServiceCategory.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory within the category's subCategories array
    const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found in the specified category' });
    }

    // Extract slugs from both the category and subcategory
    const subcategorySlug = subcategory.slug;

    // Create sub-service detail with parsed questions, category slug, and subcategory slug
    const subServiceDetail = new ServiceDetails({
      heading,
      description,
      priority,
      questions: parsedQuestions, // Use parsed questions array
      category: categoryId,
      subcategory: subcategoryId,
      slug: `${subcategorySlug}`, // Combine slugs for uniqueness
      status,
      headingType: 'sub', // Mark this as a sub-service

      alt,
      altVideo,
      imgtitle, 
      videotitle, 
      photo,
      video,
    });

    await subServiceDetail.save();
    return res.status(201).send({ message: 'Sub-service created successfully', subServiceDetail });
  } catch (error) {
    console.error("Error inserting sub-service detail:", error);
    res.status(400).send(error);
  }
};

const insertSubSubServiceDetail = async (req, res) => {
  try {
    const {
      heading,
      description,
      priority,
      questions, // Should now be an array of strings
      status,
      alt,
      altVideo,
      imgtitle,
      videotitle,
      categoryId, // Main category ID
      subcategoryId, // Subcategory ID as string
      subsubcategoryId, // Sub-subcategory ID as string
    } = req.body;

    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    // Parse questions from strings to objects
    const parsedQuestions = questions.map(question => JSON.parse(question));

    // Find the category by ID
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

    // Extract slugs from category, subcategory, and sub-subcategory
    const subsubcategorySlug = subsubcategory.slug;

    // Create sub-service detail with parsed questions, category slug, subcategory slug, and sub-subcategory slug
    const subSubServiceDetail = new ServiceDetails({
      heading,
      description,
      priority,
      questions: parsedQuestions, // Use parsed questions array
      category: categoryId,
      subcategory: subcategoryId,
      subsubcategory: subsubcategoryId,
      slug: `${subsubcategorySlug}`, // Combine slugs for uniqueness
      status,
      headingType: 'subsub', // Mark this as a sub-sub-service

      alt,
      altVideo,
      imgtitle,
      videotitle,
      photo,
      video,
    });

    await subSubServiceDetail.save();
    return res.status(201).send({ message: 'Sub-sub-service created successfully', subSubServiceDetail });
  } catch (error) {
    console.error("Error inserting sub-sub-service detail:", error);
    res.status(400).send(error);
  }
};


// Get all service details by category with pagination
const getServiceDetailsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.query; // Get categoryId from query parameters
      const { page = 1 } = req.query; // Get the current page from query parameters
      const limit = 5; // Number of records per page
  
      // Count the documents based on the category reference
      const count = await ServiceDetails.countDocuments({ category: categoryId }); 
  
      // Find service details by category reference with pagination
      const serviceDetails = await ServiceDetails.find({ category: categoryId,headingType: 'main' })
        .populate('category') // Populate category field if needed
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        data: serviceDetails,
        total: count,
        currentPage: page,
        hasNextPage: count > page * limit
      });
    } catch (error) {
      console.error("Error retrieving service details:", error);
      let errorMessage = 'Error fetching service details';
      if (error.name === 'CastError') {
        errorMessage = 'Invalid query parameter format';
      }
      res.status(500).json({ message: errorMessage });
    }
  };
  

  // Get all service details by subcategory with pagination
const getServiceDetailsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.query; // Get subcategoryId from query parameters
    const { page = 1 } = req.query; // Get the current page from query parameters
    const limit = 5; // Number of records per page

    if (!subcategoryId) {
      return res.status(400).json({ message: 'Subcategory ID is required' });
    }

    // Count the documents based on the subcategory reference
    const count = await ServiceDetails.countDocuments({ subcategory: subcategoryId, headingType: 'sub' });

    // Find service details by subcategory reference with pagination
    const serviceDetails = await ServiceDetails.find({ subcategory: subcategoryId, headingType: 'sub' })
      .populate('category') // Populate category field if needed
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: serviceDetails,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving service details:", error);
    let errorMessage = 'Error fetching service details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

const getServiceDetailsBySubSubcategory = async (req, res) => {
  try {
    const { subsubcategoryId } = req.query; // Get subsubcategoryId from query parameters
    const { page = 1 } = req.query; // Get the current page from query parameters
    const limit = 5; // Number of records per page
    console.log("hello")
    console.log(subsubcategoryId)

    if (!subsubcategoryId) { // Corrected from subcategoryId to subsubcategoryId
      return res.status(400).json({ message: 'Subsubcategory ID is required' });
    }

    // Count the documents based on the subsubcategory reference
    const count = await ServiceDetails.countDocuments({ subsubcategory: subsubcategoryId, headingType: 'subsub' });

    // Find service details by subsubcategory reference with pagination
    const serviceDetails = await ServiceDetails.find({ subsubcategory: subsubcategoryId, headingType: 'subsub' })
      .populate('category') // Populate category field if needed
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: serviceDetails,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving service details:", error);
    let errorMessage = 'Error fetching service details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

// Update service detail by ID and ensure categoryId is considered
const updateServiceDetail = async (req, res) => {
  const { id } = req.query;
  let updateFields = req.body;
  console.log(updateFields)
  try {
    const existingServiceDetail = await ServiceDetails.findById(id);

    if (!existingServiceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }

    // If categoryId is provided, find the category and get the slug
    if (updateFields.categoryId) {
      const category = await ServiceCategory.findById(updateFields.categoryId);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Extract the slug from the category and add it to updateFields
      updateFields.slug = category.slug;
    } else {
      // If categoryId is not provided, keep the existing slug
      updateFields.slug = existingServiceDetail.slug;
    }

    // Handle photo uploads
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename);
      updateFields.photo = [...existingServiceDetail.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingServiceDetail.photo;
    }

    // Handle video upload
    if (req.files && req.files['video'] && req.files['video'].length > 0) {
      const newVideoPath = req.files['video'][0].filename;
      updateFields.video = newVideoPath;
    } else {
      updateFields.video = existingServiceDetail.video;
    }

    // Parse questions from strings to objects if questions are provided
    if (updateFields.questions) {
      updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
    } else {
      updateFields.questions = existingServiceDetail.questions;
    }

    // Handle alt text updates
    if (!updateFields.alt) {
      updateFields.alt = existingServiceDetail.alt;
    }
    // Handle alt text updates
    if (!updateFields.imgtitle) {
      updateFields.imgtitle = existingServiceDetail.imgtitle;
    }
    // Handle altVideo text updates
    if (!updateFields.altVideo) {
      updateFields.altVideo = existingServiceDetail.altVideo;
    }
  // Handle altVideo text updates
  if (!updateFields.videotitle) {
    updateFields.videotitle = existingServiceDetail.videotitle;
  }

    // Handle status updates
    if (updateFields.status === undefined) {
      updateFields.status = existingServiceDetail.status;
    }

      // Ensure headingType is set to 'main'
      updateFields.headingType = 'main';

    const updatedServiceDetail = await ServiceDetails.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedServiceDetail);
  } catch (error) {
    console.error("Error updating service detail:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Update service detail by ID and ensure subcategoryId is considered
const updateSubServiceDetail = async (req, res) => {
  const { id } = req.query;
  let updateFields = req.body;
  console.log(updateFields);
  
  try {
    const existingServiceDetail = await ServiceDetails.findById(id);

    if (!existingServiceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }

    // If subcategoryId is provided, find the subcategory and get the slug
    if (updateFields.subcategoryId) {
      const category = await ServiceCategory.findOne({ 'subCategories._id': updateFields.subcategoryId });

      if (!category) {
        return res.status(404).json({ message: 'Category not found for the provided subcategory' });
      }

      // Find the subcategory within the category's subCategories array
      const subcategory = category.subCategories.find(sub => sub._id.toString() === updateFields.subcategoryId);

      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found in the specified category' });
      }

      // Extract the slug from the subcategory and add it to updateFields
      updateFields.slug = subcategory.slug;
    } else {
      // If subcategoryId is not provided, keep the existing slug
      updateFields.slug = existingServiceDetail.slug;
    }

    // Handle photo uploads
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename);
      updateFields.photo = [...existingServiceDetail.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingServiceDetail.photo;
    }

    // Handle video upload
    if (req.files && req.files['video'] && req.files['video'].length > 0) {
      const newVideoPath = req.files['video'][0].filename;
      updateFields.video = newVideoPath;
    } else {
      updateFields.video = existingServiceDetail.video;
    }

    // Parse questions from strings to objects if questions are provided
    if (updateFields.questions) {
      updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
    } else {
      updateFields.questions = existingServiceDetail.questions;
    }

    // Handle alt text updates
    if (!updateFields.alt) {
      updateFields.alt = existingServiceDetail.alt;
    }

    // Handle image title updates
    if (!updateFields.imgtitle) {
      updateFields.imgtitle = existingServiceDetail.imgtitle;
    }

    // Handle altVideo text updates
    if (!updateFields.altVideo) {
      updateFields.altVideo = existingServiceDetail.altVideo;
    }

    // Handle video title updates
    if (!updateFields.videotitle) {
      updateFields.videotitle = existingServiceDetail.videotitle;
    }

    // Handle status updates
    if (updateFields.status === undefined) {
      updateFields.status = existingServiceDetail.status;
    }

    // Ensure headingType is set to 'main'
    updateFields.headingType = 'sub';

    const updatedServiceDetail = await ServiceDetails.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedServiceDetail);
  } catch (error) {
    console.error("Error updating service detail:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Update service detail by ID and ensure sub-subcategoryId is considered
const updateSubSubServiceDetail = async (req, res) => {
  const { id } = req.query;
  let updateFields = req.body;
  console.log(updateFields);
  
  try {
    const existingServiceDetail = await ServiceDetails.findById(id);

    if (!existingServiceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }

    // If subsubcategoryId is provided, find the subsubcategory and get the slug
    if (updateFields.subsubcategoryId) {
      const category = await ServiceCategory.findOne({ 'subCategories.subSubCategories._id': updateFields.subsubcategoryId });

      if (!category) {
        return res.status(404).json({ message: 'Category not found for the provided subsubcategory' });
      }

      // Find the subcategory within the category's subCategories array
      const subcategory = category.subCategories.find(sub => 
        sub.subSubCategories.some(subSub => subSub._id.toString() === updateFields.subsubcategoryId)
      );

      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found in the specified category' });
      }

      // Find the subsubcategory within the subcategory's subSubCategories array
      const subsubcategory = subcategory.subSubCategories.find(subSub => subSub._id.toString() === updateFields.subsubcategoryId);

      if (!subsubcategory) {
        return res.status(404).json({ message: 'Subsubcategory not found in the specified subcategory' });
      }

      // Extract the slug from the subsubcategory and add it to updateFields
      updateFields.slug = subsubcategory.slug;
    } else {
      // If subsubcategoryId is not provided, keep the existing slug
      updateFields.slug = existingServiceDetail.slug;
    }

    // Handle photo uploads
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename);
      updateFields.photo = [...existingServiceDetail.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingServiceDetail.photo;
    }

    // Handle video upload
    if (req.files && req.files['video'] && req.files['video'].length > 0) {
      const newVideoPath = req.files['video'][0].filename;
      updateFields.video = newVideoPath;
    } else {
      updateFields.video = existingServiceDetail.video;
    }

    // Parse questions from strings to objects if questions are provided
    if (updateFields.questions) {
      updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
    } else {
      updateFields.questions = existingServiceDetail.questions;
    }

    // Handle alt text updates
    if (!updateFields.alt) {
      updateFields.alt = existingServiceDetail.alt;
    }

    // Handle image title updates
    if (!updateFields.imgtitle) {
      updateFields.imgtitle = existingServiceDetail.imgtitle;
    }

    // Handle altVideo text updates
    if (!updateFields.altVideo) {
      updateFields.altVideo = existingServiceDetail.altVideo;
    }

    // Handle video title updates
    if (!updateFields.videotitle) {
      updateFields.videotitle = existingServiceDetail.videotitle;
    }

    // Handle status updates
    if (updateFields.status === undefined) {
      updateFields.status = existingServiceDetail.status;
    }

    // Ensure headingType is set to 'subsub'
    updateFields.headingType = 'subsub';

    const updatedServiceDetail = await ServiceDetails.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedServiceDetail);
  } catch (error) {
    console.error("Error updating service detail:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


  const deleteQuestionFromServiceDetail = async (req, res) => {
    const { serviceDetailId, questionId } = req.params;
  
    try {
      // Find the service detail document by ID
      const serviceDetail = await ServiceDetails.findById(serviceDetailId);
  
      if (!serviceDetail) {
        return res.status(404).json({ message: 'Service detail not found' });
      }
  
      // Find the index of the question to be deleted
      const questionIndex = serviceDetail.questions.findIndex(
        question => question._id.toString() === questionId
      );
  
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Remove the question from the array
      serviceDetail.questions.splice(questionIndex, 1);
  
      // Save the updated service detail document
      await serviceDetail.save();
  
      res.status(200).json({ message: 'Question deleted successfully', serviceDetail });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };



// Delete service detail by ID
const deleteServiceDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const serviceDetail = await ServiceDetails.findById(id);

    if (!serviceDetail) {
      return res.status(404).send({ message: 'Service detail not found' });
    }

    // Delete associated photos
    serviceDetail.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    await ServiceDetails.findByIdAndDelete(id);

    res.send({ message: "Service detail deleted successfully" }).status(200);
  } catch (error) {
    console.error("Error deleting service detail:", error);
    res.status(400).send(error);
  }
};

// Get service detail by ID
const getServiceDetailById = async (req, res) => {
  try {
    const { id } = req.query;

    const serviceDetail = await ServiceDetails.findById(id).populate('category');

    if (!serviceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }
    res.status(200).json({ data: serviceDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Count total service details for a specific category
const countServiceDetailsByCategory = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const count = await ServiceDetails.countDocuments({ categoryId });
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting service details' });
  }
};

// Delete photo and alt text
const deletePhotoAndAltText = async (req, res) => {
  const { id, imageFilename, index } = req.params;

  try {
    const serviceDetail = await ServiceDetails.findById(id);

    if (!serviceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }

    // Remove the photo and its alt text
    serviceDetail.photo = serviceDetail.photo.filter(photo => photo !== imageFilename);
    serviceDetail.alt.splice(index, 1);
    serviceDetail.imgtitle.splice(index, 1);
    await serviceDetail.save();

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete video and alt text
const deleteVideoAndAltText = async (req, res) => {
  const { id, videoFilename } = req.params;

  try {
    const serviceDetail = await ServiceDetails.findById(id);

    if (!serviceDetail) {
      return res.status(404).json({ message: 'Service detail not found' });
    }

    if (serviceDetail.video === videoFilename) {
      serviceDetail.video = null; // Remove the video reference
    }
    if (serviceDetail.videoAlt) {
      serviceDetail.videoAlt = ''; // Clear the string
    }
    
    if (serviceDetail.videotitle) {
      serviceDetail.videotitle = ''; // Clear the string
    }
 

    await serviceDetail.save();

    const filePath = path.join(__dirname, '..', 'videos', videoFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Video and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting video and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  insertServiceDetail,insertSubServiceDetail,insertSubSubServiceDetail,
  getServiceDetailsByCategory, // Updated to only fetch by category
  getServiceDetailsBySubcategory,
  getServiceDetailsBySubSubcategory,
  updateServiceDetail,
  updateSubServiceDetail,
  updateSubSubServiceDetail,
  deleteServiceDetail,
  getServiceDetailById,
  countServiceDetailsByCategory, // Count by category
  deletePhotoAndAltText,
  deleteVideoAndAltText,deleteQuestionFromServiceDetail,getServiceDetailsByslug
};
