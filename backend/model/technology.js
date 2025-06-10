const mongoose = require('mongoose');
const TechCategory = require('./TechCategory');

const TechnologySchema = new mongoose.Schema({
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
  },
  slug:{
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TechCategory,
    required: true,
  },
});

module.exports = mongoose.model('Technology', TechnologySchema);