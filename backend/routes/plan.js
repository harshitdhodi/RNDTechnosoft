const express = require('express');
const {
  insertPackage,
  updatePackage,
  deletePackage,
  getAllPackages,
  getStandardPackage,
  getSinglePackage,
  getCategoryPackages,
  getSubcategoryPackages,getPackagesByCategoryOrSubcategory,
  getSubSubcategoryPackages,getAllnormalPackagesSlug,getAllhourlyPackagesSlug,getAllPackagesFront,getPackagesBySlug
  ,getCategoryHeadingBySlug
} = require('../controller/plan'); // Adjust the path as necessary
const {insertCategory,insertSubCategory,insertSubSubCategory,updateCategory,updateSubCategory,updatesubsubcategory,deletecategory,deletesubcategory,deletesubsubcategory,getAll,getSpecificCategory,getSpecificSubcategory,getSpecificSubSubcategory,fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq,  fetchCategoryUrlPriorityFreqById,fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById }= require('../controller/packagecategory')
const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');
const {uploadfiles} = require('../middleware/files');
const {uploadLogo}=require("../middleware/logoUpload")
const router = express.Router();

// Route to insert a new plan
router.post('/insertPackage', insertPackage);

// Route to update a plan
router.put('/updatePackage/:id', updatePackage);

// Route to delete a plan
router.delete('/delete', deletePackage);

// Route to get all plans with pagination
router.get('/', getAllPackages);

// Route to get a single plan by slug
router.get('/single/:id', getSinglePackage);


// Route to get plans by category
router.get('/category', getCategoryPackages);

// Route to get plans by subcategory
router.get('/subcategory', getSubcategoryPackages);
router.get('/subsubcategory', getSubSubcategoryPackages);
router.get('/getPackagesByCategoryOrSubcategory', getPackagesByCategoryOrSubcategory)
router.get('/front/:slug',getAllnormalPackagesSlug)
router.get('/hourlypackage/:slug',getAllhourlyPackagesSlug)

router.get("/front",getAllPackagesFront)
router.get("/getStandardPackage",getStandardPackage)

// Route to get the heading in front  by slug
router.get('/heading/:slug', getCategoryHeadingBySlug);

// Route to get the packages for the package page according to slug
router.get('/specific/:slug', getPackagesBySlug);

router.post('/insertCategory',requireAuth,uploadLogo,insertCategory)
router.post('/insertSubCategory',requireAuth,uploadLogo,insertSubCategory)
router.post('/insertSubSubCategory',requireAuth,uploadLogo,insertSubSubCategory)
router.put('/updateCategory',requireAuth,uploadLogo,updateCategory)
router.put('/updateSubCategory',requireAuth,uploadLogo,updateSubCategory)
router.put('/updatesubsubcategory',requireAuth,uploadLogo,updatesubsubcategory)
router.delete('/deletecategory',requireAuth,deletecategory)
router.delete('/deletesubcategory',requireAuth,deletesubcategory)
router.delete('/deletesubsubcategory',requireAuth,deletesubsubcategory)
router.get('/getAll',requireAuth,getAll)
router.get('/getSpecificCategory',requireAuth,getSpecificCategory)
router.get('/getSpecificSubcategory',requireAuth,getSpecificSubcategory)
router.get('/getSpecificSubSubcategory',requireAuth,getSpecificSubSubcategory)
router.get('/fetchCategoryUrlPriorityFreq',requireAuth,fetchCategoryUrlPriorityFreq)
router.put('/editCategoryUrlPriorityFreq',requireAuth,editCategoryUrlPriorityFreq)
// router.delete('/deleteCategoryUrlPriorityFreq',requireAuth,deleteCategoryUrlPriorityFreq)
router.get('/fetchCategoryUrlPriorityFreqById',requireAuth,fetchCategoryUrlPriorityFreqById)
router.get('/fetchCategoryUrlmeta', requireAuth, fetchCategoryUrlmeta)
router.put('/editCategoryUrlmeta', requireAuth, editCategoryUrlmeta)
router.get('/fetchCategoryUrlmetaById', requireAuth, fetchCategoryUrlmetaById)



module.exports = router;
