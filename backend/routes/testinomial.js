const express = require('express');
const router = express.Router();

const {insertTestimonial, getTestimonialsPackage,
    getTestimonials,getTestimonialsSubSub,
    getTestimonialsSub
    ,getTestimonialRating,
     updateTestimonial,deleteTestimonial,
     getTestimonialsFront, getTestimonialById,
     countTestimonial,deletePhotoAndAltText,
     deleteVideoAndAltText,
     getTestimonialsHigh,insertTestimonialForSubCategory,insertTestimonialForSubSubCategory
     } = require('../controller/testimonial');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');
router.post('/insertTestinomial',requireAuth,uploadPhoto , insertTestimonial);
router.post('/insertTestimonialForSubCategory',requireAuth,uploadPhoto , insertTestimonialForSubCategory);
router.post('/insertTestimonialForSubSubCategory',requireAuth,uploadPhoto , insertTestimonialForSubSubCategory);

router.get('/getTestimonial' , getTestimonials);
router.get('/sub/getTestimonial' , getTestimonialsSub);
router.get('/subsub/getTestimonial' , getTestimonialsSubSub);

router.put('/updateTestimonial',requireAuth,uploadPhoto, updateTestimonial)
router.delete('/deleteTestimonial' ,requireAuth, deleteTestimonial)
router.get('/getTestimonialById', requireAuth,getTestimonialById)
router.get('/countTestimonial',requireAuth, countTestimonial)
router.delete('/:id/image/:imageFilename/:index',requireAuth, deletePhotoAndAltText)
router.delete('/testimonial/:id/video/:videoFilename', deleteVideoAndAltText);
router.get('/getTestimonialsHigh/:slug',getTestimonialsHigh)

router.get('/getTestimonialsPackage/:slug' , getTestimonialsPackage);
router.get('/getTestimonialsFront' , getTestimonialsFront);

router.get('/getTestimonialRating' , getTestimonialRating);


module.exports = router;