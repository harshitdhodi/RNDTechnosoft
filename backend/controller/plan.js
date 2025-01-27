const Package = require("../model/packages"); // Change to Package model
const ServiceCategory = require("../model/serviceCategory"); // Adjust this if necessary
const fs = require('fs');
const path = require('path');
const PackageCategory = require("../model/packagecategory")

const insertPackage = async (req, res) => {
  try {
    const { 
      title, 
      packagetype,
      description,  
      price, 
      whatIsTheir, 
      whatIsNotTheir, 
      categories,       
      subcategories,     
      subSubcategories,  
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
      status, 
      slug // This slug should only be used if provided in the request
    } = req.body;

   
    // Fetch the main category
    const category = await PackageCategory.findOne({ slug: categories });
   

    // Declare slug with `let` to allow reassignment
    let dynamicSlug = slug;  // Use a separate variable to avoid conflicts with const

    // Determine the correct slug based on category, subcategory, and subsubcategory
    if (!dynamicSlug) {
      if (categories && subcategories && subSubcategories) {
        const subcategory = category.subCategories.find(sub => sub.slug === subcategories);
      

        const subSubcategory = subcategory.subSubCategory.find(subSub => subSub.slug === subSubcategories);
      
        dynamicSlug = subSubcategory.slug;  // Reassigning the slug here
      } else if (categories && subcategories) {
        const subcategory = category.subCategories.find(sub => sub.slug === subcategories);
        
        dynamicSlug = subcategory.slug;  // Reassigning the slug here
      } else if (categories) {
        dynamicSlug = category.slug;  // Reassigning the slug here
      }
    }

    // Create a new Package with the dynamically selected slug
    const packageData = new Package({
      title,
      packagetype,
      description,
      price,
      whatIsTheir,
      whatIsNotTheir,
      categories,
      subcategories,
      subSubcategories,
      servicecategories,
      servicesubcategories,
      servicesubSubcategories,
      status,
      slug: dynamicSlug // Use the dynamic slug here
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
      packagetype,
      description, 
      price, 
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
    if (packagetype !== undefined && packagetype !== null) updateData.packagetype = packagetype;
    if (description !== undefined && description !== null) updateData.description = description;
   
    if (price !== undefined && price !== null) updateData.price = price;

    if (whatIsTheir !== undefined && whatIsTheir !== null) updateData.whatIsTheir = whatIsTheir;
    if (whatIsNotTheir !== undefined && whatIsNotTheir !== null) updateData.whatIsNotTheir = whatIsNotTheir;
    if (servicecategories !== undefined && servicecategories !== null) updateData.servicecategories = servicecategories;
    if (servicesubcategories !== undefined && servicesubcategories !== null) updateData.servicesubcategories = servicesubcategories;
    if (servicesubSubcategories !== undefined && servicesubSubcategories !== null) updateData.servicesubSubcategories = servicesubSubcategories;
    if (status !== undefined && status !== null) updateData.status = status;

    // Handle category-related updates separately if any category field is provided (excluding null)
    if (categories || subcategories || subSubcategories) {
      if (categories) {
        const category = await PackageCategory.findOne({slug:categories});
        if (!category) {
          return res.status(404).json({ message: 'Main category not found' });
        }

        // Determine slug based on the category/subcategory/subsubcategory structure
        let slug;

        if (categories && subcategories && subSubcategories) {
          const subcategory = category.subCategories.find(sub => sub.slug === subcategories);
          if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
          }

          const subSubcategory = subcategory.subSubCategory.find(subSub => subSub.slug === subSubcategories);
          if (!subSubcategory) {
            return res.status(404).json({ message: 'Sub-subcategory not found' });
          }

          slug = subSubcategory.slug;

        } else if (categories && subcategories) {
          const subcategory = category.subCategories.find(sub => sub.slug === subcategories);
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
    const deletedPackage = await Package.findByIdAndDelete(id);

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
    const limit = 20;

    // Build query object dynamically based on provided filters
    let filter = {};
    
    if (packageCategoryId) {
      // Match by category slug instead of _id
      filter.categories = packageCategoryId; // Assuming `categories` is a slug, not ObjectId
    }

    if (serviceCategoryId) {
      // Match by service category slug instead of _id
      filter.servicecategories = serviceCategoryId; // Assuming `servicecategories` is a slug, not ObjectId
    }

    const count = await Package.countDocuments(filter); // Count based on the filter

    // Find packages based on filters with pagination
    const packages = await Package.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    // Map over each package to find and append both category and service category names
    const packagesWithCategoryNames = await Promise.all(packages.map(async (pkg) => {
      // Fetch the corresponding package category using the slug
      const packageCategory = await PackageCategory.findOne({ slug: pkg.categories });
      const packageCategoryName = packageCategory ? packageCategory.category : 'Uncategorized';

      // Fetch the corresponding service category using the slug
      const serviceCategory = await ServiceCategory.findOne({ slug: pkg.servicecategories });
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


const getAllnormalPackagesSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Helper function to format package data
    const formatPackage = (pkg) => ({
      _id: pkg._id,
      title: pkg.title,
      status: pkg.status,
      categories: pkg.categories,
      subcategories: pkg.subcategories,
      subSubcategories: pkg.subSubcategories,
      servicecategories: pkg.servicecategories,
      servicesubcategories: pkg.servicesubcategories,
      servicesubSubcategories: pkg.servicesubSubcategories,
      description: pkg.description,
      price: pkg.price,
      whatIsTheir: pkg.whatIsTheir,
      whatIsNotTheir: pkg.whatIsNotTheir,
      slug: pkg.slug,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    });

    // Generic function to find category hierarchy
    const findCategoryHierarchy = (category, targetSlug, type = 'service') => {
      // Check if it's a main category
      if (category.slug === targetSlug) {
        return {
          mainCategory: category.slug,
          subCategory: null,
          subSubCategory: null,
          type: 'main',
          categoryType: type
        };
      }

      // Check in subCategories
      for (const subCategory of category.subCategories) {
        // Check if it's a subcategory
        if (subCategory.slug === targetSlug) {
          return {
            mainCategory: category.slug,
            subCategory: subCategory.slug,
            subSubCategory: null,
            type: 'sub',
            categoryType: type
          };
        }

        // Check in subSubCategory
        const subSubCategory = subCategory.subSubCategory?.find(
          (subSub) => subSub.slug === targetSlug
        );

        if (subSubCategory) {
          return {
            mainCategory: category.slug,
            subCategory: subCategory.slug,
            subSubCategory: subSubCategory.slug,
            type: 'subsub',
            categoryType: type
          };
        }
      }

      return null;
    };

    // Find packages based on hierarchy
    const findPackagesByHierarchy = async (hierarchy) => {
      let queryField = hierarchy.categoryType === 'service' 
        ? {
            mainCat: 'servicecategories',
            subCat: 'servicesubcategories',
            subSubCat: 'servicesubSubcategories'
          }
        : {
            mainCat: 'categories',
            subCat: 'subcategories',
            subSubCat: 'subSubcategories'
          };

          const baseQuery = { packagetype: 'normal' }; 

      switch (hierarchy.type) {
        case 'main':
          return await Package.find({
            ...baseQuery,
            [queryField.mainCat]: hierarchy.mainCategory
          });

        case 'sub':
          return await Package.find({
            ...baseQuery,
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory }
                ]
              }
            ]
          });

        case 'subsub':
          return await Package.find({
            ...baseQuery,
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory }
                ]
              },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory },
                  { [queryField.subSubCat]: hierarchy.subSubCategory }
                ]
              }
            ]
          });
      }
    };

  
    const serviceCategory = await ServiceCategory.findOne({
      $or: [
        { slug: slug },
       
        { "subCategories.slug": slug },
        { "subCategories.subSubCategory.slug": slug }
      ]
    }).lean();

    let hierarchy = null;
    let packages = [];

    if (serviceCategory) {
      hierarchy = findCategoryHierarchy(serviceCategory, slug, 'service');
      if (hierarchy) {
        packages = await findPackagesByHierarchy(hierarchy);
      }
    }

    // Step 2: If not found in ServiceCategory, try PackageCategory
    if (!hierarchy) {
      const packageCategory = await PackageCategory.findOne({
        $or: [
          { slug: slug },
          { "subCategories.slug": slug },
          { "subCategories.subSubCategory.slug": slug }
        ]
      }).lean();

      if (!packageCategory) {
        return res.status(404).json({ 
          message: 'Category not found in both service and package categories' 
        });
      }

      hierarchy = findCategoryHierarchy(packageCategory, slug, 'package');
      if (!hierarchy) {
        return res.status(404).json({ 
          message: 'Category hierarchy not found' 
        });
      }

      packages = await findPackagesByHierarchy(hierarchy);
    }

    // If no packages found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message: 'No packages found for the given category or its parents',
        hierarchy
      });
    }

    // Return the packages with hierarchy information
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length,
        hierarchy
      }
    });

  } catch (error) {
    console.error('Error retrieving packages:', error);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const getAllhourlyPackagesSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Helper function to format package data
    const formatPackage = (pkg) => ({
      _id: pkg._id,
      title: pkg.title,
      status: pkg.status,
      categories: pkg.categories,
      subcategories: pkg.subcategories,
      subSubcategories: pkg.subSubcategories,
      servicecategories: pkg.servicecategories,
      servicesubcategories: pkg.servicesubcategories,
      servicesubSubcategories: pkg.servicesubSubcategories,
      description: pkg.description,
      price: pkg.price,
      whatIsTheir: pkg.whatIsTheir,
      whatIsNotTheir: pkg.whatIsNotTheir,
      slug: pkg.slug,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    });

    // Generic function to find category hierarchy
    const findCategoryHierarchy = (category, targetSlug, type = 'service') => {
      // Check if it's a main category
      if (category.slug === targetSlug) {
        return {
          mainCategory: category.slug,
          subCategory: null,
          subSubCategory: null,
          type: 'main',
          categoryType: type
        };
      }

      // Check in subCategories
      for (const subCategory of category.subCategories) {
        // Check if it's a subcategory
        if (subCategory.slug === targetSlug) {
          return {
            mainCategory: category.slug,
            subCategory: subCategory.slug,
            subSubCategory: null,
            type: 'sub',
            categoryType: type
          };
        }

        // Check in subSubCategory
        const subSubCategory = subCategory.subSubCategory?.find(
          (subSub) => subSub.slug === targetSlug
        );

        if (subSubCategory) {
          return {
            mainCategory: category.slug,
            subCategory: subCategory.slug,
            subSubCategory: subSubCategory.slug,
            type: 'subsub',
            categoryType: type
          };
        }
      }

      return null;
    };

    // Find packages based on hierarchy
    const findPackagesByHierarchy = async (hierarchy) => {
      let queryField = hierarchy.categoryType === 'service' 
        ? {
            mainCat: 'servicecategories',
            subCat: 'servicesubcategories',
            subSubCat: 'servicesubSubcategories'
          }
        : {
            mainCat: 'categories',
            subCat: 'subcategories',
            subSubCat: 'subSubcategories'
          };

          const baseQuery = { packagetype: 'hourly' }; 

      switch (hierarchy.type) {
        case 'main':
          return await Package.find({
            ...baseQuery,
            [queryField.mainCat]: hierarchy.mainCategory
          });

        case 'sub':
          return await Package.find({
            ...baseQuery,
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory }
                ]
              }
            ]
          });

        case 'subsub':
          return await Package.find({
            ...baseQuery,
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory }
                ]
              },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory },
                  { [queryField.subSubCat]: hierarchy.subSubCategory }
                ]
              }
            ]
          });
      }
    };

  
    const serviceCategory = await ServiceCategory.findOne({
      $or: [
        { slug: slug },
       
        { "subCategories.slug": slug },
        { "subCategories.subSubCategory.slug": slug }
      ]
    }).lean();

    let hierarchy = null;
    let packages = [];

    if (serviceCategory) {
      hierarchy = findCategoryHierarchy(serviceCategory, slug, 'service');
      if (hierarchy) {
        packages = await findPackagesByHierarchy(hierarchy);
      }
    }

    // Step 2: If not found in ServiceCategory, try PackageCategory
    if (!hierarchy) {
      const packageCategory = await PackageCategory.findOne({
        $or: [
          { slug: slug },
          { "subCategories.slug": slug },
          { "subCategories.subSubCategory.slug": slug }
        ]
      }).lean();

      if (!packageCategory) {
        return res.status(404).json({ 
          message: 'Category not found in both service and package categories' 
        });
      }

      hierarchy = findCategoryHierarchy(packageCategory, slug, 'package');
      if (!hierarchy) {
        return res.status(404).json({ 
          message: 'Category hierarchy not found' 
        });
      }

      packages = await findPackagesByHierarchy(hierarchy);
    }

    // If no packages found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message: 'No packages found for the given category or its parents',
        hierarchy
      });
    }

    // Return the packages with hierarchy information
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length,
        hierarchy
      }
    });

  } catch (error) {
    console.error('Error retrieving packages:', error);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const getStandardPackage = async (req, res) => {
  try {
    // Helper function to format package data
    const formatPackage = (pkg) => ({
      _id: pkg._id,
      title: pkg.title,
      status: pkg.status,
      categories: pkg.categories,
      subcategories: pkg.subcategories,
      subSubcategories: pkg.subSubcategories,
      servicecategories: pkg.servicecategories,
      servicesubcategories: pkg.servicesubcategories,
      servicesubSubcategories: pkg.servicesubSubcategories,
      description: pkg.description,
      price: pkg.price,
      whatIsTheir: pkg.whatIsTheir,
      whatIsNotTheir: pkg.whatIsNotTheir,
      slug: pkg.slug,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    });

    // Query to find packages where all specified fields are empty or contain only empty spaces
    const packages = await Package.find({
      categories: { $in: ["", " "] },
      subcategories: { $in: ["", " "] },
      subSubcategories: { $in: ["", " "] },
      servicecategories: { $in: ["", " "] },
      servicesubcategories: { $in: ["", " "] },
      servicesubSubcategories: { $in: ["", " "] }
    });

    // If no packages are found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message: 'No packages found with all categories, subcategories, and service categories empty'
      });
    }

    // Return the found packages
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length
      }
    });

  } catch (error) {
    console.error('Error retrieving empty category packages:', error);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const getPackagesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // First try to find direct package matches
    let packages = await Package.find({ slug });

    if (!packages || packages.length === 0) {
      // Look for the slug in main categories and their subcategories
      const categoryQuery = await PackageCategory.findOne({
        $or: [
          { slug }, // Check main category slug
          { 'subCategories.slug': slug } // Check subcategory slugs
        ]
      });

      if (!categoryQuery) {
        return res.status(404).json({
          success: false,
          message: 'No packages or categories found for the given slug'
        });
      }

      // Determine if we found a main category or subcategory
      let categorySlug;
      if (categoryQuery.slug === slug) {
        // Main category found
        categorySlug = categoryQuery.slug;
      } else {
        // Subcategory found
        const subcategory = categoryQuery.subCategories.find(sub => sub.slug === slug);
        categorySlug = subcategory.slug;
      }

      // Find packages for the identified category
      packages = await Package.find({ 
        $or: [
          { categorySlug },
          { 'category.slug': categorySlug }
        ]
      });

      if (!packages || packages.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category found but no packages are associated with it',
          categoryDetails: {
            name: categoryQuery.category,
            slug: categorySlug
          }
        });
      }
    }

    // Construct the response
    const response = {
      success: true,
      count: packages.length,
      packages: packages.map(pkg => ({
        ...pkg.toJSON(),
        
      }))
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error retrieving packages by slug:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
          const packages = await Package.find({ subcategories: subCategory.slug });
          
          if (packages.length > 0) {
            result[categoryName][subCategoryName] = packages;
          }
        }
      } else {
        // Category doesn't have subcategories
        const packages = await Package.find({ categories: category.slug });
        
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

const getPackagesByCategoryOrSubcategory = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug is required'
      });
    }

    // Find packages that belong to the given category or subcategory
    const packages = await Package.find({
      $or: [
        { categories: slug },
        { subcategories: slug }
      ]
    });

    if (!packages || packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No packages found for the given category or subcategory'
      });
    }

    // Format the packages
    const formattedPackages = packages.map(pkg => ({
      _id: pkg._id,
      title: pkg.title,
      status: pkg.status,
      categories: pkg.categories,
      subcategories: pkg.subcategories,
      subSubcategories: pkg.subSubcategories,
      servicecategories: pkg.servicecategories,
      servicesubcategories: pkg.servicesubcategories,
      servicesubSubcategories: pkg.servicesubSubcategories,
      description: pkg.description,
      price: pkg.price,
      whatIsTheir: pkg.whatIsTheir,
      whatIsNotTheir: pkg.whatIsNotTheir,
      slug: pkg.slug,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    }));

    return res.status(200).json({
      success: true,
      count: formattedPackages.length,
      packages: formattedPackages
    });

  } catch (error) {
    console.error('Error retrieving packages by category or subcategory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



const getSinglePackage = async (req, res) => {
  const { id } = req.params; // Correctly extract the id from req.params

  try {
    const pkg = await Package.findById(id); // Use findById for querying by _id

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
  getStandardPackage,
  getSinglePackage,
  getCategoryPackages,
  getSubcategoryPackages,
  getSubSubcategoryPackages,
  getPackagesByCategoryOrSubcategory,
  getAllnormalPackagesSlug,getAllhourlyPackagesSlug,getAllPackagesFront,getCategoryHeadingBySlug,getPackagesBySlug
};
