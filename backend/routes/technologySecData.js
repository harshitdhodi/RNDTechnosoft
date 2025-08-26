const express = require('express');
const router = express.Router();
const {
  createTechnologySecData,
  getAllTechnologySecData,
  getTechnologySecDataById,
  updateTechnologySecData,
  deleteTechnologySecData,
<<<<<<< HEAD
  getDataByTechnologySlug,
  getDataExistsBySlug
=======
  getDataByTechnologySlug
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577
} = require('../controller/technologySecData'); // Adjust path to your controller file
const { handleCardImages } = require('../middleware/TechSecImage'); // Assuming you have a file TechSecImage middleware

// Define routes
router.post('/',handleCardImages, createTechnologySecData);
router.get('/', getAllTechnologySecData);
router.get('/get/:slug', getDataByTechnologySlug);
router.get('/:id', getTechnologySecDataById);
<<<<<<< HEAD
router.get('/slug/:slug', getDataExistsBySlug);
=======
>>>>>>> 4ea6693e6f1060660116c7c7a6b95bbdf368b577

router.put('/:id',handleCardImages, updateTechnologySecData);
router.delete('/:id', deleteTechnologySecData);

module.exports = router;