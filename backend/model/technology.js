const mongoose = require('mongoose');

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
  }
});

module.exports = mongoose.model('Technology', TechnologySchema);