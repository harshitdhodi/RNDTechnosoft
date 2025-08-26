const DesignProcess = require('../model/designProcess'); // Update to the correct model path
const path = require('path');
const fs = require('fs');
const ServiceCategory = require('../model/serviceCategory')
const insertDesignProcess = async (req, res) => {
    try {
      const {
        title,
        subheading,
        description,
        hours,
        priority,
        categoryId, // Extract categoryId from the request body
        alt, // Extract alt text for the image
        imgtitle,
      } = req.body;
  
  
      // Assuming image is uploaded as a file
      const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  
      // Fetch the category and get the slug
      const category = await ServiceCategory.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Extract the slug from the category
      const slug = category.slug;
  
      // Create a new DesignProcess with the slug field
      const designProcess = new DesignProcess({
        title,
        subheading,
        description,
        hours,
        priority,
        image, // Store binary image data
        alt, // Store alternative text
        imgtitle,
        category: categoryId, // Assign categoryId to category field
        slug, // Store the slug in the DesignProcess model
        headingType: 'main', // Mark this as a sub-service

      });
  
      await designProcess.save();
      return res.status(201).send({ message: 'Design process created successfully', designProcess });
    } catch (error) {
      console.error("Error inserting design process:", error);
      res.status(400).send(error);
    }
  };
  const insertSubDesignProcess = async (req, res) => {
    try {
      const {
        title,
        subheading,
        description,
        hours,
        priority,
        categoryId,
        subcategoryId, // Extract subCategoryId from the request body
        alt, // Extract alt text for the image
        imgtitle,
      } = req.body;
  
      console.log(req.body);
     console.log("helloooo")
      // Assuming image is uploaded as a file
      const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  
      // Find the category by ID
      const category = await ServiceCategory.findById(categoryId);
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Find the subcategory within the category's subCategories array
      const subcategory = category.subCategories.find(
        (sub) => sub._id.toString() === subcategoryId
      );
  
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found in the specified category' });
      }
  
      // Extract the slug from the subcategory
      const subcategorySlug = subcategory.slug;
  
      // Create a new DesignProcess with the slug field
      const designProcess = new DesignProcess({
        title,
        subheading,
        description,
        hours,
        priority,
        image, // Store the image filename
        alt, // Store alternative text
        imgtitle,
        category: categoryId, // Store the category ID
        subcategory: subcategoryId, // Store the subcategory ID
        slug: `${subcategorySlug}`, // Combine category and subcategory slugs for uniqueness
        headingType: 'sub', // Mark this as a sub-service
      });
  
      await designProcess.save();
      return res.status(201).send({
        message: 'Design process created successfully',
        designProcess,
      });
    } catch (error) {
      console.error('Error inserting design process:', error);
      res.status(400).send({ message: 'Error inserting design process', error });
    }
  };
  
  const insertSubSubDesignProcess = async (req, res) => {
    try {
      const {
        title,
        subheading,
        description,
        hours,
        priority,
        categoryId,
        subcategoryId, // Extract subcategoryId from the request body
        subsubcategoryId, // Extract subsubcategoryId from the request body
        alt, // Extract alt text for the image
        imgtitle,
      } = req.body;
  
      console.log(req.body);
  
      // Assuming image is uploaded as a file
      const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  
      // Find the category by ID
      const category = await ServiceCategory.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Find the subcategory within the category's subCategories array
      const subcategory = category.subCategories.find(
        (sub) => sub._id.toString() === subcategoryId
      );
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found in the specified category' });
      }
  
      // Find the subsubcategory within the subcategory's subSubCategories array
      const subsubcategory = subcategory.subSubCategory.find(
        (subsub) => subsub._id.toString() === subsubcategoryId
      );
      if (!subsubcategory) {
        return res.status(404).json({ message: 'Subsubcategory not found in the specified subcategory' });
      }
  
      // Extract the slugs from category, subcategory, and subsubcategory
      const categorySlug = category.slug;
      const subcategorySlug = subcategory.slug;
      const subsubcategorySlug = subsubcategory.slug;
  
      // Create a new DesignProcess with slugs
      const designProcess = new DesignProcess({
        title,
        subheading,
        description,
        hours,
        priority,
        image, // Store the image filename
        alt, // Store alternative text
        imgtitle,
        category: categoryId, // Store the category ID
        subcategory: subcategoryId, // Store the subcategory ID
        subsubcategory: subsubcategoryId, // Store the subsubcategory ID
        slug: `${subsubcategorySlug}`, // Combine slugs for uniqueness
        headingType: 'subsub', // Mark this as a sub-sub-service
      });
  
      await designProcess.save();
      return res.status(201).send({
        message: 'Design process created successfully',
        designProcess,
      });
    } catch (error) {
      console.error('Error inserting design process:', error);
      res.status(400).send({ message: 'Error inserting design process', error });
    }
  };   

  const getDesignProcesses = async (req, res) => {
    try {
        const { page = 1,categoryId } = req.query;
        const limit = 5;
        let query = { headingType: 'main' };

        if (categoryId) {
          query.category = categoryId;
        }
    
        // Query by subcategoryId and headingType 'sub'

        const count = await DesignProcess.countDocuments(query);

        const designProcesses = await DesignProcess.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            data: designProcesses,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
        });
    } catch (error) {
        console.error("Error retrieving design processes:", error);
        res.status(500).json({ message: 'Error fetching design processes' });
    }
};

const getSubDesignProcesses = async (req, res) => {
    try {
        const { page = 1, categoryId, subcategoryId} = req.query;
        const limit = 5;

        let query = { headingType: 'sub' };

    if (categoryId) {
      query.category = categoryId;
    }
    if (subcategoryId) {
      query.subcategory = subcategoryId;
    }

        const count = await DesignProcess.countDocuments(query);

        const designProcesses = await DesignProcess.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            data: designProcesses,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
        });
    } catch (error) {
        console.error("Error retrieving design processes:", error);
        res.status(500).json({ message: 'Error fetching design processes' });
    }
};


const getSubSubDesignProcesses = async (req, res) => {
    try {
        const { page = 1, categoryId, subcategoryId, subsubcategoryId } = req.query;
        const limit = 5;


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


        const count = await DesignProcess.countDocuments(query);

        const designProcesses = await DesignProcess.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            data: designProcesses,
            total: count,
            currentPage: page,
            hasNextPage: count > page * limit,
        });
    } catch (error) {
        console.error("Error retrieving design processes:", error);
        res.status(500).json({ message: 'Error fetching design processes' });
    }
};


  
const getDesignProcessesBySlug = async (req, res) => {
    try {
        const { slug } = req.params; // Get slug from query parameters

        // Build query to find documents by slug
        const query = slug ? { slug } : {};

        // Find documents based on the query
        const designProcesses = await DesignProcess.find(query);

        // Respond with the data
        res.status(200).json({
            data: designProcesses,
        });
    } catch (error) {
        console.error("Error retrieving design processes:", error);
        res.status(500).json({ message: 'Error fetching design processes' });
    }
};


// Download an image
const downloadImage = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'File download failed' });
        }
    });
};

const updateDesignProcess = async (req, res) => {
    const { processId } = req.query; // Assuming ID is passed as a query parameter
    let updateFields = req.body;
   console.log(updateFields)
    try {
        const existingDesignProcess = await DesignProcess.findById(processId);

        if (!existingDesignProcess) {
            return res.status(404).json({ message: 'Design process not found' });
        }

        // Update image if provided
        if (req.file) { // Check for a single file
            updateFields.image = req.file.filename; // Store new image binary
            updateFields.alt = req.body.alt; // Update alternative text
            updateFields.imgtitle = req.body.imgtitle; // Update alternative text

        } else {
            updateFields.image = existingDesignProcess.image; // Preserve existing image if not updated
            updateFields.alt = existingDesignProcess.alt; // Preserve existing alt text if not updated
            updateFields.imgtitle = existingDesignProcess.imgtitle; // Preserve existing alt text if not updated

        }

        const updatedDesignProcess = await DesignProcess.findByIdAndUpdate(
            processId,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedDesignProcess);
    } catch (error) {
        console.error("Error updating design process:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const deleteDesignProcess = async (req, res) => {
    try {
        const { id } = req.query;

        const designProcess = await DesignProcess.findById(id);

        if (!designProcess) {
            return res.status(404).send({ message: 'Design process not found' });
        }

        await DesignProcess.findByIdAndDelete(id);

        res.status(200).send({ message: "Design process deleted successfully" });
    } catch (error) {
        console.error("Error deleting design process:", error);
        res.status(400).send(error);
    }
};

const getDesignProcessById = async (req, res) => {
    try {
        const { processId } = req.query;

        const designProcess = await DesignProcess.findById(processId);

        if (!designProcess) {
            return res.status(404).json({ message: 'Design process not found' });
        }
        res.status(200).json({ data: designProcess });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const countDesignProcesses = async (req, res) => {
    try {
        const { categoryId } = req.query; // Optionally filter by category
        const query = categoryId ? { category: categoryId } : {};

        const count = await DesignProcess.countDocuments(query);
        res.status(200).json({ total: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error counting design processes' });
    }
};

const deletePhoto = async (req, res) => {
    const { id, imageFilename } = req.params;
   console.log(id, imageFilename)
    try {
        const designProcess = await DesignProcess.findById(id);

        if (!designProcess) {
            return res.status(404).json({ message: 'Design process not found' });
        }

        // Remove the image reference
        if (designProcess.image) {
            designProcess.image = null; // Remove image reference
        }

        await designProcess.save();

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    insertDesignProcess,
    insertSubDesignProcess,
    insertSubSubDesignProcess,
    getDesignProcesses,
    getSubSubDesignProcesses,
    getSubDesignProcesses,
    updateDesignProcess,
    deleteDesignProcess,
    getDesignProcessById,
    countDesignProcesses,
    deletePhoto,
    downloadImage,
    getDesignProcessesBySlug,

};
