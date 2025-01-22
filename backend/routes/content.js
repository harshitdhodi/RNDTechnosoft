const express = require('express');
const router = express.Router();
const {
    toggleStatus,
    insertContent,
    getAllContent,
    getContentByType,
    updateContent,
    updateQuestions,
    getContentTypeByType,
    getToolsByServiceSlug,
    updateSubsections, addQuestions, addSubsection, deletePhotoAndAltText, deleteVideoAndAltText, deleteQuestion, deletesubsection, updateSubsectionsId
} = require('../controller/content');
const { uploadSub } = require('../middleware/subSection');

const { requireAuth } = require('../middleware/authmiddleware');
const { uploadMedia } = require('../middleware/uploadMedia');
// In your router file
router.post('/content/:id/questions', addQuestions);

router.post('/:contentType', requireAuth, uploadMedia, insertContent); // Insert new content
router.get('/', requireAuth, getAllContent); // Get all contents
router.get('/getToolsByServiceSlug', getToolsByServiceSlug); 
router.put('/toggleStatus', requireAuth, toggleStatus);
router.get('/type/:contentType', requireAuth, getContentTypeByType); // Get contents by content type
router.get('/types/:contentType', getContentByType); // Get contents by content type
router.put('/:contentType', requireAuth, uploadMedia, updateContent); // Update content by ID
router.put('/update/questions/:id', updateQuestions);
router.put('/newsubsections/:id', uploadMedia, updateSubsections);
router.post('/update/questions/:id', addQuestions)
router.delete('/deletePhotoAndAltText/:id/:imageFilename/:index', requireAuth, deletePhotoAndAltText)

router.delete('/:id/video/:videoFilename', requireAuth, deleteVideoAndAltText)
router.put('/subsections/:id/:subsectionIndex', uploadMedia, updateSubsectionsId);

// Route to delete a question by index
router.delete('/:id/question/:questionIndex', requireAuth, deleteQuestion);
router.delete('/subsections/:contentId/:index', requireAuth, deletesubsection)


module.exports = router;
