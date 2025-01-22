const express = require('express');
const router = express.Router();
const sitemapController = require('../controller/sitemap');


router.post('/generateSitemapIndex', sitemapController.generateSitemapIndex);
router.post('/generatemainssitemap', sitemapController.generateMainSitemap);
router.post('/generateproductsitemap', sitemapController.generateProductSitemap);
router.post('/generateservicesitemap', sitemapController.generateServiceSitemap);
router.post('/generatepackagesitemap', sitemapController.generatePackageSitemap);

router.post('/generatenewssitemap', sitemapController.generateNewsSitemap);
router.post('/createsitemap', sitemapController.createSitemap);
router.get('/fetchUrlPriorityFreq', sitemapController.fetchUrlPriorityFreq);
router.put('/editUrlPriorityFreq', sitemapController.editUrlPriorityFreq);
router.get('/fetchUrlPriorityFreqById', sitemapController.fetchUrlPriorityFreqById);
router.get('/fetchSitemaps', sitemapController.fetchSitemaps);
router.get('/fetchSitemapById', sitemapController.fetchSitemapById);
router.put('/updateSitemapById', sitemapController.updateSitemapById);

module.exports = router;
