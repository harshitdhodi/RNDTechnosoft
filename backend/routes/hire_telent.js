const express = require('express');
const router = express.Router();
const { handleCardImages } = require('../middleware/TechSecImage');
const HireTalentController = require('../controller/hireTelent');

router.post('/', handleCardImages, HireTalentController.createHireTalent);
router.get('/', HireTalentController.getAllHireTalents);
router.get('/getByPageSection',HireTalentController.getHireTalentsByPageSection)
router.get('/:id', HireTalentController.getHireTalentById);
router.put('/:id', handleCardImages, HireTalentController.updateHireTalent);
router.delete('/:id', HireTalentController.deleteHireTalent);

module.exports = router;