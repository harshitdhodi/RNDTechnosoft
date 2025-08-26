const express = require('express');
const {
  getHeroSectionByCategory,upsertHeroSectionSubSub,
  upsertHeroSection,getHeroSectionByCategorySubSub,
  getHeroSectionBySlug,upsertHeroSectionSub,getHeroSectionByCategorySub
} = require('../controller/heroSection'); // Adjust the path as necessary

const router = express.Router();

// Route to get HeroSection by category ID
router.get('/:categoryId', getHeroSectionByCategory);
router.get('/sub/:categoryId/:subcategoryId', getHeroSectionByCategorySub);
router.get('/subsub/:categoryId/:subcategoryId/:subsubcategoryId',getHeroSectionByCategorySubSub)
router.get('/front/:slug',getHeroSectionBySlug)
// Route to insert/update HeroSection by category ID
router.put('/main/:categoryId', upsertHeroSection);
router.put('/sub/:categoryId/:subcategoryId',upsertHeroSectionSub)
router.put('/subsub/:categoryId/:subcategoryId/:subsubcategoryId',upsertHeroSectionSubSub)

module.exports = router;
