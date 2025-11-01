const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndustriesDetailsSchema = new Schema({
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    photo: [{ type: String, required: false }],
    video: { type: String, required: false },
    description: { type: String, required: false },
    priority: { 
      type: String, 
      required: false, 
      enum: ['high', 'medium', 'low'], 
      default: 'medium' 
    },
    alt: [{ type: String, default: '' }],
    altVideo: { type: String, default: '' },
    imgtitle: [{ type: String, default: '' }], // Optional: Alternate text for images
    videotitle:{ type: String, default: '' }, 
    // Change the structure of question and answer to an array of objects
    questions: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
    servicecategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubcategories: [{ type: String, ref: 'ServiceCategory' }],
    servicesubSubcategories: [{ type: String, ref: 'ServiceCategory' }],
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustriesCategory',
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId, // Reference to IndustriesCategory
      ref: 'IndustriesCategory',
    },
    subsubcategory: {
      type: mongoose.Schema.Types.ObjectId, // Reference to IndustriesCategory
      ref: 'IndustriesCategory',
    },
    headingType: {
      type: String,
      enum: [
        'main','sub','subsub'],
      
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  });
  
  // Update updatedAt field before saving
  IndustriesDetailsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  

// Create the model
const IndustriesDetails = mongoose.model('IndustriesDetails', IndustriesDetailsSchema);

module.exports = IndustriesDetails;
