const express = require('express');
const router = express.Router();

const {
  getAllLogos,
  addLogo,
  deleteLogo,
  downloadLogo
} = require('../controller/logo');
const {uploadLogo} =  require('../middleware/logoUpload')


router.get('/', getAllLogos);
router.post('/', uploadLogo, addLogo);
router.delete('/:imageName', deleteLogo);
router.get('/download/:filename', downloadLogo);

module.exports = router;