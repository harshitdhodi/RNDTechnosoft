const express = require('express');
const router = express.Router();

const {insertService,getAllServices,updateService,deleteService,getSingleService, countServices,deletePhotoAndAltText,exportServicesToExcel,importServices,fetchUrlPriorityFreq,editUrlPriorityFreq,fetchUrlPriorityFreqById,fetchUrlmeta, editUrlmeta, fetchUrlmetaById   } = require('../controller/services') 
const {getServicesBySlug,getCategory,insertCategory,insertSubCategory,insertSubSubCategory,updateCategory,updateSubCategory,updatesubsubcategory,deletecategory,deletesubcategory,deletesubsubcategory,getAll,getSpecificCategory,getSpecificSubcategory,getSpecificSubSubcategory,fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq,  fetchCategoryUrlPriorityFreqById,fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById }= require('../controller/servicecategory')

const {uploadPhoto} = require('../middleware/fileUpload')
const { requireAuth } = require('../middleware/authmiddleware');
const {uploadfiles} = require('../middleware/files');
const {uploadLogo}=require("../middleware/logoUpload")

router.post('/insertService',requireAuth,uploadPhoto,insertService);
router.get('/getService',requireAuth,getAllServices)
router.put('/updateService',requireAuth, uploadPhoto, updateService);
router.delete('/deleteService',requireAuth,deleteService);
router.get('/singleService',requireAuth,getSingleService)
router.get('/countService',requireAuth,countServices )
router.delete('/:id/image/:imageFilename/:index',requireAuth,deletePhotoAndAltText )
router.get('/exportService',requireAuth,exportServicesToExcel)
router.post('/importService',requireAuth,uploadfiles,importServices);
router.get('/fetchUrlPriorityFreq',requireAuth,fetchUrlPriorityFreq)
router.put('/editUrlPriorityFreq',requireAuth,editUrlPriorityFreq)
// router.delete('/deleteUrlPriorityFreq',requireAuth,deleteUrlPriorityFreq)
router.get('/fetchUrlPriorityFreqById',requireAuth,fetchUrlPriorityFreqById)
router.get('/fetchUrlmeta', requireAuth, fetchUrlmeta)
router.put('/editUrlmeta', requireAuth, editUrlmeta)
router.get('/fetchUrlmetaById', requireAuth, fetchUrlmetaById)


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
router.get('/getCategory',getCategory) 
router.get('/getServicesBySlug',getServicesBySlug) 
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