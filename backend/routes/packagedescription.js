const express = require("express");
const {
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
  getPackagesBySlug,
  getCategoryHeadingBySlug,
} = require("../controller/packagedescription"); // Adjust the path as necessary

const router = express.Router();

// Route to insert a new plan
router.post("/insertPackage", insertPackage);

// Route to update a plan
router.put("/updatePackage/:id", updatePackage);

// Route to delete a plan
router.delete("/delete", deletePackage);

// Route to get all plans with pagination
router.get("/", getAllPackages);

// Route to get a single plan by slug
router.get("/single/:id", getSinglePackage);

// Route to get plans by category
router.get("/category", getCategoryPackages);

// Route to get plans by subcategory
router.get("/subcategory", getSubcategoryPackages);
router.get("/subsubcategory", getSubSubcategoryPackages);

router.get("/front/:slug", getAllPackagesSlug);

router.get("/getStandardPackage", getStandardPackage);

// Route to get the heading in front  by slug
router.get("/heading/:slug", getCategoryHeadingBySlug);

// Route to get the packages for the package page according to slug
router.get("/specific/:slug", getPackagesBySlug);

module.exports = router;
