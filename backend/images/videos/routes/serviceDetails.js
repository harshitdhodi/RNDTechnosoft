const express = require('express');
const router = express.Router();

const {
    insertServiceDetail,
    insertSubServiceDetail,
    insertSubSubServiceDetail,
    getServiceDetailsByCategory, // Updated to only fetch by category
    getServiceDetailsBySubcategory,
    getServiceDetailsBySubSubcategory,
    updateServiceDetail,
    updateSubServiceDetail,
    updateSubSubServiceDetail,
    deleteServiceDetail,
    getServiceDetailById,
    countServiceDetailsByCategory, // Count by category
    deletePhotoAndAltText,
    deleteVideoAndAltText,deleteQuestionFromServiceDetail,getServiceDetailsByslug
} = require('../controller/serviceDetails');
const { uploadMedia } = require('../middleware/uploadMedia');
const { requireAuth } = require('../middleware/authmiddleware');

router.post('/insertServiceDetail', requireAuth, uploadMedia, insertServiceDetail);
router.post('/insertSubServiceDetail', requireAuth, uploadMedia, insertSubServiceDetail);
router.post('/insertSubSubServiceDetail', requireAuth, uploadMedia, insertSubSubServiceDetail);


router.get('/getServiceDetails', requireAuth, getServiceDetailsByCategory);
router.get('/getSubServiceDetails', requireAuth, getServiceDetailsBySubcategory);
router.get('/getSubSubServiceDetails', requireAuth, getServiceDetailsBySubSubcategory);

router.put('/updateServiceDetail', requireAuth, uploadMedia, updateServiceDetail);
router.put('/updateSubServiceDetail', requireAuth, uploadMedia, updateSubServiceDetail);
router.put('/updateSubSubServiceDetail', requireAuth, uploadMedia, updateSubSubServiceDetail);

router.delete('/deleteServiceDetail', requireAuth, deleteServiceDetail);
router.get('/getServiceDetailById', requireAuth, getServiceDetailById);
router.get('/countServiceDetails', requireAuth, countServiceDetailsByCategory);
router.delete('/:id/image/:imageFilename/:index', requireAuth, deletePhotoAndAltText);
router.delete('/serviceDetail/:id/video/:videoFilename', requireAuth, deleteVideoAndAltText);
router.delete('/:serviceDetailId/questions/:questionId', deleteQuestionFromServiceDetail);
router.get('/front/:slug',getServiceDetailsByslug)
module.exports = router;
