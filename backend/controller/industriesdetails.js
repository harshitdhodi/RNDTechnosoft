const IndustriesDetails = require('../model/industriesdetails');
const path = require('path');
const fs = require('fs');

// Update Industries detail by ID and ensure categoryId is considered
const IndustriesCategory = require('../model/industriescategory'); // Import the IndustriesCategory model

const getIndustriesDetailsByslug = async (req, res) => {
  const { slug } = req.params; // Get slug from query parameters

  try {
    // Find all Industries details by slug
    const IndustriesDetail = await IndustriesDetails.find({ slug: slug })
      // Populate category field if needed

    // Return data in array form with total count
    res.status(200).json({
      data: IndustriesDetail,
      total: IndustriesDetail.length, // Total count of Industries details
    });
  } catch (error) {
    console.error("Error retrieving Industries details:", error);
    let errorMessage = 'Error fetching Industries details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};


const insertIndustriesDetail = async (req, res) => {
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
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    } = req.body;



    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    const parsedQuestions = Array.isArray(questions) ? 
    questions.map(question => {
      try {
        return JSON.parse(question);  // Attempt to parse each question string
      } catch (error) {
        console.error(`Error parsing question: ${question}`, error);
        return null;  // Return null for any invalid JSON
      }
    }).filter(question => question !== null) : []; 

    // Find the category and get the slug
    const category = await IndustriesCategory.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Extract the slug from the category
    const slug = category.slug;

    // Create IndustriesDetail with parsed questions and slug
    const IndustriesDetail = new IndustriesDetails({
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
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    });

    await IndustriesDetail.save();
    return res.status(201).send({ message: 'Data sent successfully', IndustriesDetail });
  } catch (error) {
    console.error("Error inserting Industries detail:", error);
    res.status(400).send(error);
  }
};

const insertSubIndustriesDetail = async (req, res) => {
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
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    } = req.body;

    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    const parsedQuestions = Array.isArray(questions) ? 
    questions.map(question => {
      try {
        return JSON.parse(question);  // Attempt to parse each question string
      } catch (error) {
        console.error(`Error parsing question: ${question}`, error);
        return null;  // Return null for any invalid JSON
      }
    }).filter(question => question !== null) : []; 

    // Find the category by ID
    const category = await IndustriesCategory.findById(categoryId);

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

    // Create sub-Industries detail with parsed questions, category slug, and subcategory slug
    const subIndustriesDetail = new IndustriesDetails({
      heading,
      description,
      priority,
      questions: parsedQuestions, // Use parsed questions array
      category: categoryId,
      subcategory: subcategoryId,
      slug: `${subcategorySlug}`, // Combine slugs for uniqueness
      status,
      headingType: 'sub', // Mark this as a sub-Industries

      alt,
      altVideo,
      imgtitle, 
      videotitle, 
      photo,
      video,
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    });

    await subIndustriesDetail.save();
    return res.status(201).send({ message: 'Sub-Industries created successfully', subIndustriesDetail });
  } catch (error) {
    console.error("Error inserting sub-Industries detail:", error);
    res.status(400).send(error);
  }
};

const insertSubSubIndustriesDetail = async (req, res) => {
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
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    } = req.body;

    console.log(req.body);

    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const video = req.files['video'] ? req.files['video'][0].filename : '';

    const parsedQuestions = Array.isArray(questions) ? 
    questions.map(question => {
      try {
        return JSON.parse(question);  // Attempt to parse each question string
      } catch (error) {
        console.error(`Error parsing question: ${question}`, error);
        return null;  // Return null for any invalid JSON
      }
    }).filter(question => question !== null) : []; 

    // Find the category by ID
    const category = await IndustriesCategory.findById(categoryId);

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

    // Create sub-Industries detail with parsed questions, category slug, subcategory slug, and sub-subcategory slug
    const subSubIndustriesDetail = new IndustriesDetails({
      heading,
      description,
      priority,
      questions: parsedQuestions, // Use parsed questions array
      category: categoryId,
      subcategory: subcategoryId,
      subsubcategory: subsubcategoryId,
      slug: `${subsubcategorySlug}`, // Combine slugs for uniqueness
      status,
      headingType: 'subsub', // Mark this as a sub-sub-Industries

      alt,
      altVideo,
      imgtitle,
      videotitle,
      photo,
      video,
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
    });

    await subSubIndustriesDetail.save();
    return res.status(201).send({ message: 'Sub-sub-Industries created successfully', subSubIndustriesDetail });
  } catch (error) {
    console.error("Error inserting sub-sub-Industries detail:", error);
    res.status(400).send(error);
  }
};


// Get all Industries details by category with pagination
const getIndustriesDetailsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.query; // Get categoryId from query parameters
      const { page = 1 } = req.query; // Get the current page from query parameters
      const limit = 5; // Number of records per page
  
      // Count the documents based on the category reference
      const count = await IndustriesDetails.countDocuments({ category: categoryId }); 
  
      // Find Industries details by category reference with pagination
      const getIndustriesDetails = await IndustriesDetails.find({ category: categoryId,headingType: 'main' })
        .populate('category') // Populate category field if needed
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.status(200).json({
        data: getIndustriesDetails,
        total: count,
        currentPage: page,
        hasNextPage: count > page * limit
      });
    } catch (error) {
      console.error("Error retrieving Industries details:", error);
      let errorMessage = 'Error fetching Industries details';
      if (error.name === 'CastError') {
        errorMessage = 'Invalid query parameter format';
      }
      res.status(500).json({ message: errorMessage });
    }
  };
  

  // Get all Industries details by subcategory with pagination
const getIndustriesDetailsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.query; // Get subcategoryId from query parameters
    const { page = 1 } = req.query; // Get the current page from query parameters
    const limit = 5; // Number of records per page

    if (!subcategoryId) {
      return res.status(400).json({ message: 'Subcategory ID is required' });
    }

    // Count the documents based on the subcategory reference
    const count = await IndustriesDetails.countDocuments({ subcategory: subcategoryId, headingType: 'sub' });

    // Find Industries details by subcategory reference with pagination
    const getIndustriesDetails = await IndustriesDetails.find({ subcategory: subcategoryId, headingType: 'sub' })
      .populate('category') // Populate category field if needed
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: getIndustriesDetails,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving Industries details:", error);
    let errorMessage = 'Error fetching Industries details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

const getIndustriesDetailsBySubSubcategory = async (req, res) => {
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
    const count = await IndustriesDetails.countDocuments({ subsubcategory: subsubcategoryId, headingType: 'subsub' });

    // Find Industries details by subsubcategory reference with pagination
    const getIndustriesDetails = await IndustriesDetails.find({ subsubcategory: subsubcategoryId, headingType: 'subsub' })
      .populate('category') // Populate category field if needed
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      data: getIndustriesDetails,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving Industries details:", error);
    let errorMessage = 'Error fetching Industries details';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage });
  }
};

// Update Industries detail by ID and ensure categoryId is considered
const updateIndustriesDetail = async (req, res) => {
    const { id } = req.query;
    let updateFields = req.body;
    console.log(updateFields);
  
    try {
      const existingIndustriesDetail = await IndustriesDetails.findById(id);
  
      if (!existingIndustriesDetail) {
        return res.status(404).json({ message: 'Industries detail not found' });
      }
  
      // Check the presence of service subsubcategory, subcategory, and category
      const hasSubsubcategory = updateFields.servicesubSubcategories;
      const hasSubcategory = updateFields.servicesubcategories;
      const hasCategory = updateFields.servicecategories;
  
      // Update based on the provided fields
      if (hasSubsubcategory && hasSubcategory && hasCategory) {
        // Update all three fields
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [updateFields.servicesubSubcategories];
        
        // Validate subsubcategory
        const subsubcategory = await IndustriesCategory.findById(updateFields.servicesubSubcategories[0]);
        if (subsubcategory) {
          const subcategory = await IndustriesCategory.findById(updateFields.servicesubcategories[0]);
          if (!subcategory || !subcategory.subCategories.includes(subsubcategory._id.toString())) {
            return res.status(404).json({ message: 'Subsubcategory does not belong to the provided subcategory' });
          }
        } else {
          return res.status(404).json({ message: 'Service subsubcategory not found' });
        }
  
      } else if (hasCategory && hasSubcategory) {
        // Update category and subcategory, clear subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [];
  
        // Validate subcategory
        const subcategory = await IndustriesCategory.findById(updateFields.servicesubcategories[0]);
        if (subcategory) {
          if (!existingIndustriesDetail.servicecategories.includes(subcategory._id.toString())) {
            return res.status(404).json({ message: 'Subcategory does not belong to the provided category' });
          }
        } else {
          return res.status(404).json({ message: 'Service subcategory not found' });
        }
  
      } else if (hasCategory) {
        // Update only category, clear subcategory and subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [];
        updateFields.servicesubSubcategories = [];
        
      } else {
        // No relevant updates
        updateFields.servicecategories = existingIndustriesDetail.servicecategories;
        updateFields.servicesubcategories = existingIndustriesDetail.servicesubcategories;
        updateFields.servicesubSubcategories = existingIndustriesDetail.servicesubSubcategories;
      }
  
      // Handle photo uploads
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename);
        updateFields.photo = [...existingIndustriesDetail.photo, ...newPhotoPaths];
      } else {
        updateFields.photo = existingIndustriesDetail.photo;
      }
  
      // Handle video upload
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        const newVideoPath = req.files['video'][0].filename;
        updateFields.video = newVideoPath;
      } else {
        updateFields.video = existingIndustriesDetail.video;
      }
  
     // Parse questions from strings to objects if questions are provided
if (updateFields.questions) {
  // Ensure updateFields.questions is an array
  if (Array.isArray(updateFields.questions)) {
    updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
  } else {
    // Handle case where it's not an array (perhaps log the error, or ignore)
    console.error('Questions is not an array:', updateFields.questions);
  }
} else {
  updateFields.questions = existingIndustriesDetail.questions;
}

  
      // Handle alt text and other fields
      updateFields.alt = updateFields.alt || existingIndustriesDetail.alt;
      updateFields.imgtitle = updateFields.imgtitle || existingIndustriesDetail.imgtitle;
      updateFields.altVideo = updateFields.altVideo || existingIndustriesDetail.altVideo;
      updateFields.videotitle = updateFields.videotitle || existingIndustriesDetail.videotitle;
  
      // Handle status updates
      updateFields.status = updateFields.status === undefined ? existingIndustriesDetail.status : updateFields.status;
  
      // Update the industries detail with the new fields
      const updatedIndustriesDetail = await IndustriesDetails.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedIndustriesDetail);
    } catch (error) {
      console.error("Error updating Industries detail:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

// Update Industries detail by ID and ensure subcategoryId is considered
const updateSubIndustriesDetail = async (req, res) => {
    const { id } = req.query;
    let updateFields = req.body;
    console.log(updateFields);
  
    try {
      const existingIndustriesDetail = await IndustriesDetails.findById(id);
  
      if (!existingIndustriesDetail) {
        return res.status(404).json({ message: 'Industries detail not found' });
      }
  
      // Handle subcategoryId presence
      if (updateFields.subcategoryId) {
        const category = await IndustriesCategory.findOne({ 'subCategories._id': updateFields.subcategoryId });
  
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
        updateFields.slug = existingIndustriesDetail.slug;
      }
  
      // Handle servicecategories, servicesubcategories, and servicesubSubcategories
      const hasSubsubcategory = updateFields.servicesubSubcategories;
      const hasSubcategory = updateFields.servicesubcategories;
      const hasCategory = updateFields.servicecategories;
  
      if (hasSubsubcategory && hasSubcategory && hasCategory) {
        // Update all three fields
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [updateFields.servicesubSubcategories];
        
        // Validate subsubcategory
        const subsubcategory = await IndustriesCategory.findById(updateFields.servicesubSubcategories[0]);
        if (subsubcategory) {
          const subcategory = await IndustriesCategory.findById(updateFields.servicesubcategories[0]);
          if (!subcategory || !subcategory.subCategories.includes(subsubcategory._id.toString())) {
            return res.status(404).json({ message: 'Subsubcategory does not belong to the provided subcategory' });
          }
        } else {
          return res.status(404).json({ message: 'Service subsubcategory not found' });
        }
  
      } else if (hasCategory && hasSubcategory) {
        // Update category and subcategory, clear subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [];
  
        // Validate subcategory
        const subcategory = await IndustriesCategory.findById(updateFields.servicesubcategories[0]);
        if (subcategory) {
          if (!existingIndustriesDetail.servicecategories.includes(subcategory._id.toString())) {
            return res.status(404).json({ message: 'Subcategory does not belong to the provided category' });
          }
        } else {
          return res.status(404).json({ message: 'Service subcategory not found' });
        }
  
      } else if (hasCategory) {
        // Update only category, clear subcategory and subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [];
        updateFields.servicesubSubcategories = [];
        
      } else {
        // No relevant updates for these fields
        updateFields.servicecategories = existingIndustriesDetail.servicecategories;
        updateFields.servicesubcategories = existingIndustriesDetail.servicesubcategories;
        updateFields.servicesubSubcategories = existingIndustriesDetail.servicesubSubcategories;
      }
  
      // Handle photo uploads
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename);
        updateFields.photo = [...existingIndustriesDetail.photo, ...newPhotoPaths];
      } else {
        updateFields.photo = existingIndustriesDetail.photo;
      }
  
      // Handle video upload
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        const newVideoPath = req.files['video'][0].filename;
        updateFields.video = newVideoPath;
      } else {
        updateFields.video = existingIndustriesDetail.video;
      }
  
    // Parse questions from strings to objects if questions are provided
if (updateFields.questions) {
  // Ensure updateFields.questions is an array
  if (Array.isArray(updateFields.questions)) {
    updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
  } else {
    // Handle case where it's not an array (perhaps log the error, or ignore)
    console.error('Questions is not an array:', updateFields.questions);
  }
} else {
  updateFields.questions = existingIndustriesDetail.questions;
}

      // Handle alt text and other fields
      updateFields.alt = updateFields.alt || existingIndustriesDetail.alt;
      updateFields.imgtitle = updateFields.imgtitle || existingIndustriesDetail.imgtitle;
      updateFields.altVideo = updateFields.altVideo || existingIndustriesDetail.altVideo;
      updateFields.videotitle = updateFields.videotitle || existingIndustriesDetail.videotitle;
  
      // Handle status updates
      updateFields.status = updateFields.status === undefined ? existingIndustriesDetail.status : updateFields.status;
  
      // Ensure headingType is set to 'sub'
      updateFields.headingType = 'sub';
  
      // Update the industries detail with the new fields
      const updatedIndustriesDetail = await IndustriesDetails.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedIndustriesDetail);
    } catch (error) {
      console.error("Error updating Industries detail:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  



// Update Industries detail by ID and ensure subsubcategoryId is considered
const updateSubSubIndustriesDetail = async (req, res) => {
    const { id } = req.query;
    let updateFields = req.body;
    console.log(updateFields);
  
    try {
      const existingIndustriesDetail = await IndustriesDetails.findById(id);
  
      if (!existingIndustriesDetail) {
        return res.status(404).json({ message: 'Industries detail not found' });
      }
  
      // Handle subsubcategoryId presence
      if (updateFields.subsubcategoryId) {
        const category = await IndustriesCategory.findOne({ 'subCategories.subSubCategory._id': updateFields.subsubcategoryId });
  
        if (!category) {
          return res.status(404).json({ message: 'Category not found for the provided subsubcategory' });
        }
  
        // Find the subcategory within the category's subCategories array
        const subcategory = category.subCategories.find(sub =>
          sub.subSubCategory.some(subSub => subSub._id.toString() === updateFields.subsubcategoryId)
        );
  
        if (!subcategory) {
          return res.status(404).json({ message: 'Subcategory not found in the specified category' });
        }
  
        // Find the subsubcategory within the subcategory's subSubCategories array
        const subsubcategory = subcategory.subSubCategory.find(subSub => subSub._id.toString() === updateFields.subsubcategoryId);
  
        if (!subsubcategory) {
          return res.status(404).json({ message: 'Subsubcategory not found in the specified subcategory' });
        }
  
        // Extract the slug from the subsubcategory and add it to updateFields
        updateFields.slug = subsubcategory.slug;
      } else {
        // If subsubcategoryId is not provided, keep the existing slug
        updateFields.slug = existingIndustriesDetail.slug;
      }
  
      // Handle servicecategories, servicesubcategories, and servicesubSubcategories
      const hasSubSubcategory = updateFields.servicesubSubcategories;
      const hasSubcategory = updateFields.servicesubcategories;
      const hasCategory = updateFields.servicecategories;
  
      if (hasSubSubcategory && hasSubcategory && hasCategory) {
        // Update all three fields
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [updateFields.servicesubSubcategories];
        
      } else if (hasSubcategory && hasCategory) {
        // Update category and subcategory, clear subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [updateFields.servicesubcategories];
        updateFields.servicesubSubcategories = [];
  
      } else if (hasCategory) {
        // Update only category, clear subcategory and subsubcategory
        updateFields.servicecategories = [updateFields.servicecategories];
        updateFields.servicesubcategories = [];
        updateFields.servicesubSubcategories = [];
  
      } else {
        // No relevant updates for these fields
        updateFields.servicecategories = existingIndustriesDetail.servicecategories;
        updateFields.servicesubcategories = existingIndustriesDetail.servicesubcategories;
        updateFields.servicesubSubcategories = existingIndustriesDetail.servicesubSubcategories;
      }
  
      // Handle photo uploads
      if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
        const newPhotoPaths = req.files['photo'].map(file => file.filename);
        updateFields.photo = [...existingIndustriesDetail.photo, ...newPhotoPaths];
      } else {
        updateFields.photo = existingIndustriesDetail.photo;
      }
  
      // Handle video upload
      if (req.files && req.files['video'] && req.files['video'].length > 0) {
        const newVideoPath = req.files['video'][0].filename;
        updateFields.video = newVideoPath;
      } else {
        updateFields.video = existingIndustriesDetail.video;
      }
  
      // Parse questions from strings to objects if questions are provided
if (updateFields.questions) {
  // Ensure updateFields.questions is an array
  if (Array.isArray(updateFields.questions)) {
    updateFields.questions = updateFields.questions.map(question => JSON.parse(question));
  } else {
    // Handle case where it's not an array (perhaps log the error, or ignore)
    console.error('Questions is not an array:', updateFields.questions);
  }
} else {
  updateFields.questions = existingIndustriesDetail.questions;
}

      // Handle alt text and other fields
      updateFields.alt = updateFields.alt || existingIndustriesDetail.alt;
      updateFields.imgtitle = updateFields.imgtitle || existingIndustriesDetail.imgtitle;
      updateFields.altVideo = updateFields.altVideo || existingIndustriesDetail.altVideo;
      updateFields.videotitle = updateFields.videotitle || existingIndustriesDetail.videotitle;
  
      // Handle status updates
      updateFields.status = updateFields.status === undefined ? existingIndustriesDetail.status : updateFields.status;
  
      // Ensure headingType is set to 'subsub'
      updateFields.headingType = 'subsub';
  
      // Update the industries detail with the new fields
      const updatedIndustriesDetail = await IndustriesDetails.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      );
  
      res.status(200).json(updatedIndustriesDetail);
    } catch (error) {
      console.error("Error updating Industries detail:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

  const deleteQuestionFromIndustriesDetail = async (req, res) => {
    const { IndustriesDetailId, questionId } = req.params;
  
    try {
      // Find the Industries detail document by ID
      const IndustriesDetail = await IndustriesDetails.findById(IndustriesDetailId);
  
      if (!IndustriesDetail) {
        return res.status(404).json({ message: 'Industries detail not found' });
      }
  
      // Find the index of the question to be deleted
      const questionIndex = IndustriesDetail.questions.findIndex(
        question => question._id.toString() === questionId
      );
  
      if (questionIndex === -1) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Remove the question from the array
      IndustriesDetail.questions.splice(questionIndex, 1);
  
      // Save the updated Industries detail document
      await IndustriesDetail.save();
  
      res.status(200).json({ message: 'Question deleted successfully', IndustriesDetail });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: 'Server error', error });
    }
  };



// Delete Industries detail by ID
const deleteIndustriesDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const IndustriesDetail = await IndustriesDetails.findById(id);

    if (!IndustriesDetail) {
      return res.status(404).send({ message: 'Industries detail not found' });
    }

    // Delete associated photos
    IndustriesDetail.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    await IndustriesDetails.findByIdAndDelete(id);

    res.send({ message: "Industries detail deleted successfully" }).status(200);
  } catch (error) {
    console.error("Error deleting Industries detail:", error);
    res.status(400).send(error);
  }
};

// Get Industries detail by ID
const getIndustriesDetailById = async (req, res) => {
  try {
    const { id } = req.query;

    const IndustriesDetail = await IndustriesDetails.findById(id).populate('category');

    if (!IndustriesDetail) {
      return res.status(404).json({ message: 'Industries detail not found' });
    }
    res.status(200).json({ data: IndustriesDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Count total Industries details for a specific category
const countIndustriesDetailsByCategory = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const count = await IndustriesDetails.countDocuments({ categoryId });
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting Industries details' });
  }
};

// Delete photo and alt text
const deletePhotoAndAltText = async (req, res) => {
  const { id, imageFilename, index } = req.params;

  try {
    const IndustriesDetail = await IndustriesDetails.findById(id);

    if (!IndustriesDetail) {
      return res.status(404).json({ message: 'Industries detail not found' });
    }

    // Remove the photo and its alt text
    IndustriesDetail.photo = IndustriesDetail.photo.filter(photo => photo !== imageFilename);
    IndustriesDetail.alt.splice(index, 1);
    IndustriesDetail.imgtitle.splice(index, 1);
    await IndustriesDetail.save();

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
    const IndustriesDetail = await IndustriesDetails.findById(id);

    if (!IndustriesDetail) {
      return res.status(404).json({ message: 'Industries detail not found' });
    }

    if (IndustriesDetail.video === videoFilename) {
      IndustriesDetail.video = null; // Remove the video reference
    }
    if (IndustriesDetail.videoAlt) {
      IndustriesDetail.videoAlt = ''; // Clear the string
    }
    
    if (IndustriesDetail.videotitle) {
      IndustriesDetail.videotitle = ''; // Clear the string
    }
 

    await IndustriesDetail.save();

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
  insertIndustriesDetail,insertSubIndustriesDetail,insertSubSubIndustriesDetail,
  getIndustriesDetailsByCategory, // Updated to only fetch by category
  getIndustriesDetailsBySubcategory,
  getIndustriesDetailsBySubSubcategory,
  updateIndustriesDetail,
  updateSubIndustriesDetail,
  updateSubSubIndustriesDetail,
  deleteIndustriesDetail,
  getIndustriesDetailById,
  countIndustriesDetailsByCategory, // Count by category
  deletePhotoAndAltText,
  deleteVideoAndAltText,deleteQuestionFromIndustriesDetail,getIndustriesDetailsByslug
};
