const express = require('express');
const router = express.Router();
const metaController = require('../controller/staticMeta');
const {uploadSub} = require('../middleware/subSection')
router.post('/add-meta',uploadSub, metaController.createMeta);
router.get('/get-meta', metaController.getAllMetas);
router.get('/metaBySlug', metaController.getMetaBySlug);
router.get('/get-meta/:id', metaController.getMetaById);
router.put('/update-meta/:id',uploadSub, metaController.updateMeta);
router.delete('/delete-meta/:id', metaController.deleteMeta);

module.exports = router;
