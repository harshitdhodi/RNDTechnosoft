const mongoose = require('mongoose');

const PageHeadingSchema = new mongoose.Schema({
  pageType: {
    type: String,
  },
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

module.exports = mongoose.model('PageHeadings', PageHeadingSchema);