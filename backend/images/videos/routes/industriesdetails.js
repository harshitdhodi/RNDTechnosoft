const express = require('express');
const router = express.Router();

const {
    insertIndustriesDetail,
    insertSubIndustriesDetail,
    insertSubSubIndustriesDetail,
    getIndustriesDetailsByCategory, // Updated to only fetch by category
    getIndustriesDetailsBySubcategory,
    getIndustriesDetailsBySubSubcategory,
    updateIndustriesDetail,
    updateSubIndustriesDetail,
    updateSubSubIndustriesDetail,
    deleteIndustriesDetail,
    getIndustriesDetailById,
    countIndustriesDetailsByCategory, // Count by category
    deletePhotoAndAltText,
    deleteVideoAndAltText,deleteQuestionFromIndustriesDetail,getIndustriesDetailsByslug
} = require('../controller/industriesdetails');
const { uploadMedia } = require('../middleware/uploadMedia');
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/insertIndustriesDetail', requireAuth, uploadMedia, insertIndustriesDetail);
router.post('/insertSubIndustriesDetail', requireAuth, uploadMedia, insertSubIndustriesDetail);
router.post('/insertSubSubIndustriesDetail', requireAuth, uploadMedia, insertSubSubIndustriesDetail);


router.get('/getIndustriesDetails', requireAuth, getIndustriesDetailsByCategory);
router.get('/getSubIndustriesDetails', requireAuth, getIndustriesDetailsBySubcategory);
router.get('/getSubSubIndustriesDetails', requireAuth, getIndustriesDetailsBySubSubcategory);

router.put('/updateIndustriesDetail', requireAuth, uploadMedia, updateIndustriesDetail);
router.put('/updateSubIndustriesDetail', requireAuth, uploadMedia, updateSubIndustriesDetail);
router.put('/updateSubSubIndustriesDetail', requireAuth, uploadMedia, updateSubSubIndustriesDetail);

router.delete('/deleteIndustriesDetail', requireAuth, deleteIndustriesDetail);
router.get('/getIndustriesDetailById', requireAuth, getIndustriesDetailById);
router.get('/countIndustriesDetails', requireAuth, countIndustriesDetailsByCategory);
router.delete('/:id/image/:imageFilename/:index', requireAuth, deletePhotoAndAltText);
router.delete('/IndustriesDetail/:id/video/:videoFilename', requireAuth, deleteVideoAndAltText);
router.delete('/:IndustriesDetailId/questions/:questionId', deleteQuestionFromIndustriesDetail);
router.get('/front/:slug',getIndustriesDetailsByslug)
module.exports = router;
