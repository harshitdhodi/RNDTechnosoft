const express = require('express');
const router = express.Router();

const {insertCategory,insertSubCategory,insertSubSubCategory,updateCategory,updateSubCategory,updatesubsubcategory,deletecategory,deletesubcategory,deletesubsubcategory,getAll,getSpecificCategory,getSpecificSubcategory,getSpecificSubSubcategory,fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq,  fetchCategoryUrlPriorityFreqById,fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById }= require('../controller/industriescategory')
const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');
const {uploadfiles} = require('../middleware/files');
const {uploadLogo}=require("../middleware/logoUpload")



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