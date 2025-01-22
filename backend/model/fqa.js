const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the FAQ
const FAQSchema = new mongoose.Schema({
  question: { type: String},
  answer: { type: String},
  status: { type: String, default: false, },
  photo: [{ type: String }],
  serviceparentCategoryId: { type: String, ref: 'ServiceCategory' },
  servicesubCategoryId: { type: String, ref: 'ServiceCategory' },
  servicesubSubCategoryId: { type:String, ref: 'ServiceCategory' },
  industryparentCategoryId: { type: String, ref: 'IndustriesCategory' },
  industrysubCategoryId: { type: String, ref: 'IndustriesCategory' },
  industrysubSubCategoryId: { type:String, ref: 'IndustriesCategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
});

FAQSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const FAQ = mongoose.model('FAQ', FAQSchema);

module.exports = FAQ;