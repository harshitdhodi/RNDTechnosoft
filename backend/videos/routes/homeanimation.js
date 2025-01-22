const express = require('express');
const {
    createHomeAnimation,
    getHomeAnimations,
    getHomeAnimationById,
    updateHomeAnimation,
    deleteHomeAnimation,
    getLatestHomeAnimations,
    deleteImgvideo
} = require('../controller/homeanimation'); // Adjust the path as necessary

const { uploadImg } = require("../middleware/uploadImg")
const router = express.Router();
const {requireAuth}=require("../middleware/authmiddleware")

// Route to get HeroSection by category ID
router.post('/homeAnimation',requireAuth, uploadImg, createHomeAnimation);
router.get('/getHomeAnimations', getHomeAnimations);
// Get a single HomeAnimation by ID
router.get('/getById',requireAuth, getHomeAnimationById);
router.get('/getlatestData',requireAuth, getLatestHomeAnimations);
// Update a HomeAnimation by ID
router.put('/updateById', requireAuth,uploadImg, updateHomeAnimation);

// Delete a HomeAnimation by ID
router.delete('/delete',requireAuth, deleteHomeAnimation);
router.delete('/deleteImgvideo',requireAuth, deleteImgvideo);
module.exports = router;
