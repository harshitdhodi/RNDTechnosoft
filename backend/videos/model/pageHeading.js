const mongoose = require('mongoose');

const PageHeadingSchema = new mongoose.Schema({
  pageType: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true
  },
  subheading: {
    type: String
  },
  photo:{
    type:String,
  },
  alt:{
    type:String,
    default:''
  },
  imgTitle:{
    type:String,
    default:''
  }
});

module.exports = mongoose.model('PageHeadings', PageHeadingSchema);