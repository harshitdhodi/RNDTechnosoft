const express = require('express');
const router = express.Router();

const { insertNews,getNewsFront,getNewsBySlug, getNews, updateNews, deleteNews, getNewsById, countNews, deletePhotoAndAltText, fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById,fetchUrlmeta, editUrlmeta, fetchUrlmetaById  } = require('../controller/news');
const { getCategoryBySlug,getCategoryBlogsBySlug,getLatestBlogs,insertCategory, insertSubCategory, insertSubSubCategory, updateCategory, updateSubCategory, updatesubsubcategory, deletecategory, deletesubcategory, deletesubsubcategory, getAll, getSpecificCategory, getSpecificSubcategory, getSpecificSubSubcategory, fetchCategoryUrlPriorityFreq, editCategoryUrlPriorityFreq, fetchCategoryUrlPriorityFreqById,fetchCategoryUrlmeta, editCategoryUrlmeta, fetchCategoryUrlmetaById  } = require('../controller/newsCategory')
const { uploadLogo } = require("../middleware/logoUpload")

const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/insertNews', requireAuth, uploadPhoto, insertNews,);
router.get('/getNews', requireAuth, getNews);
router.put('/updateNews', requireAuth, uploadPhoto, updateNews);
router.delete('/deleteNews', requireAuth, deleteNews);
router.get('/getNewsById', requireAuth, getNewsById);
router.get('/countNews', requireAuth, countNews);
router.delete('/:id/image/:imageFilename/:index', requireAuth, deletePhotoAndAltText);
router.get('/fetchUrlPriorityFreq', requireAuth, fetchUrlPriorityFreq)
router.put('/editUrlPriorityFreq', requireAuth, editUrlPriorityFreq)
// router.delete('/deleteUrlPriorityFreq',requireAuth,deleteUrlPriorityFreq)
router.get('/fetchUrlPriorityFreqById', requireAuth, fetchUrlPriorityFreqById)
router.get('/fetchUrlmeta', requireAuth, fetchUrlmeta)
router.put('/editUrlmeta', requireAuth, editUrlmeta)
router.get('/fetchUrlmetaById', requireAuth, fetchUrlmetaById)


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
router.get('/fetchCategoryUrlmeta', requireAuth, fetchCategoryUrlmeta)
router.put('/editCategoryUrlmeta', requireAuth, editCategoryUrlmeta)
router.get('/fetchCategoryUrlmetaById', requireAuth, fetchCategoryUrlmetaById)

//frontend routes 
router.get("/getNewsFront",getNewsFront)
router.get("/getCategoryBySlug/:slug",getCategoryBySlug)
router.get("/getCategoryBlogsBySlug/:slug",getCategoryBlogsBySlug)
router.get("/getNewsBySlug/:slug",getNewsBySlug)
router.get("/getLatestBlogs",getLatestBlogs)
module.exports = router;
