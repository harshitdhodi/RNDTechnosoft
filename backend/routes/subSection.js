const express = require('express');
const router = express.Router();
const {
    updateSubsections, addSubsection, deletesubsection, updateSubsectionsId
} = require('../controller/content');

const { requireAuth } = require('../middleware/authmiddleware');
const { uploadMedia } = require('../middleware/uploadMedia');

router.put('/newsubsections/:id', uploadMedia, updateSubsections);

router.put('/subsections/:id/:subsectionIndex', uploadMedia, updateSubsectionsId);

// Route to delete a question by index
router.delete('/subsections/:contentId/:index', requireAuth, deletesubsection)

router.post('/:id', requireAuth, addSubsection)

module.exports = router;
