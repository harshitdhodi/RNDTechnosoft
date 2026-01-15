const PortfolioCategory = require("../model/portfoliocategory");
const Portfolio= require("../model/portfolio")
const Package = require("../model/packages")
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
  });
};

const insertCategory = async (req, res) => {
  const {
    category,
    alt,
    status,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;

  const photo = req.file ? req.file.filename : null;
  const component = "ProjectSection"; // Hardcoding the component field

  try {
    // Check for duplicate category name
    const existingCategoryByName = await PortfolioCategory.findOne({ category });
    if (existingCategoryByName) {
      return res.status(400).json({ message: "Category with this name already exists" });
    }

    // Check for duplicate slug
    const existingCategoryBySlug = await PortfolioCategory.findOne({ slug });
    if (existingCategoryBySlug) {
      return res.status(400).json({ message: "Category with this slug already exists" });
    }

    const newCategory = new PortfolioCategory({
      category,
      status,
      alt,
      imgtitle,
      photo,
      slug,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      url,
      priority,
      changeFreq,
      component, // Assigning the hardcoded component field
    });

    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const insertSubCategory = async (req, res) => {
  const { categoryId } = req.query;
  const {
    category,
    alt,
    status,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;
  const photo = req.file ? req.file.filename : null;
  const component = "SubPortfolio"; // Hardcoding the component field

  try {
    const categoryDoc = await PortfolioCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check for duplicate subcategory name within this category
    const existingSubCategoryByName = categoryDoc.subCategories.find(
      (subCat) => subCat.category.toLowerCase() === category.toLowerCase()
    );
    if (existingSubCategoryByName) {
      return res.status(400).json({ message: "Subcategory with this name already exists in this category" });
    }

    // Check for duplicate subcategory slug within this category
    const existingSubCategoryBySlug = categoryDoc.subCategories.find(
      (subCat) => subCat.slug === slug
    );
    if (existingSubCategoryBySlug) {
      return res.status(400).json({ message: "Subcategory with this slug already exists in this category" });
    }

    // Check for duplicate slug across all categories (global slug uniqueness)
    const allCategories = await PortfolioCategory.find({});
    const slugExists = allCategories.some(cat => 
      cat.subCategories.some(subCat => subCat.slug === slug)
    );
    if (slugExists) {
      return res.status(400).json({ message: "Subcategory slug must be unique across all categories" });
    }

    categoryDoc.subCategories.push({
      status,
      component,
      category,
      alt,
      imgtitle,
      photo,
      slug,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      url,
      priority,
      changeFreq,
    });
    
    await categoryDoc.save();

    res.status(201).json({
      message: "Subcategory created successfully",
      data: categoryDoc
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const insertSubSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  const {
    category,
    status,
    alt,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const categoryDoc = await PortfolioCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Check for duplicate sub-subcategory name within this subcategory
    const existingSubSubCategoryByName = subCategory.subSubCategory.find(
      (subSubCat) => subSubCat.category.toLowerCase() === category.toLowerCase()
    );
    if (existingSubSubCategoryByName) {
      return res.status(400).json({ message: "Sub-subcategory with this name already exists in this subcategory" });
    }

    // Check for duplicate sub-subcategory slug within this subcategory
    const existingSubSubCategoryBySlug = subCategory.subSubCategory.find(
      (subSubCat) => subSubCat.slug === slug
    );
    if (existingSubSubCategoryBySlug) {
      return res.status(400).json({ message: "Sub-subcategory with this slug already exists in this subcategory" });
    }

    // Check for duplicate slug across all categories and subcategories (global slug uniqueness)
    const allCategories = await PortfolioCategory.find({});
    const slugExists = allCategories.some(cat => 
      cat.subCategories.some(subCat => 
        subCat.subSubCategory.some(subSubCat => subSubCat.slug === slug)
      )
    );
    if (slugExists) {
      return res.status(400).json({ message: "Sub-subcategory slug must be unique across all categories" });
    }

    const component = "SubSubPortfolio"; // Hardcoding the component field

    subCategory.subSubCategory.push({
      category,
      component,
      photo,
      status,
      alt,
      imgtitle,
      slug,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      url,
      priority,
      changeFreq,
    });
    
    await categoryDoc.save();

    res.status(201).json({
      message: "Sub-subcategory created successfully",
      data: categoryDoc
    });
  } catch (error) {
    console.error("Error creating sub-subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  // Update main category
  const { categoryId } = req.query;
  const {
    category,
    status,
    alt,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;

  // Check for photo file
  let photo;
  if (req.file) {
    photo = req.file.filename;
  }

  // Prepare update object
  const updateData = {
    category,
    status,
    alt,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    changeFreq,
  };

  // Only set photo if it exists
  if (photo) {
    updateData.photo = photo;
  }

  // Only set priority if it's a number
  if (typeof priority === "number") {
    updateData.priority = priority;
  }

  try {
    const updatedCategory = await PortfolioCategory.findOneAndUpdate(
      {slug:categoryId},
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  const {
    category,
    alt,
    status,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;
  
  let photo = req.body.photo;

  // Check if there's a file in req.file (i.e., if photo was uploaded)
  if (req.file) {
    photo = req.file.filename;
  }

  try {
    // Find the category based on the categoryId
    const categoryDoc = await PortfolioCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the subcategory based on the subCategoryId (using `slug` for matching)
    const subCategory = categoryDoc.subCategories.find(sub => sub.slug === subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Update the fields of the subcategory
    subCategory.category = category || subCategory.category;
    subCategory.status = status || subCategory.status;
    subCategory.photo = photo || subCategory.photo;
    subCategory.alt = alt || subCategory.alt;
    subCategory.imgtitle = imgtitle || subCategory.imgtitle;
    subCategory.slug = slug || subCategory.slug;
    subCategory.metatitle = metatitle || subCategory.metatitle;
    subCategory.metadescription = metadescription || subCategory.metadescription;
    subCategory.metakeywords = metakeywords || subCategory.metakeywords;
    subCategory.metacanonical = metacanonical || subCategory.metacanonical;
    subCategory.metalanguage = metalanguage || subCategory.metalanguage;
    subCategory.metaschema = metaschema || subCategory.metaschema;
    subCategory.otherMeta = otherMeta || subCategory.otherMeta;
    subCategory.url = url || subCategory.url;
    subCategory.priority = priority || subCategory.priority;
    subCategory.changeFreq = changeFreq || subCategory.changeFreq;

    // Save the category document with the updated subcategory
    await categoryDoc.save();

    // Respond with the updated category document
    res.status(200).json(categoryDoc);

  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const updatesubsubcategory = async (req, res) => {
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;
  const {
    category,
    alt,
    status,
    imgtitle,
    slug,
    metatitle,
    metadescription,
    metakeywords,
    metacanonical,
    metalanguage,
    metaschema,
    otherMeta,
    url,
    priority,
    changeFreq,
  } = req.body;
  let photo = req.body.photo;

  // If a new photo is uploaded, update the photo filename
  if (req.file) {
    photo = req.file.filename;
  }

  try {
    // Find the category by slug (categoryId)
    const categoryDoc = await PortfolioCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the subcategory by slug (subCategoryId)
    const subCategory = categoryDoc.subCategories.find(sub => sub.slug === subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Find the sub-subcategory by slug (subSubCategoryId)
    const subSubCategory = subCategory.subSubCategories.find(subSub => subSub.slug === subSubCategoryId);
    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-subcategory not found" });
    }

    // Update fields in the sub-subcategory
    subSubCategory.category = category || subSubCategory.category;
    subSubCategory.status = status || subSubCategory.status;
    subSubCategory.photo = photo || subSubCategory.photo;
    subSubCategory.alt = alt || subSubCategory.alt;
    subSubCategory.imgtitle = imgtitle || subSubCategory.imgtitle;
    subSubCategory.slug = slug || subSubCategory.slug;
    subSubCategory.metatitle = metatitle || subSubCategory.metatitle;
    subSubCategory.metadescription = metadescription || subSubCategory.metadescription;
    subSubCategory.metakeywords = metakeywords || subSubCategory.metakeywords;
    subSubCategory.metacanonical = metacanonical || subSubCategory.metacanonical;
    subSubCategory.metalanguage = metalanguage || subSubCategory.metalanguage;
    subSubCategory.metaschema = metaschema || subSubCategory.metaschema;
    subSubCategory.otherMeta = otherMeta || subSubCategory.otherMeta;
    subSubCategory.url = url || subSubCategory.url;
    subSubCategory.priority = priority || subSubCategory.priority;
    subSubCategory.changeFreq = changeFreq || subSubCategory.changeFreq;

    // Save the updated category document
    await categoryDoc.save();

    // Return the updated category document
    res.status(200).json(categoryDoc);

  } catch (error) {
    console.error("Error updating sub-subcategory:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const deletecategory = async (req, res) => {
  const { id } = req.query; // Get category ID from the query

  try {
    // Validate that `id` is a valid string and not undefined or empty
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Find the category by its slug (id)
    const category = await PortfolioCategory.findOne({ slug: id });

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if there are subcategories or sub-subcategories
    const hasSubcategories = category.subCategories && category.subCategories.length > 0;
    const hasSubSubcategories = category.subCategories.some(subCat => subCat.subSubCategory && subCat.subSubCategory.length > 0);

    if (hasSubcategories || hasSubSubcategories) {
      return res.status(400).json({ message: 'Category has associated subcategories or sub-subcategories and cannot be deleted' });
    }

    // Ensure the photo exists before attempting to delete
    if (category.photo) {
      const photoPath = path.join(__dirname, '../logos', category.photo);
      deleteFile(photoPath);
    } else {
      console.warn('No photo found for this category');
    }

    // Proceed to delete the category
    const deletedCategory = await PortfolioCategory.findOneAndDelete({ slug: id });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find and update all services that reference this category, removing the category reference
    await Portfolio.updateMany(
      { categories: id },
      { $pull: { categories: id } }
    );

    res.status(200).json({ message: 'Category deleted successfully and references removed from services' });
  } catch (error) {
    console.error("Error deleting category:", error); // Log the full error to understand it better
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletesubcategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  console.log("Incoming Request -> categoryId:", categoryId, "subCategoryId:", subCategoryId);

  try {
    // 1️⃣ Find category by slug
    const categoryDoc = await PortfolioCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      console.warn("Category not found for slug:", categoryId);
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("Fetched categoryDoc:", categoryDoc._id);
    console.log("Available subCategories:", categoryDoc.subCategories.map(s => ({ id: s._id.toString(), slug: s.slug })));

    // 2️⃣ Try finding subcategory either by _id or slug
    const subCategoryIndex = categoryDoc.subCategories.findIndex(
      (subCat) =>
        subCat._id.toString() === subCategoryId || subCat.slug === subCategoryId
    );

    console.log("Matched subCategoryIndex:", subCategoryIndex);

    if (subCategoryIndex === -1) {
      console.warn("No matching subcategory found");
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const subCategory = categoryDoc.subCategories[subCategoryIndex];
    console.log("Found subCategory:", subCategory);

    // 3️⃣ Prevent delete if has sub-subcategories
    if (subCategory.subSubCategory?.length > 0) {
      return res.status(400).json({
        message: "Subcategory has associated sub-subcategories and cannot be deleted",
      });
    }

    // 4️⃣ Delete photo if exists
    if (subCategory.photo) {
      const photoPath = path.join(__dirname, "../logos", subCategory.photo);
      console.log("Deleting photo:", photoPath);
      deleteFile(photoPath);
    }

    // 5️⃣ Remove subcategory and save
    categoryDoc.subCategories.splice(subCategoryIndex, 1);
    await categoryDoc.save();

    // 6️⃣ Remove references in Package model
    const updateResult = await Package.updateMany(
      { subcategories: subCategory._id.toString() },
      { $pull: { subcategories: subCategory._id.toString() } }
    );

    console.log("Package update result:", updateResult);

    res.status(200).json({
      message: "Subcategory deleted successfully and references removed",
    });
  } catch (error) {
    console.error("Error in deletesubcategory:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



const deletesubsubcategory = async (req, res) => {
  // Delete sub-subcategory
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;

  try {
    console.log('Delete request params:', { categoryId, subCategoryId, subSubCategoryId });

    // Find category document by slug
    const categoryDoc = await PortfolioCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      console.log('Category not found with slug:', categoryId);
      return res.status(404).json({ message: 'Category not found' });
    }
    console.log('Category found:', categoryDoc.category);

    // Find subcategory by slug within the category
    const subCategory = categoryDoc.subCategories.find(sub => sub.slug === subCategoryId);
    if (!subCategory) {
      console.log('Subcategory not found with slug:', subCategoryId);
      console.log('Available subcategories:', categoryDoc.subCategories.map(sub => sub.slug));
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    console.log('Subcategory found:', subCategory.category);

    // Find the index of the subSubCategory to be deleted
    // Check if subSubCategoryId is an ObjectId or a slug
    let subSubCategoryIndex = -1;
    
    // First try to find by _id (if subSubCategoryId is an ObjectId)
    subSubCategoryIndex = subCategory.subSubCategory.findIndex(subSubCat => 
      subSubCat._id.toString() === subSubCategoryId
    );
    
    // If not found by _id, try to find by slug
    if (subSubCategoryIndex === -1) {
      subSubCategoryIndex = subCategory.subSubCategory.findIndex(subSubCat => 
        subSubCat.slug === subSubCategoryId
      );
    }
    
    if (subSubCategoryIndex === -1) {
      console.log('Sub-subcategory not found with identifier:', subSubCategoryId);
      console.log('Available sub-subcategories:');
      subCategory.subSubCategory.forEach((subSubCat, index) => {
        console.log(`${index}: ID=${subSubCat._id}, Slug=${subSubCat.slug}, Category=${subSubCat.category}`);
      });
      return res.status(404).json({ message: 'Sub-subcategory not found' });
    }

    console.log('Sub-subcategory found at index:', subSubCategoryIndex);
    const subSubCategoryToDelete = subCategory.subSubCategory[subSubCategoryIndex];
    console.log('Deleting sub-subcategory:', subSubCategoryToDelete.category);

    // Get the photo file path and delete the file
    if (subSubCategoryToDelete.photo) {
      const photoPath = path.join(__dirname, '../logos', subSubCategoryToDelete.photo);
      console.log('Attempting to delete file:', photoPath);
      deleteFile(photoPath); // Delete the file associated with the sub-subcategory
    }

    // Store the actual ObjectId for Package update
    const subSubCategoryObjectId = subSubCategoryToDelete._id;

    // Remove the sub-subcategory from the array
    subCategory.subSubCategory.splice(subSubCategoryIndex, 1);

    // Save the updated category document
    await categoryDoc.save();
    console.log('Category document updated successfully');

    // Update the services collection and remove the reference to this sub-subcategory
    // Use the actual ObjectId for the Package update
    const packageUpdateResult = await Package.updateMany(
      { subSubcategories: subSubCategoryObjectId },
      { $pull: { subSubcategories: subSubCategoryObjectId } }
    );
    console.log('Package update result:', packageUpdateResult);

    res.status(200).json({ 
      message: 'Sub-subcategory deleted successfully and references removed from services',
      deletedSubSubCategory: {
        id: subSubCategoryObjectId,
        category: subSubCategoryToDelete.category,
        slug: subSubCategoryToDelete.slug
      },
      packagesUpdated: packageUpdateResult.modifiedCount
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.error('Full error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getAll = async (req, res) => {
  try {
    const categories = await PortfolioCategory.find();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const categories = await PortfolioCategory.find().select(" category slug ");

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSpecificCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const categories = await PortfolioCategory.findOne({ slug: categoryId });

    if (!categories) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSpecificSubcategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  try {
    // Find the category by slug
    const category = await PortfolioCategory.findOne({ slug: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the specific subcategory within the category
    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Respond with the found subcategory
    res.status(200).json(subCategory);
  } catch (error) {
    console.error(error); // Use console.error for error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSpecificSubSubcategory = async (req, res) => {
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;

  try {
    // Find the category by slug
    const category = await PortfolioCategory.findOne({ slug: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the specific subcategory
    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Find the specific sub-subcategory
    const subSubCategory = subCategory.subSubCategories.find(
      (subSub) => subSub.slug === subSubCategoryId
    );
    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-subcategory not found" });
    }

    // Respond with the found sub-subcategory
    res.status(200).json(subSubCategory);
  } catch (error) {
    console.error(error); // Use console.error for error logging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const fetchCategoryUrlPriorityFreq = async (req, res) => {
  try {
    const categories = await PortfolioCategory.find(
      {},
      "_id url changeFreq priority lastmod subCategories"
    ).populate({
      path: "subCategories",
      select: "_id url changeFreq priority lastmod subSubCategory",
      populate: {
        path: "subSubCategory",
        select: "_id url changeFreq lastmod priority",
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchCategoryUrlmeta = async (req, res) => {
  try {
    const categories = await PortfolioCategory.find(
      {},
      "_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta subCategories"
    ).populate({
      path: "subCategories",
      select:
        "_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta subSubCategory",
      populate: {
        path: "subSubCategory",
        select:
          "_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta",
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const editCategoryUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query;
    const { url, priority, changeFreq } = req.body;
    console.log(id);

    const updateFields = { url, priority, changeFreq };
    let updatedDocument = null;

    // Search and update the top-level ProductCategory document
    updatedDocument = await PortfolioCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await PortfolioCategory.findOneAndUpdate(
        { "subCategories._id": id },
        {
          $set: {
            "subCategories.$.url": url,
            "subCategories.$.priority": priority,
            "subCategories.$.changeFreq": changeFreq,
          },
        },
        { new: true }
      );
    }

    if (!updatedDocument) {
      // If not found, search and update in subSubCategories
      updatedDocument = await PortfolioCategory.findOneAndUpdate(
        { "subCategories.subSubCategory._id": id },
        {
          $set: {
            "subCategories.$[subCat].subSubCategory.$[subSubCat].url": url,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].priority":
              priority,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].changeFreq":
              changeFreq,
          },
        },
        {
          arrayFilters: [
            { "subCat.subSubCategory._id": id },
            { "subSubCat._id": id },
          ],
          new: true,
        }
      );
    }

    if (!updatedDocument) {
      return res.status(404).json({ error: "ID not found in any category" });
    }

    res
      .status(200)
      .json({
        message:
          "Url, priority, change frequency, and lastmod updated successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const editCategoryUrlmeta = async (req, res) => {
  try {
    const { id } = req.query;
    const {
      url,
      metatitle,
      metadescription,
      metakeywords,
      metalanguage,
      metacanonical,
      metaschema,
      otherMeta,
    } = req.body;
    console.log(id);

    const updateFields = {
      url,
      metatitle,
      metadescription,
      metakeywords,
      metalanguage,
      metacanonical,
      metaschema,
      otherMeta,
    };
    let updatedDocument = null;

    // Search and update the top-level ServiceCategory document
    updatedDocument = await PortfolioCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await PortfolioCategory.findOneAndUpdate(
        { "subCategories._id": id },
        {
          $set: {
            "subCategories.$.url": url,
            "subCategories.$.metatitle": metatitle,
            "subCategories.$.metadescription": metadescription,
            "subCategories.$.metakeywords": metakeywords,
            "subCategories.$.metalanguage": metalanguage,
            "subCategories.$.metacanonical": metacanonical,
            "subCategories.$.metaschema": metaschema,
            "subCategories.$.otherMeta": otherMeta,
          },
        },
        { new: true }
      );
    }

    if (!updatedDocument) {
      // If not found, search and update in subSubCategories
      updatedDocument = await PortfolioCategory.findOneAndUpdate(
        { "subCategories.subSubCategory._id": id },
        {
          $set: {
            "subCategories.$[subCat].subSubCategory.$[subSubCat].url": url,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metatitle":
              metatitle,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metadescription":
              metadescription,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metakeywords":
              metakeywords,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metalanguage":
              metalanguage,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metacanonical":
              metacanonical,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].metaschema":
              metaschema,
            "subCategories.$[subCat].subSubCategory.$[subSubCat].otherMeta":
              otherMeta,
          },
        },
        {
          arrayFilters: [
            { "subCat.subSubCategory._id": id },
            { "subSubCat._id": id },
          ],
          new: true,
        }
      );
    }

    if (!updatedDocument) {
      return res.status(404).json({ error: "ID not found in any category" });
    }

    res.status(200).json({ message: "Meta details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// const deleteCategoryUrlPriorityFreq = async (req, res) => {
//   try {
//       const { id } = req.query;

//       const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
//           id,
//           { $unset: { url: "", priority: "", changeFreq: "" } },
//           { new: true }
//       );

//       if (!updatedServiceCategory) {
//           return res.status(404).json({ error: "Product Category not found" });
//       }

//       res.status(200).json({ message: "Url, priority, and freq deleted successfully" });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server error" });
//   }
// };

const fetchCategoryUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    let categoryData = null;

    // Attempt to find the category by ID at the top level
    const topCategory = await PortfolioCategory.findById(id).select(
      "url priority changeFreq"
    );

    if (topCategory) {
      categoryData = {
        url: topCategory.url,
        priority: topCategory.priority,
        changeFreq: topCategory.changeFreq,
      };
    } else {
      // If not found at the top level, search in subcategories
      const parentCategory = await PortfolioCategory.findOne(
        { "subCategories._id": id },
        { "subCategories.$": 1 }
      );

      if (
        parentCategory &&
        parentCategory.subCategories &&
        parentCategory.subCategories.length > 0
      ) {
        const subCategory = parentCategory.subCategories[0];
        categoryData = {
          url: subCategory.url,
          priority: subCategory.priority,
          changeFreq: subCategory.changeFreq,
        };
      }
    }

    if (!categoryData) {
      // If not found in subcategories, search in sub-subcategories
      const parentCategory = await PortfolioCategory.findOne(
        { "subCategories.subSubCategory._id": id },
        { "subCategories.subSubCategory.$": 1 }
      );

      if (
        parentCategory &&
        parentCategory.subCategories &&
        parentCategory.subCategories.length > 0
      ) {
        const subSubCategory =
          parentCategory.subCategories[0].subSubCategory[0];
        categoryData = {
          url: subSubCategory.url,
          priority: subSubCategory.priority,
          changeFreq: subSubCategory.changeFreq,
        };
      }
    }

    if (!categoryData) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchCategoryUrlmetaById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    let categoryData = null;

    // Find the product category by ID and select specific fields
    categoryData = await PortfolioCategory.findById(id).select(
      "url metatitle metadescription metakeywords metalanguage metacanonical metaschema otherMeta"
    );

    if (!categoryData) {
      // If not found at the top level, search in subcategories
      categoryData = await PortfolioCategory.findOne(
        { "subCategories._id": id },
        {
          "subCategories.$": 1,
          "subCategories.url": 1,
          "subCategories.metatitle": 1,
          "subCategories.metadescription": 1,
          "subCategories.metakeywords": 1,
          "subCategories.metalanguage": 1,
          "subCategories.metacanonical": 1,
          "subCategories.metaschema": 1,
          "subCategories.otherMeta": 1,
        }
      );
    }

    if (!categoryData) {
      // If not found in subcategories, search in sub-subcategories
      categoryData = await PortfolioCategory.findOne(
        { "subCategories.subSubCategory._id": id },
        {
          "subCategories.subSubCategory.$": 1,
          "subCategories.subSubCategory.url": 1,
          "subCategories.subSubCategory.metatitle": 1,
          "subCategories.subSubCategory.metadescription": 1,
          "subCategories.subSubCategory.metakeywords": 1,
          "subCategories.subSubCategory.metalanguage": 1,
          "subCategories.subSubCategory.metacanonical": 1,
          "subCategories.subSubCategory.metaschema": 1,
          "subCategories.subSubCategory.otherMeta": 1,
        }
      );
    }

    if (!categoryData) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllSubcategoriesBySlug = async (req, res) => {
  try {
    const { slug } = req.query;

    // Find the category by slug
    const category = await PortfolioCategory.findOne({ slug });

    // Check if category exists
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Prepare the response structure for subcategories only
    const subcategories = category.subCategories.map((subCat) => ({
      _id: subCat._id,
      category: subCat.category,
      photo: subCat.photo,
      alt: subCat.alt,
      imgtitle: subCat.imgtitle,
      slug: subCat.slug,
      metatitle: subCat.metatitle,
      metadescription: subCat.metadescription,
      metakeywords: subCat.metakeywords,
      metacanonical: subCat.metacanonical,
      metalanguage: subCat.metalanguage,
      metaschema: subCat.metaschema,
      otherMeta: subCat.otherMeta,
      url: subCat.url,
      priority: subCat.priority,
      lastmod: subCat.lastmod,
      changeFreq: subCat.changeFreq,
      component: subCat.component,
      status: subCat.status,
    }));

    // Send the response with only subcategories
    res.status(200).json({ subcategories });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

module.exports = {
  getAllSubcategoriesBySlug,
  insertCategory,
  insertSubCategory,
  insertSubSubCategory,
  updateCategory,
  updateSubCategory,
  updatesubsubcategory,
  deletecategory,
  deletesubcategory,
  deletesubsubcategory,
  getAll,
  getAllCategory,
  getSpecificCategory,
  getSpecificSubcategory,
  getSpecificSubSubcategory,
  fetchCategoryUrlPriorityFreq,
  editCategoryUrlPriorityFreq,
  fetchCategoryUrlPriorityFreqById,
  fetchCategoryUrlmeta,
  editCategoryUrlmeta,
  fetchCategoryUrlmetaById,
};
