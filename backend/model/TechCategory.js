const mongoose = require('mongoose');

const TechCategorySchema = new mongoose.Schema({
  heading: {
    type: String,
  },
  subheading: {
    type: String
  },
  photo: {
    type: String,
  },
  alt: {
    type: String,
    default: ''
  },
  imgTitle: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('TechCategory', TechCategorySchema);