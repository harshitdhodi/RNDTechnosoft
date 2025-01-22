const express = require('express');
const router = express.Router();

const {
  getAllLogos,
  addLogo,
  deleteLogo,
  downloadLogo,
  getHeaderColorLogos,
  getFooterWhiteLogos,
  getHeaderWhiteLogos,
  getFavicon,
  getFooterColorLogos
} = require('../controller/logo');
const { uploadLogo } = require('../middleware/logoUpload')


router.get('/', getAllLogos);
router.post('/', uploadLogo, addLogo);
router.delete('/:imageName', deleteLogo);
router.get('/download/:filename', downloadLogo);
router.get('/headercolor', getHeaderColorLogos);
router.get('/footerwhite', getFooterWhiteLogos);
router.get('/footercolor', getFooterColorLogos);
router.get('/headerwhite', getHeaderWhiteLogos);
router.get('/getfavicon', getFavicon);
module.exports = router;