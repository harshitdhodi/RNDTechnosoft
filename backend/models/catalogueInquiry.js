const mongoose = require('mongoose');

const catalogueInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  path: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
catalogueInquirySchema.index({ email: 1, createdAt: -1 });

const CatalogueInquiry = mongoose.model('CatalogueInquiry', catalogueInquirySchema);

module.exports = CatalogueInquiry;
