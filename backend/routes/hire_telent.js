const express = require('express');
const router = express.Router();
const { TechSecImage } = require('../middleware/TechSecImage');
const HireTalentController = require('../controller/hireTelent');

router.post('/', TechSecImage, HireTalentController.createHireTalent);
router.get('/', HireTalentController.getAllHireTalents);
router.get('/:id', HireTalentController.getHireTalentById);
router.put('/:id', TechSecImage, HireTalentController.updateHireTalent);
router.delete('/:id', HireTalentController.deleteHireTalent);

module.exports = router;