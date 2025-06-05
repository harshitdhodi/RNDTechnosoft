const mongoose = require('mongoose');
const IndustryCategory = require('../model/industriescategory'); // Assuming you have an IndustryCategory model
const caseStudySchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  subHeading: {
    type: String,
    trim: true,
  },
  photo: {
    type: String, // URL or file path
    required: true,
  },
  altImg: {
    type: String,
    trim: true,
  },
  imgTitle: {
    type: String,
    trim: true,
  },
  details: {
    type: String,
    required: true,
  },
  industryCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: IndustryCategory,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);