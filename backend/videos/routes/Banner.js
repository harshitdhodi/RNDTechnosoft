const express = require('express');
const router = express.Router();
const { uploadPhoto } = require('../middleware/fileUpload');
const {insertBanner, getBanner, updateBanner, deleteBanner,getBannerfront, getBannerById,deletePhotoAndAltText,getCountBySection,countBanner} = require('../controller/Banner');
const { requireAuth } = require('../middleware/authmiddleware');


router.post("/insertBanner",requireAuth,uploadPhoto,insertBanner);
router.get('/getBanner',requireAuth, getBanner);
router.get('/countBanner',requireAuth, countBanner);
router.get('/getCountBySection',requireAuth, getCountBySection);
router.put('/updateBanner',requireAuth,uploadPhoto, updateBanner);
router.delete('/deleteBanner',requireAuth, deleteBanner);
router.get('/getBannerById',requireAuth,getBannerById);
router.delete('/:id/image/:imageFilename/:index',requireAuth,deletePhotoAndAltText);
router.get('/front',getBannerfront)
module.exports = router;