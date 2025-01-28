const ServiceCategory = require("../model/serviceCategory");
const Service = require("../model/service");
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
    tag,
    description,
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
  const component = "MainService"; // Hardcoding the component field

  try {
    const existingCategory = await ServiceCategory.findOne({ category });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new ServiceCategory({
      category,
      tag,
      description,
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

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const insertSubCategory = async (req, res) => {
  const { categoryId } = req.query;
  const {
    category,
    tag,
    description,
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
  const component = "SubService"; // Hardcoding the component field

  try {
    const categoryDoc = await ServiceCategory.findById(categoryId);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingSubCategory = categoryDoc.subCategories.find(
      (subCat) => subCat.category === category
    );
    if (existingSubCategory) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    categoryDoc.subCategories.push({
      status,
      tag,
      description,
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

    res.status(201).json(categoryDoc);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const insertSubSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;
  const {
    category,
    tag,
    description,
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
    const categoryDoc = await ServiceCategory.findById(categoryId);

    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const existingSubSubCategory = subCategory.subSubCategory.find(
      (subSubCat) => subSubCat.category === category
    );
    if (existingSubSubCategory) {
      return res
        .status(400)
        .json({ message: "Sub-subcategory already exists" });
    }
    const component = "SubSubService"; // Hardcoding the component field

    subCategory.subSubCategory.push({
      category,
      tag,
      description,
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

    res.status(201).json(categoryDoc);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateCategory = async (req, res) => {
  // Update main category
  const { categoryId } = req.query;
  const {
    category,
    tag,
    description,
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
    tag,
    description,
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
    const updatedCategory = await ServiceCategory.findOneAndUpdate(
      { slug: categoryId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};

const updateSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  const {
    category,
    tag,
    description,
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

  if (req.file) {
    photo = req.file.filename; // Use uploaded file's filename
  }

  try {
    const categoryDoc = await ServiceCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = categoryDoc.subCategories.find(sub => sub.slug === subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Update subcategory fields
    subCategory.category = category || subCategory.category;
    subCategory.tag = tag || subCategory.tag;
    subCategory.description = description || subCategory.description;
    subCategory.status = status || subCategory.status;
    subCategory.photo = photo || subCategory.photo; // Only update if provided
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

    await categoryDoc.save();

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
    tag,
    description,
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
  if (req.file) {
    photo = req.file.filename; // Use uploaded file's filename if available
  }

  try {
    const categoryDoc = await ServiceCategory.findOne({ slug: categoryId });
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = categoryDoc.subCategories.find(subCat => subCat.slug === subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const subSubCategory = subCategory.subSubCategories.find(subSubCat => subSubCat.slug === subSubCategoryId);
    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-subcategory not found" });
    }

    // Update fields of the sub-subcategory
    subSubCategory.category = category || subSubCategory.category;
    subSubCategory.tag = tag || subSubCategory.tag;
    subSubCategory.description = description || subSubCategory.description;
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

    await categoryDoc.save(); // Save the updated document
    res.status(200).json(categoryDoc); // Return the updated category document
  } catch (error) {
    console.error("Error updating sub-subcategory:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error });
  }
};

const getActiveCategories = async (req, res) => {
  try {
    // Fetch active categories
    const categories = await ServiceCategory.find({ status: "active" });

    // Send the active categories in the response
    res.status(200).json({
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    console.error("Error retrieving active categories:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};

const deletecategory = async (req, res) => {
  const { id } = req.query;

  try {
    // Find the category by its ID
    const category = await ServiceCategory.findOne({slug:id});

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if there are subcategories or sub-subcategories
    const hasSubcategories = category.subCategories.length > 0;
    const hasSubSubcategories = category.subCategories.some(
      (subCat) => subCat.subSubCategory.length > 0
    );

    if (hasSubcategories || hasSubSubcategories) {
      return res
        .status(400)
        .json({
          message:
            "Category has associated subcategories or sub-subcategories and cannot be deleted",
        });
    }

    // const photoPath = path.join(__dirname, '../logos', category.photo);
    // deleteFile(photoPath);

    // Proceed to delete the category
    const deletedCategory = await ServiceCategory.findOneAndDelete({slug:id});

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find and update all services that reference this category, removing the category reference
    await Service.updateMany({ categories: id }, { $pull: { categories: id } });

    res
      .status(200)
      .json({
        message:
          "Category deleted successfully and references removed from services",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deletesubcategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.query;

  try {
    const categoryDoc = await ServiceCategory.findOne({slug:categoryId});
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategoryIndex = categoryDoc.subCategories.findIndex(
      (subCat) => subCat._id.toString() === subCategoryId
    );
    if (subCategoryIndex === -1) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const subCategory = categoryDoc.subCategories[subCategoryIndex];

    // Check if there are sub-subcategories
    if (subCategory.subSubCategory && subCategory.subSubCategory.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Subcategory has associated sub-subcategories and cannot be deleted",
        });
    }

    // Remove the subcategory from the array
    categoryDoc.subCategories.splice(subCategoryIndex, 1);

    await categoryDoc.save();

    // Find and update all services that reference this subcategory, removing the subcategory reference
    await Service.updateMany(
      { subcategories: subCategoryId },
      { $pull: { subcategories: subCategoryId } }
    );

    res
      .status(200)
      .json({
        message:
          "Subcategory deleted successfully and references removed from services",
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error });
  }
};

const deletesubsubcategory = async (req, res) => {
  // Delete sub-subcategory
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;

  try {
    const categoryDoc = await ServiceCategory.findOne({slug:categoryId});
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = categoryDoc.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const subSubCategoryIndex = subCategory.subSubCategory.findIndex(
      (subSubCat) => subSubCat._id.toString() === subSubCategoryId
    );
    if (subSubCategoryIndex === -1) {
      return res.status(404).json({ message: "Sub-subcategory not found" });
    }

    // const photoPath = path.join(__dirname, '../logos', subCategory.subSubCategory[subSubCategoryIndex].photo);
    // deleteFile(photoPath);

    subCategory.subSubCategory.splice(subSubCategoryIndex, 1);

    await categoryDoc.save();
    await Service.updateMany(
      { subSubcategories: subSubCategoryId },
      { $pull: { subSubcategories: subSubCategoryId } }
    );
    res
      .status(200)
      .json({
        message:
          "SubSubcategory deleted successfully and references removed from services",
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAll = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSpecificCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const categories = await ServiceCategory.findOne({ slug: categoryId });

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
    const category = await ServiceCategory.findOne({ slug: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the subcategory by matching its slug
    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSpecificSubSubcategory = async (req, res) => {
  const { categoryId, subCategoryId, subSubCategoryId } = req.query;

  try {
    const category = await ServiceCategory.findOne({ slug: categoryId });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find the subcategory by its slug
    const subCategory = category.subCategories.find(
      (sub) => sub.slug === subCategoryId
    );
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Find the sub-subcategory by its slug
    const subSubCategory = subCategory.subSubCategory.find(
      (subSub) => subSub.slug === subSubCategoryId
    );
    if (!subSubCategory) {
      return res.status(404).json({ message: "Sub-subcategory not found" });
    }

    res.status(200).json(subSubCategory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchCategoryUrlPriorityFreq = async (req, res) => {
  try {
    const categories = await ServiceCategory.find(
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
    const categories = await ServiceCategory.find(
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
    updatedDocument = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await ServiceCategory.findOneAndUpdate(
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
      updatedDocument = await ServiceCategory.findOneAndUpdate(
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
    updatedDocument = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDocument) {
      // If not found, search and update in subCategories
      updatedDocument = await ServiceCategory.findOneAndUpdate(
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
      updatedDocument = await ServiceCategory.findOneAndUpdate(
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
    const topCategory = await ServiceCategory.findById(id).select(
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
      const parentCategory = await ServiceCategory.findOne(
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
      const parentCategory = await ServiceCategory.findOne(
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
    categoryData = await ServiceCategory.findById(id).select(
      "url metatitle metadescription metakeywords metalanguage metacanonical metaschema otherMeta"
    );

    if (!categoryData) {
      // If not found at the top level, search in subcategories
      categoryData = await ServiceCategory.findOne(
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
      categoryData = await ServiceCategory.findOne(
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

const getCategory = async (req, res) => {
  try {
    const categories = await ServiceCategory.find().select(
      "category description photo alt imgtitle slug tag"
    );

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getServicesBySlug = async (req, res) => {
  const { slug } = req.query;

  // Assuming categories and subcategories are stored in a database
  const categories = await ServiceCategory.find();

  // Check if slug matches a category
  const category = categories.find(cat => cat.slug === slug);
  if (category) {
    return res.json(category.subCategories.map(sub => ({
      slug: sub.slug,
      photo: sub.photo,
      alt: sub.alt,
      category:sub.category,
      imgtitle: sub.imgtitle
    })));
  }

  // Check if slug matches a subcategory
  const subcategory = categories.flatMap(cat => cat.subCategories).find(sub => sub.slug === slug);
  if (subcategory) {
    return res.json(subcategory.subSubCategory.map(subsub => ({
      slug: subsub.slug,
      photo: subsub.photo,
      alt: subsub.alt,
      category:subsub.category,
      imgtitle: subsub.imgtitle
    })));
  }

  return res.status(404).json({ message: 'Not found' });
};

module.exports = {
  getServicesBySlug,
  getCategory,
  getActiveCategories,
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
