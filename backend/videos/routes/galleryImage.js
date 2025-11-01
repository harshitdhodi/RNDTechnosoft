const express = require('express');
const router = express.Router();
const imageController = require('../controller/gallery');
const galleryCategoryController = require('../controller/galleryCategory');
const {uploadLogo}=require("../middleware/logoUpload")
const { uploadImage } = require('../middleware/imageUpload');
const { requireAuth } = require('../middleware/authmiddleware');


router.get('/getGallery', imageController.getAllImages);
router.post('/createGallery', uploadImage, imageController.addNewImage);
router.delete('/deleteGallery', imageController.deleteImage);
router.get('/download/:filename', imageController.downloadImage);
router.put('/updateGallery', requireAuth,uploadImage,imageController.updateImage);
router.get('/getGalleryById', requireAuth,uploadImage, imageController.getGalleryById);

router.get('/getCategory',requireAuth,galleryCategoryController.getAllCategories);
router.get('/getCategoryById', requireAuth,galleryCategoryController.getCategoryById);
router.post('/createCategory', requireAuth,uploadLogo,galleryCategoryController.createCategory);
router.put('/updateCategory',requireAuth,uploadLogo, galleryCategoryController.updateCategory);
router.delete('/deleteCategory',requireAuth, galleryCategoryController.deleteCategory);


module.exports = router;
