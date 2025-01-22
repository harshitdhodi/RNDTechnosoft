const PackageDescription = require("../model/packagedescription"); // Change to Package model
const fs = require("fs");
const path = require("path");
const PackageCategory = require("../model/packagecategory");

const insertPackage = async (req, res) => {
  try {
    const {
      title,
      description,
      categories,
      subcategories,
      subSubcategories,
      status,
    } = req.body;

    // Create a new Package with the dynamically selected slug
    const packageData = new PackageDescription({
      title,
      description,
      categories,
      subcategories,
      subSubcategories,
      status,
    });

    await packageData.save();
    res
      .status(201)
      .json({ message: "Package Description inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting package Description" });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params; // Get Package ID from request parameters
    const {
      title,
      description,
      categories, // category ID
      subcategories, // subcategory ID
      subSubcategories, // sub-subcategory ID
      status,
    } = req.body;

    // Fetch the existing package from the database
    const existingPackage = await PackageDescription.findById(id);

    if (!existingPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Prepare updateData object only with provided fields (partial updates, ignoring null values)
    const updateData = {};

    if (title !== undefined && title !== null) updateData.title = title;
    if (description !== undefined && description !== null)
      updateData.description = description;

    if (status !== undefined && status !== null) updateData.status = status;

    // Update the package with the provided fields
    const updatedPackage = await PackageDescription.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res
      .status(200)
      .json({
        message: "Package updated successfully",
        package: updatedPackage,
      });
  } catch (error) {
    console.log("Error updating package:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deletePackage = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    const deletedPackage = await PackageDescription.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const { page = 1, packageCategoryId } = req.query; // Get category filters from query
    const limit = 5;

    // Build query object dynamically based on provided filters
    let filter = {};

    if (packageCategoryId) {
      // Match by category slug instead of _id
      filter.categories = packageCategoryId; // Assuming `categories` is a slug, not ObjectId
    }

    const count = await PackageDescription.countDocuments(filter); // Count based on the filter

    // Find packages based on filters with pagination
    const packages = await PackageDescription.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    // Map over each package to find and append both category and service category names
    const packagesWithCategoryNames = await Promise.all(
      packages.map(async (pkg) => {
        // Fetch the corresponding package category using the slug
        const packageCategory = await PackageCategory.findOne({
          slug: pkg.categories,
        });
        const packageCategoryName = packageCategory
          ? packageCategory.category
          : "Uncategorized";

        // Return package with both category and service category names
        return {
          ...pkg.toJSON(),
          packageCategoryName,
        };
      })
    );

    res.status(200).json({
      data: packagesWithCategoryNames,
      total: count,
      currentPage: parseInt(page),
      hasNextPage: count > page * limit,
    });
  } catch (error) {
    console.error("Error retrieving packages:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllPackagesSlug = async (req, res) => {
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
      description: pkg.description,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    });

    // Generic function to find category hierarchy
    const findCategoryHierarchy = (category, targetSlug, type = "service") => {
      // Check if it's a main category
      if (category.slug === targetSlug) {
        return {
          mainCategory: category.slug,
          subCategory: null,
          subSubCategory: null,
          type: "main",
          categoryType: type,
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
            type: "sub",
            categoryType: type,
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
            type: "subsub",
            categoryType: type,
          };
        }
      }

      return null;
    };

    // Find packages based on hierarchy
    const findPackagesByHierarchy = async (hierarchy) => {
      let queryField = {
        mainCat: "categories",
        subCat: "subcategories",
        subSubCat: "subSubcategories",
      };

      switch (hierarchy.type) {
        case "main":
          return await PackageDescription.find({
            [queryField.mainCat]: hierarchy.mainCategory,
          });

        case "sub":
          return await PackageDescription.find({
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory },
                ],
              },
            ],
          });

        case "subsub":
          return await PackageDescription.find({
            $or: [
              { [queryField.mainCat]: hierarchy.mainCategory },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory },
                ],
              },
              {
                $and: [
                  { [queryField.mainCat]: hierarchy.mainCategory },
                  { [queryField.subCat]: hierarchy.subCategory },
                  { [queryField.subSubCat]: hierarchy.subSubCategory },
                ],
              },
            ],
          });
      }
    };

    // // Step 1: Try to find in ServiceCategory first
    // const serviceCategory = await ServiceCategory.findOne({
    //   $or: [
    //     { slug: slug },
    //     { "subCategories.slug": slug },
    //     { "subCategories.subSubCategory.slug": slug },
    //   ],
    // }).lean();

    let hierarchy = null;
    let packages = [];

    // if (serviceCategory) {
    //   hierarchy = findCategoryHierarchy(serviceCategory, slug, "service");
    //   if (hierarchy) {
    //     packages = await findPackagesByHierarchy(hierarchy);
    //   }
    // }

    // Step 2: If not found in ServiceCategory, try PackageCategory
    if (!hierarchy) {
      const packageCategory = await PackageCategory.findOne({
        $or: [
          { slug: slug },
          { "subCategories.slug": slug },
          { "subCategories.subSubCategory.slug": slug },
        ],
      }).lean();

      if (!packageCategory) {
        return res.status(404).json({
          message: "Category not found in both service and package categories",
        });
      }

      hierarchy = findCategoryHierarchy(packageCategory, slug, "package");
      if (!hierarchy) {
        return res.status(404).json({
          message: "Category hierarchy not found",
        });
      }

      packages = await findPackagesByHierarchy(hierarchy);
    }

    // If no packages found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message: "No packages found for the given category or its parents",
        hierarchy,
      });
    }

    // Return the packages with hierarchy information
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length,
        hierarchy,
      },
    });
  } catch (error) {
    console.error("Error retrieving packages:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
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
     
      description: pkg.description,
   
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    });

    // Query to find packages where all specified fields are empty or contain only empty spaces
    const packages = await PackageDescription.find({
      categories: { $in: ["", " "] },
      subcategories: { $in: ["", " "] },
      subSubcategories: { $in: ["", " "] },
    });

    // If no packages are found
    if (!packages || packages.length === 0) {
      return res.status(404).json({
        message:
          "No packages found with all categories, subcategories, and service categories empty",
      });
    }

    // Return the found packages
    return res.status(200).json({
      data: {
        packages: packages.map(formatPackage),
        total: packages.length,
      },
    });
  } catch (error) {
    console.error("Error retrieving empty category packages:", error);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getPackagesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // First try to find direct package matches
    let packages = await PackageDescription.find({ slug });

    if (!packages || packages.length === 0) {
      // Look for the slug in main categories and their subcategories
      const categoryQuery = await PackageCategory.findOne({
        $or: [
          { slug }, // Check main category slug
          { "subCategories.slug": slug }, // Check subcategory slugs
        ],
      });

      if (!categoryQuery) {
        return res.status(404).json({
          success: false,
          message: "No packages or categories found for the given slug",
        });
      }

      // Determine if we found a main category or subcategory
      let categorySlug;
      if (categoryQuery.slug === slug) {
        // Main category found
        categorySlug = categoryQuery.slug;
      } else {
        // Subcategory found
        const subcategory = categoryQuery.subCategories.find(
          (sub) => sub.slug === slug
        );
        categorySlug = subcategory.slug;
      }

      // Find packages for the identified category
      packages = await Package.find({
        $or: [{ categorySlug }, { "category.slug": categorySlug }],
      });

      if (!packages || packages.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Category found but no packages are associated with it",
          categoryDetails: {
            name: categoryQuery.category,
            slug: categorySlug,
          },
        });
      }
    }

    // Construct the response
    const response = {
      success: true,
      count: packages.length,
      packages: packages.map((pkg) => ({
        ...pkg.toJSON(),
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving packages by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


const getSinglePackage = async (req, res) => {
  const { id } = req.params; // Correctly extract the id from req.params

  try {
    const pkg = await PackageDescription.findById(id); // Use findById for querying by _id

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(pkg);
  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ message: "Server error", error: error.message }); // Send the error message in the response
  }
};

const getCategoryPackages = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const packages = await PackageDescription.find({ categories: categoryId });

    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No packages found for this category" });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubcategoryPackages = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const packages = await PackageDescription.find({ subcategories: subcategoryId });

    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No packages found for this subcategory" });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSubSubcategoryPackages = async (req, res) => {
  const { subSubCategoryId } = req.query;

  try {
    // Query to find packages that include the given subSubCategoryId
    const packages = await PackageDescription.find({ subSubCategories: subSubCategoryId });

    if (packages.length === 0) {
      return res
        .status(404)
        .json({ message: "No packages found for this sub-subcategory" });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getCategoryHeadingBySlug = async (req, res) => {
  const { slug } = req.params; // Get slug from request parameters

  try {
    // Fetch the main category and its nested subCategories and subSubCategory
    const packageData = await PackageCategory.findOne({
      $or: [
        { slug: slug }, // Main category slug
        { "subCategories.slug": slug }, // Subcategory slug
        { "subCategories.subSubCategory.slug": slug }, // Sub-subcategory slug
      ],
    })
      .populate({
        path: "subCategories.subSubCategory", // Populate subSubCategory within subCategories
        model: "PackageCategory",
      })
      .exec();

    // Check if packageData is null or undefined
    if (!packageData) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check if the slug exists in the main category
    if (packageData.slug === slug) {
      return res
        .status(200)
        .json({
          success: true,
          categoryType: "category",
          categoryName: packageData.category,
        });
    }

    // Check if the slug exists in the subcategories
    const subcategory = packageData.subCategories.find(
      (sub) => sub.slug === slug
    );
    if (subcategory) {
      return res
        .status(200)
        .json({
          success: true,
          categoryType: "subcategory",
          categoryName: subcategory.category,
        });
    }

    // Check if the slug exists in the sub-subcategories
    const subSubcategory = packageData.subCategories
      .flatMap((sub) => sub.subSubCategory)
      .find((subSub) => subSub.slug === slug);

    if (subSubcategory) {
      return res
        .status(200)
        .json({
          success: true,
          categoryType: "subSubcategory",
          categoryName: subSubcategory.category,
        });
    }

    // If the slug is not found in any category, return not found message
    return res
      .status(404)
      .json({
        success: false,
        message:
          "Category not found in any category, subcategory, or sub-subcategory",
      });
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    let errorMessage = "An error occurred while fetching the category";
    if (error.name === "CastError") {
      errorMessage = "Invalid query parameter format";
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
  getAllPackagesSlug,
  getCategoryHeadingBySlug,
  getPackagesBySlug,
};
