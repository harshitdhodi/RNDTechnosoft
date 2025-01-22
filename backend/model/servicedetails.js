const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceDetailsSchema = new Schema({
    heading: {
      type: String,
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
      question: { type: String,  },
      answer: { type: String,  },
    }],
    
    status: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
      ref: 'ServiceCategory',
    },
    subsubcategory: {
      type: mongoose.Schema.Types.ObjectId, // Reference to ServiceCategory
      ref: 'ServiceCategory',
    },
    headingType: {
      type: String,
      enum: [
        'main','sub','subsub'],
      
    },
    slug: {
      type: String,
     
      trim: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  });
  
  // Update updatedAt field before saving
  ServiceDetailsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  

// Create the model
const ServiceDetails = mongoose.model('ServiceDetails', ServiceDetailsSchema);

module.exports = ServiceDetails;
