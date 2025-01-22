const Package = require("../model/packages"); // Change to Package model
const ServiceCategory = require("../model/serviceCategory"); // Adjust this if necessary
const fs = require('fs');
const path = require('path');
const PackageCategory = require("../model/packagecategory")


const insertPackage = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      popular, 
      price, 
      slots, 
      whatYouGet, 
      whatIsTheir, 
      whatIsNotTheir, 
      categories,       
      subcategories,     
      subSubcategories,  
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
      status 
    } = req.body;
   console.log(
    categories,       
    subcategories,     
    subSubcategories, servicecategories,
    servicesubcategories,
    servicesubSubcategories,)
    let slug;

    // Fetch the main category
    const category = await PackageCategory.findById(categories);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If all three (category, subcategory, subsubcategory) are provided
    if (categories && subcategories && subSubcategories) {
      const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategories);
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }

      const subSubcategory = subcategory.subSubCategory.find(subSub => subSub._id.toString() === subSubcategories);
      if (!subSubcategory) {
        return res.status(404).json({ message: 'Sub-Subcategory not found' });
      }

      slug = subSubcategory.slug;

    // If category and subcategory are provided, but no subsubcategory
    } else if (categories && subcategories) {
      const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategories);
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
      slug = subcategory.slug;

    // If only category is provided
    } else if (categories) {
      slug = category.slug;
    }

    // Create a new Package with the dynamically selected slug
    const packageData = new Package({
      title,
      description,
      popular,
      price,
      slots,
      whatYouGet,
      whatIsTheir,
      whatIsNotTheir,
      categories,
      subcategories,
      subSubcategories,
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
      status,
      slug // Store the slug in the Package model
    });

    await packageData.save();
    res.status(201).json({ message: 'Package inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting package' });
  }
};




const updatePackage = async (req, res) => {
  try {
    const { id } = req.params; // Get Package ID from request parameters
    const {
      title, 
      description, 
      popular, 
      price, 
      slots, 
      whatYouGet, 
      whatIsTheir, 
      whatIsNotTheir, 
      categories,        // category ID
      subcategories,     // subcategory ID
      subSubcategories,  // sub-subcategory ID
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
      status 
    } = req.body;

    // Fetch the existing package from the database
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Prepare updateData object only with provided fields (partial updates, ignoring null values)
    const updateData = {};

    if (title !== undefined && title !== null) updateData.title = title;
    if (description !== undefined && description !== null) updateData.description = description;
    if (popular !== undefined && popular !== null) updateData.popular = popular;
    if (price !== undefined && price !== null) updateData.price = price;
    if (slots !== undefined && slots !== null) updateData.slots = slots;
    if (whatYouGet !== undefined && whatYouGet !== null) updateData.whatYouGet = whatYouGet;
    if (whatIsTheir !== undefined && whatIsTheir !== null) updateData.whatIsTheir = whatIsTheir;
    if (whatIsNotTheir !== undefined && whatIsNotTheir !== null) updateData.whatIsNotTheir = whatIsNotTheir;
    if (servicecategories !== undefined && servicecategories !== null) updateData.servicecategories = servicecategories;
    if (servicesubcategories !== undefined && servicesubcategories !== null) updateData.servicesubcategories = servicesubcategories;
    if (servicesubSubcategories !== undefined && servicesubSubcategories !== null) updateData.servicesubSubcategories = servicesubSubcategories;
    if (status !== undefined && status !== null) updateData.status = status;

    // Handle category-related updates separately if any category field is provided (excluding null)
    if (categories || subcategories || subSubcategories) {
      if (categories) {
        const category = await PackageCategory.findById(categories);
        if (!category) {
          return res.status(404).json({ message: 'Main category not found' });
        }

        // Determine slug based on the category/subcategory/subsubcategory structure
        let slug;

        if (categories && subcategories && subSubcategories) {
          const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategories);
          if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
          }

          const subSubcategory = subcategory.subSubCategory.find(subSub => subSub._id.toString() === subSubcategories);
          if (!subSubcategory) {
            return res.status(404).json({ message: 'Sub-subcategory not found' });
          }

          slug = subSubcategory.slug;

        } else if (categories && subcategories) {
          const subcategory = category.subCategories.find(sub => sub._id.toString() === subcategories);
          if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
          }
          slug = subcategory.slug;

        } else if (categories) {
          slug = category.slug;
        }

        // Update the slug and category fields
        updateData.slug = slug;
        updateData.categories = categories;
        if (subcategories) updateData.subcategories = subcategories;
        if (subSubcategories) updateData.subSubcategories = subSubcategories;
      }
    }

    // Update the package with the provided fields
    const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });

  } catch (error) {
    console.error('Error updating package:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



const deletePackage = async (req, res) => {
  const { id } = req.query;
console.log(id)
  try {
    const deletedPackage = await Package.findOneAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { page = 1, packageCategoryId, serviceCategoryId } = req.query; // Get category filters from query
    const limit = 5;

    // Build query object dynamically based on provided filters
    let filter = {};
    if (packageCategoryId) {
      filter.categories = packageCategoryId; // Filter by PackageCategory
    }
    if (serviceCategoryId) {
      filter.servicecategories = serviceCategoryId; // Filter by ServiceCategory
    }

    const count = await Package.countDocuments(filter); // Count based on the filter

    // Find packages based on filters with pagination
    const packages = await Package.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    // Map over each package to find and append both category and service category names
    const packagesWithCategoryNames = await Promise.all(packages.map(async (pkg) => {
      // Fetch the corresponding package category
      const packageCategory = await PackageCategory.findById(pkg.categories);
      const packageCategoryName = packageCategory ? packageCategory.category : 'Uncategorized';

      // Fetch the corresponding service category
      const serviceCategory = await ServiceCategory.findById(pkg.servicecategories);
      const serviceCategoryName = serviceCategory ? serviceCategory.category : 'Uncategorized';

      // Return package with both category and service category names
      return {
        ...pkg.toJSON(),
        packageCategoryName,
        serviceCategoryName
      };
    }));

    res.status(200).json({
      data: packagesWithCategoryNames,
      total: count,
      currentPage: parseInt(page),
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving packages:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAllPackagesSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    let category = null;
    let subcategory = null;
    let subSubcategory = null;

    // First, try to find the slug in the main categories
    category = await ServiceCategory.findOne({ slug });
    if (category) {
      // If the slug belongs to a main category, use only the category ID in the query
      const packages = await Package.find({
        servicecategories: category._id,
        $and: [
          {
            $or: [
              { servicesubcategories: { $exists: false } },
              { servicesubcategories: { $in: [""] } }
            ]
          },
          {
            $or: [
              { servicesubSubcategories: { $exists: false } },
              { servicesubSubcategories: { $in: [""] } }
            ]
          }
        ]
      });
      
      return res.status(200).json({
        data: {
          category: category.category,
          subcategory: null,
          subSubcategory: null,
          packages: packages.map(pkg => ({
            ...pkg.toJSON(),
            categoryId: category._id,
            subcategoryName: null,
            subSubcategoryName: null
          })),
          total: packages.length
        }
      });
    }

    // If not found in the main category, search in subcategories
    category = await ServiceCategory.findOne({ "subCategories.slug": slug });
    if (category) {
      subcategory = category.subCategories.find(sc => sc.slug === slug);
      
      // If slug belongs to a subcategory, use both category and subcategory IDs in the query
      const packages = await Package.find({
        servicecategories: category._id,
        servicesubcategories: subcategory._id,
        $or: [
          { servicesubSubcategories: { $exists: false } },
          { servicesubSubcategories: { $in: [""] } }
        ]
      });
      
      return res.status(200).json({
        data: {
          category: category.category,
          subcategory: subcategory.category,
          subSubcategory: null,
          packages: packages.map(pkg => ({
            ...pkg.toJSON(),
            categoryId: category._id,
            subcategoryName: subcategory.category,
            subSubcategoryName: null
          })),
          total: packages.length
        }
      });
    }

    // If not found in subcategories, search in sub-subcategories
    category = await ServiceCategory.findOne({ "subCategories.subSubCategory.slug": slug });
    if (category) {
      subcategory = category.subCategories.find(sc => sc.subSubCategory.some(ssc => ssc.slug === slug));
      if (subcategory) {
        subSubcategory = subcategory.subSubCategory.find(ssc => ssc.slug === slug);
        
        // If slug belongs to a sub-subcategory, use all three IDs in the query
        const packages = await Package.find({
          servicecategories: category._id,
          servicesubcategories: subcategory._id,
          servicesubSubcategories: subSubcategory._id
        });

        return res.status(200).json({
          data: {
            category: category.category,
            subcategory: subcategory.category,
            subSubcategory: subSubcategory.category,
            packages: packages.map(pkg => ({
              ...pkg.toJSON(),
              categoryId: category._id,
              subcategoryName: subcategory.category,
              subSubcategoryName: subSubcategory.category
            })),
            total: packages.length
          }
        });
      }
    }

    // If no matching category, subcategory, or sub-subcategory is found
    return res.status(404).json({ message: 'No category, subcategory, or sub-subcategory found for the given slug' });
  } catch (error) {
    console.error('Error retrieving packages:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const getPackageBySlugPackage = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the package by slug
    const package = await Package.findOne({ slug }); // Adjust according to your schema

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Construct the response
    const response = {
      packages: [
        {
          ...package.toJSON(),

        }
      ],
      total: 1 // Since we're only querying one package by slug
    };

    // Return the constructed response
    return res.status(200).json(response);

  } catch (error) {
    console.error('Error retrieving package by slug:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAllPackagesFront = async (req, res) => {
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
      result[categoryName] = {};

      if (category.subCategories && category.subCategories.length > 0) {
        // Category has subcategories
        for (const subCategory of category.subCategories) {
          const subCategoryName = subCategory.category;
          const packages = await Package.find({ subcategories: subCategory._id });
          
          if (packages.length > 0) {
            result[categoryName][subCategoryName] = packages;
          }
        }
      } else {
        // Category doesn't have subcategories
        const packages = await Package.find({ categories: category._id });
        
        if (packages.length > 0) {
          result[categoryName] = packages;
        }
      }
    }

    // Count total packages
    const totalPackages = Object.values(result).reduce((total, cat) => {
      if (Array.isArray(cat)) {
        return total + cat.length;
      } else {
        return total + Object.values(cat).reduce((subTotal, subCat) => subTotal + subCat.length, 0);
      }
    }, 0);

    res.status(200).json({
      data: result,
      total: totalPackages,
    });

  } catch (error) {
    console.error("Error retrieving packages:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};





const getSinglePackage = async (req, res) => {
  const { id } = req.params; // Correctly extract the id from req.params
  console.log(id); // Log the id for debugging purposes
  try {
    const pkg = await Package.findOne({ _id: id }); // Use an object with the _id field

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(pkg);
  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ message: 'Server error', error: error.message }); // Send the error message in the response
  }
};




const getCategoryPackages = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const packages = await Package.find({ categories: categoryId });

    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for this category' });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryPackages = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const packages = await Package.find({ subcategories: subcategoryId });

    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for this subcategory' });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryPackages = async (req, res) => {
  const { subSubCategoryId } = req.query;

  try {
    // Query to find packages that include the given subSubCategoryId
    const packages = await Package.find({ 'subSubCategories': subSubCategoryId });

    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for this sub-subcategory' });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getCategoryHeadingBySlug = async (req, res) => {
  const { slug } = req.params; // Get slug from request parameters

  try {
    // Fetch the main category and its nested subCategories and subSubCategory
    const packageData = await PackageCategory.findOne({
      $or: [
        { 'slug': slug }, // Main category slug
        { 'subCategories.slug': slug }, // Subcategory slug
        { 'subCategories.subSubCategory.slug': slug } // Sub-subcategory slug
      ]
    })
      .populate({
        path: 'subCategories.subSubCategory', // Populate subSubCategory within subCategories
        model: 'PackageCategory'
      })
      .exec();

    // Check if packageData is null or undefined
    if (!packageData) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if the slug exists in the main category
    if (packageData.slug === slug) {
      return res.status(200).json({ success: true, categoryType: 'category', categoryName: packageData.category });
    }

    // Check if the slug exists in the subcategories
    const subcategory = packageData.subCategories.find(sub => sub.slug === slug);
    if (subcategory) {
      return res.status(200).json({ success: true, categoryType: 'subcategory', categoryName: subcategory.category });
    }

    // Check if the slug exists in the sub-subcategories
    const subSubcategory = packageData.subCategories
      .flatMap(sub => sub.subSubCategory)
      .find(subSub => subSub.slug === slug);

    if (subSubcategory) {
      return res.status(200).json({ success: true, categoryType: 'subSubcategory', categoryName: subSubcategory.category });
    }

    // If the slug is not found in any category, return not found message
    return res.status(404).json({ success: false, message: 'Category not found in any category, subcategory, or sub-subcategory' });

  } catch (error) {
    console.error('Error fetching category by slug:', error);
    let errorMessage = 'An error occurred while fetching the category';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    return res.status(500).json({ success: false, message: errorMessage });
  }
};




module.exports = {
  insertPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getSinglePackage,
  getCategoryPackages,
  getSubcategoryPackages,
  getSubSubcategoryPackages,
  getAllPackagesSlug,getAllPackagesFront,getCategoryHeadingBySlug,getPackageBySlugPackage
};
