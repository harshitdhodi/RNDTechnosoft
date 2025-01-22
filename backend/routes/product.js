const express = require('express');
const router = express.Router();
const {getAllProductsFront, countProducts, insertProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct, getCategoryProducts, getSubcategoryProducts, getSubSubcategoryProducts, deletePhotoAndAltText, exportProductsToExcel, importProducts, fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById, fetchUrlmeta, editUrlmeta, fetchUrlmetaById, downloadCatalogue, viewCatalogue } = require('../controller/product')
const { uploadPhoto } = require('../middleware/fileUpload')
const { insertCategory, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq, fetchCategoryUrlPriorityFreqById, fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById } = require('../controller/productcategory')
const { requireAuth } = require('../middleware/authmiddleware');
const { uploadfiles } = require('../middleware/files');
const { uploadLogo } = require("../middleware/logoUpload")

router.post('/insertProduct', requireAuth, uploadPhoto, insertProduct)
router.get('/getAllProducts', requireAuth, getAllProducts)
router.put('/updateProduct', requireAuth, uploadPhoto, updateProduct)
router.delete('/deleteProduct', requireAuth, deleteProduct)
router.get('/getSingleProduct', requireAuth, getSingleProduct)
router.get('/getCategoryProducts', requireAuth, getCategoryProducts)
router.get('/getSubcategoryProducts', requireAuth, getSubcategoryProducts)
router.get('/getSubSubcategoryProducts', requireAuth, getSubSubcategoryProducts)
router.get('/countProduct', requireAuth, countProducts)
router.delete('/:id/image/:imageFilename/:index', requireAuth, deletePhotoAndAltText)
router.get('/exportProduct', requireAuth, exportProductsToExcel)
router.post('/importProduct', requireAuth, uploadfiles, importProducts)
router.get('/fetchUrlPriorityFreq', fetchUrlPriorityFreq)
router.put('/editUrlPriorityFreq', requireAuth, editUrlPriorityFreq)
// router.delete('/deleteUrlPriorityFreq',requireAuth,deleteUrlPriorityFreq)
router.get('/fetchUrlPriorityFreqById', requireAuth, fetchUrlPriorityFreqById)
router.get('/fetchUrlmeta', fetchUrlmeta)
router.put('/editUrlmeta', requireAuth, editUrlmeta)
router.get('/fetchUrlmetaById', requireAuth, fetchUrlmetaById)
router.get('/download/:filename',requireAuth, downloadCatalogue);
router.get('/view/:filename',requireAuth, viewCatalogue);




router.post('/insertCategory', requireAuth, uploadLogo, insertCategory)
router.post('/insertSubCategory', requireAuth, uploadLogo, insertSubCategory)
router.post('/insertSubSubCategory', requireAuth, uploadLogo, insertSubSubCategory)
router.put('/updateCategory', requireAuth, uploadLogo, updateCategory)
router.put('/updateSubCategory', requireAuth, uploadLogo, updateSubCategory)
router.put('/updatesubsubcategory', requireAuth, uploadLogo, updatesubsubcategory)
router.delete('/deletecategory', requireAuth, deletecategory)
router.delete('/deletesubcategory', requireAuth, deletesubcategory)
router.delete('/deletesubsubcategory', requireAuth, deletesubsubcategory)
router.get('/getAll', requireAuth, getAll)
router.get('/getSpecificCategory', requireAuth, getSpecificCategory)
router.get('/getSpecificSubcategory', requireAuth, getSpecificSubcategory)
router.get('/getSpecificSubSubcategory', requireAuth, getSpecificSubSubcategory)
router.get('/fetchCategoryUrlPriorityFreq', requireAuth, fetchCategoryUrlPriorityFreq)
router.put('/editCategoryUrlPriorityFreq', requireAuth, editCategoryUrlPriorityFreq)
// router.delete('/deleteCategoryUrlPriorityFreq',requireAuth,deleteCategoryUrlPriorityFreq)
router.get('/fetchCategoryUrlPriorityFreqById', requireAuth, fetchCategoryUrlPriorityFreqById)
router.get('/fetchCategoryUrlmeta', fetchCategoryUrlmeta)
router.put('/editCategoryUrlmeta', requireAuth, editCategoryUrlmeta)
router.get('/fetchCategoryUrlmetaById', requireAuth, fetchCategoryUrlmetaById)
router.get("/front",getAllProductsFront)



module.exports = router;