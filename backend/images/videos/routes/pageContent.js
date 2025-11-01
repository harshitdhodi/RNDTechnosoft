const express = require('express');
const router = express.Router();
const pageContentController = require('../controller/PageContent');
const { uploadPhoto } = require('../middleware/fileUpload');
const { requireAuth } = require('../middleware/authmiddleware');


router.post('/insertPagecontent',requireAuth, uploadPhoto,pageContentController.createPageContent);
router.get('/getPagecontent', requireAuth,pageContentController.getAllPageContents);
router.get('/getPageContentById',requireAuth, pageContentController.getPageContentById);
router.put('/updatePagecontent',requireAuth,uploadPhoto, pageContentController.updatePageContent);
router.delete('/deletePagecontent', requireAuth,pageContentController.deletePageContentById);
router.delete('/:id/image/:imageFilename/:index', requireAuth,pageContentController.deletePhotoAndAltText);

module.exports = router;